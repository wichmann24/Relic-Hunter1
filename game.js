// ============================================================
// game.js — Lógica principal do jogo
// ============================================================

// Estado global
let map, player, relics, exitPos;
let inventory = [];
let steps = 0, score = 0;
let tspPath = null, bfsPath = null;
let showTSP = false, showBFS = false;
let gameWon = false;

// ---- Inicialização -----------------------------------------

function initGame() {
  const { map: m, rooms, exitPos: ep } = generateMap();
  map     = m;
  exitPos = ep;
  relics  = [];

  // Posiciona relíquias em tiles de chão aleatórios
  const floors = getFloorTiles(map);
  shuffle(floors);
  const nRelics = 7;
  for (let i = 0; i < nRelics; i++) {
    const [r, c] = floors[i];
    const type = RELIC_TYPES[i % RELIC_TYPES.length];
    relics.push({ row: r, col: c, type, id: i });
    map[r][c] = T_RELIC;
  }

  // Jogador na primeira sala
  player = { row: rooms[0].cy, col: rooms[0].cx };

  // Reset de estado
  inventory = [];
  steps = 0; score = 0;
  tspPath = null; bfsPath = null;
  showTSP = false; showBFS = false;
  gameWon = false;

  document.getElementById('overlay-msg').style.display = 'none';
  renderAll();
  updateUI();
  addLog('Novo mapa gerado! Explore as ruínas e colete relíquias.');
}

// ---- Movimento ---------------------------------------------

function movePlayer(dr, dc) {
  if (gameWon) return;
  const nr = player.row + dr, nc = player.col + dc;
  if (!isWalkable(nr, nc)) return;

  player.row = nr;
  player.col = nc;
  steps++;

  // Caminho BFS é invalidado ao mover (posição mudou)
  showBFS = false;
  bfsPath = null;

  renderAll();
  updateUI();
  checkCurrentTile();
}

function checkCurrentTile() {
  const t = map[player.row][player.col];
  if (t === T_RELIC) {
    addLog('💎 Relíquia aqui! Pressione E para coletar.');
  } else if (t === T_EXIT) {
    winGame();
  }
}

// ---- Coleta de relíquias -----------------------------------

function collectRelic() {
  if (gameWon) return;
  if (map[player.row][player.col] !== T_RELIC) {
    addLog('Não há relíquia neste tile.');
    return;
  }

  const idx = relics.findIndex(r => r.row === player.row && r.col === player.col);
  if (idx === -1) return;
  const rel = relics[idx];

  if (inventory.length >= INV_SIZE) {
    addLog('⚠ Inventário cheio! Descarte um item ou use K (Knapsack).');
    return;
  }
  if (invWeight() + rel.type.weight > MAX_WEIGHT) {
    addLog(`⚠ Pesado demais! ${rel.type.name} pesa ${rel.type.weight}kg. Use K para otimizar.`);
    return;
  }

  // Adiciona ao inventário e remove do mapa
  addItem(rel.type, rel.id);
  score += rel.type.value;
  map[player.row][player.col] = T_FLOOR;
  relics.splice(idx, 1);

  addLog(`✅ Coletou: ${rel.type.emoji} ${rel.type.name} (+${rel.type.value} pts, ${rel.type.weight}kg)`);

  // Invalida TSP (pontos mudaram)
  tspPath = null;
  showTSP = false;

  renderAll();
  updateUI();

  if (relics.length === 0) {
    addLog('🏆 Todas as relíquias coletadas! Encontre a saída 🚪');
  }
}

// ---- TSP ---------------------------------------------------

function runTSP() {
  const points = [
    { row: player.row, col: player.col, label: 'Você' },
    ...relics.map(r => ({ row: r.row, col: r.col, label: r.type.name }))
  ];

  if (points.length < 2) {
    addLog('Nenhuma relíquia no mapa para calcular rota.');
    document.getElementById('tsp-result').textContent = 'Nenhum ponto para roteirizar.';
    return;
  }

  const order = tsp(points);
  tspPath = order.map(i => points[i]);
  showTSP = true;

  const algo = points.length <= 12 ? 'Held-Karp (exato)' : '2-opt (heurística)';
  let totalD = 0;
  for (let i = 0; i < tspPath.length; i++)
    totalD += dist(tspPath[i], tspPath[(i + 1) % tspPath.length]);

  document.getElementById('tsp-result').innerHTML =
    `<strong>${algo}</strong> — ${points.length} pontos<br>` +
    `Rota: ${tspPath.map(p => p.label || '?').join(' → ')} → início<br>` +
    `Distância total: <strong>${totalD.toFixed(1)} tiles</strong>`;

  addLog(`📍 Rota TSP calculada (${algo}) com ${points.length} pontos.`);
  renderAll();
}

// ---- BFS ---------------------------------------------------

function runBFS() {
  const path = bfs(player.row, player.col, exitPos.row, exitPos.col);
  if (!path) {
    addLog('❌ Sem caminho até a saída.');
    return;
  }
  bfsPath = path;
  showBFS = true;
  addLog(`🔴 BFS: caminho até saída com ${path.length - 1} passos.`);
  renderAll();
}

// ---- Knapsack Modal ----------------------------------------

let ksSelected = [];

