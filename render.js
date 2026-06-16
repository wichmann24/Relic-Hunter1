// ============================================================
// render.js — Renderização do canvas principal e overlay
// ============================================================

const canvas  = document.getElementById('game-canvas');
const ctx     = canvas.getContext('2d');
const ovc     = document.getElementById('overlay-canvas');
const oCtx    = ovc.getContext('2d');

canvas.width  = W;
canvas.height = H;
ovc.width     = W;
ovc.height    = H;

// ---- Tile rendering ----------------------------------------

function drawTile(r, c) {
  const x = c * TILE, y = r * TILE;
  const t = map[r][c];

  ctx.fillStyle = TILE_COLORS[t] || TILE_COLORS[T_FLOOR];
  ctx.fillRect(x, y, TILE, TILE);

  if (t === T_WALL) {
    // Tijolo escurecido com detalhes de alvenaria
    ctx.fillStyle = '#1A1008';
    ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = '#3A2F25';
    if (r % 2 === 0) {
      ctx.fillRect(x, y + TILE / 2 - 1, TILE, 2);
      ctx.fillRect(x + TILE / 2, y, 2, TILE / 2 - 1);
    } else {
      ctx.fillRect(x, y + TILE / 2 - 1, TILE, 2);
      ctx.fillRect(x + TILE / 4, y + TILE / 2 + 1, 2, TILE / 2 - 1);
      ctx.fillRect(x + TILE * 3 / 4, y + TILE / 2 + 1, 2, TILE / 2 - 1);
    }

  } else if (t === T_FLOOR) {
    // Textura de areia com detalhes de pedra
    ctx.fillStyle = '#B89455';
    if ((r + c) % 3 === 0) ctx.fillRect(x + 4, y + 4, 6, 2);
    if ((r + c) % 5 === 1) ctx.fillRect(x + 18, y + 20, 4, 4);

  } else if (t === T_RELIC) {
    // Chão + brilho dourado + emoji da relíquia
    ctx.fillStyle = '#B89455';
    if ((r + c) % 3 === 0) ctx.fillRect(x + 4, y + 4, 6, 2);
    const gc = ctx.createRadialGradient(x + TILE/2, y + TILE/2, 2, x + TILE/2, y + TILE/2, TILE * 0.6);
    gc.addColorStop(0, 'rgba(212,160,23,0.4)');
    gc.addColorStop(1, 'rgba(212,160,23,0)');
    ctx.fillStyle = gc;
    ctx.fillRect(x, y, TILE, TILE);
    const rel = relics.find(rr => rr.row === r && rr.col === c);
    ctx.font = `${TILE * 0.6}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(rel ? rel.type.emoji : '💎', x + TILE / 2, y + TILE / 2);

  } else if (t === T_EXIT) {
    ctx.fillStyle = '#2C6B2C';
    ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
    ctx.font = `${TILE * 0.55}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚪', x + TILE / 2, y + TILE / 2);
  }
}

function renderMap() {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      drawTile(r, c);
}

// ---- Player rendering --------------------------------------

function renderPlayer() {
  const x = player.col * TILE, y = player.row * TILE;
  // Sombra
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x + TILE / 2, y + TILE - 4, TILE / 4, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // Corpo
  ctx.fillStyle = '#2980B9';
  ctx.fillRect(x + 8, y + 10, TILE - 16, TILE - 14);
  // Chapéu de arqueólogo
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(x + 4, y + 4, TILE - 8, 8);
  ctx.fillRect(x + 10, y - 2, TILE - 20, 8);
  // Rosto
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(x + 10, y + 10, TILE - 20, 10);
}

// ---- Overlay (rotas TSP e BFS) -----------------------------

function renderOverlay() {
  oCtx.clearRect(0, 0, W, H);

  // Rota TSP em roxo tracejado
  if (showTSP && tspPath && tspPath.length > 1) {
    oCtx.strokeStyle = '#8E44AD';
    oCtx.lineWidth = 2.5;
    oCtx.setLineDash([6, 3]);
    oCtx.beginPath();
    tspPath.forEach((pt, i) => {
      const x = pt.col * TILE + TILE / 2, y = pt.row * TILE + TILE / 2;
      i === 0 ? oCtx.moveTo(x, y) : oCtx.lineTo(x, y);
    });
    // Fecha o circuito
    const fp = tspPath[0];
    oCtx.lineTo(fp.col * TILE + TILE / 2, fp.row * TILE + TILE / 2);
    oCtx.stroke();
    oCtx.setLineDash([]);

    // Números de ordem nos pontos
    tspPath.forEach((pt, i) => {
      oCtx.fillStyle = '#8E44AD';
      oCtx.beginPath();
      oCtx.arc(pt.col * TILE + TILE / 2, pt.row * TILE + TILE / 2, 9, 0, Math.PI * 2);
      oCtx.fill();
      oCtx.fillStyle = '#fff';
      oCtx.font = 'bold 10px monospace';
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillText(i + 1, pt.col * TILE + TILE / 2, pt.row * TILE + TILE / 2);
    });
  }

  // Caminho BFS em vermelho tracejado
  if (showBFS && bfsPath && bfsPath.length > 1) {
    oCtx.strokeStyle = '#C0392B';
    oCtx.lineWidth = 2;
    oCtx.setLineDash([4, 4]);
    oCtx.beginPath();
    bfsPath.forEach(([r, c], i) => {
      const x = c * TILE + TILE / 2, y = r * TILE + TILE / 2;
      i === 0 ? oCtx.moveTo(x, y) : oCtx.lineTo(x, y);
    });
    oCtx.stroke();
    oCtx.setLineDash([]);
  }
}

// ---- Função principal de render ----------------------------

function renderAll() {
  renderMap();
  renderPlayer();
  renderOverlay();
}