function openKnapsack() {
  const modal = document.getElementById('knapsack-modal');
  const itemsDiv = document.getElementById('knapsack-items');
  document.getElementById('ks-result').innerHTML = 'Clique em "Executar" para otimizar.';
  ksSelected = [];

  // Candidatos: itens no inventário + relíquias ainda no mapa
  const allItems = [
    ...inventory.map((it, i) => ({ ...it, src: 'inv', idx: i, label: `[Inventário] ${it.type.emoji} ${it.type.name}` })),
    ...relics.map((r, i)  => ({ type: r.type, src: 'map', idx: i, label: `[Mapa] ${r.type.emoji} ${r.type.name}` }))
  ];

  itemsDiv.innerHTML = '';
  allItems.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'ks-item';
    div.dataset.idx = i;
    div.innerHTML =
      `<span class="ks-em">${item.type.emoji}</span>` +
      `<span class="ks-name">${item.label}</span>` +
      `<span class="ks-stats">${item.type.weight}kg | ${item.type.value}pts</span>`;
    itemsDiv.appendChild(div);
  });

  // Executar Knapsack DP
  document.getElementById('btn-ks-run').onclick = () => {
    const ksItems = allItems.map(a => ({ weight: a.type.weight, value: a.type.value }));
    if (!ksItems.length) {
      document.getElementById('ks-result').textContent = 'Nenhum item disponível.';
      return;
    }

    const { maxValue, selected } = knapsack01(ksItems, MAX_WEIGHT);
    ksSelected = selected;

    document.querySelectorAll('.ks-item').forEach((el, i) => {
      el.classList.toggle('selected', ksSelected.includes(i));
    });

    const sel = selected.map(i => allItems[i]);
    const tw  = sel.reduce((s, it) => s + it.type.weight, 0);
    document.getElementById('ks-result').innerHTML =
      `<strong>Valor máximo: ${maxValue} pts</strong> | Peso: ${tw}/${MAX_WEIGHT}kg<br>` +
      `Selecionados: ${sel.map(it => it.type.emoji + ' ' + it.type.name).join(', ')}`;

    addLog(`⚖ Knapsack DP: valor máximo ${maxValue}pts com ${sel.length} itens.`);
  };

  // Aplicar seleção (reorganiza inventário com os itens ótimos do inventário)
  document.getElementById('btn-ks-apply').onclick = () => {
    if (!ksSelected.length) { addLog('Execute o Knapsack primeiro.'); return; }
    const invItems = allItems.filter((a, i) => a.src === 'inv' && ksSelected.includes(i));
    inventory = invItems.map(a => ({ type: a.type, id: a.idx }));
    addLog(`✅ Inventário otimizado: ${inventory.length} itens, ${invWeight()}kg, ${invValue()}pts.`);
    modal.classList.remove('open');
    updateUI();
  };

  document.getElementById('btn-ks-close').onclick = () => modal.classList.remove('open');
  modal.classList.add('open');
}

// ---- Win ---------------------------------------------------

function winGame() {
  gameWon = true;
  const msg = document.getElementById('overlay-msg');
  msg.style.display = 'block';
  document.getElementById('omsg-title').textContent = '🏆 Expedição Concluída!';
  document.getElementById('omsg-body').textContent =
    `Relíquias: ${inventory.length} | Pontuação: ${score} | Passos: ${steps}. Pressione R para novo mapa.`;
  addLog(`🏆 Vitória! Pontuação final: ${score} pts em ${steps} passos.`);
}

// ---- UI helpers --------------------------------------------

function updateUI() {
  renderInventoryUI();
  document.getElementById('s-score').textContent = score;
  document.getElementById('s-steps').textContent = steps;
}

function addLog(msg) {
  const log = document.getElementById('log');
  const p   = document.createElement('p');
  p.textContent = msg;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
  if (log.children.length > 30) log.removeChild(log.firstChild);
}

// ---- Botões ------------------------------------------------

document.getElementById('btn-tsp').addEventListener('click', () => {
  runTSP();
  const btn = document.getElementById('btn-tsp');
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 800);
});
document.getElementById('btn-bfs').addEventListener('click', () => {
  runBFS();
  const btn = document.getElementById('btn-bfs');
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 800);
});
document.getElementById('btn-ks').addEventListener('click', openKnapsack);

// ---- Teclado -----------------------------------------------

const keyMap = {
  'ArrowUp':    () => movePlayer(-1,  0),
  'ArrowDown':  () => movePlayer( 1,  0),
  'ArrowLeft':  () => movePlayer( 0, -1),
  'ArrowRight': () => movePlayer( 0,  1),
  'w': () => movePlayer(-1,  0), 'W': () => movePlayer(-1,  0),
  's': () => movePlayer( 1,  0), 'S': () => movePlayer( 1,  0),
  'a': () => movePlayer( 0, -1), 'A': () => movePlayer( 0, -1),
  'd': () => movePlayer( 0,  1), 'D': () => movePlayer( 0,  1),
  'e': collectRelic,  'E': collectRelic,
  't': runTSP,        'T': runTSP,
  'b': runBFS,        'B': runBFS,
  'k': openKnapsack,  'K': openKnapsack,
  'r': initGame,      'R': initGame,
};

document.addEventListener('keydown', e => {
  if (keyMap[e.key]) { e.preventDefault(); keyMap[e.key](); }
});

// ---- Start -------------------------------------------------
initGame();
