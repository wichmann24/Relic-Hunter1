// ============================================================
// map.js — Geração procedural de mapas (salas + corredores)
// ============================================================

/**
 * Gera um mapa novo com salas retangulares interligadas por corredores.
 * Posiciona relíquias e a saída em tiles de chão aleatórios.
 *
 * @returns {{ map: number[][], rooms: Array<{cx,cy}>, exitPos: {row,col} }}
 */
function generateMap() {
  // Inicializa tudo como parede
  const m = Array.from({ length: ROWS }, () => Array(COLS).fill(T_WALL));
  const rooms = [];

  /**
   * Abre uma sala retangular no mapa.
   */
  function carveRoom(x, y, w, h) {
    for (let r = y; r < y + h; r++)
      for (let c = x; c < x + w; c++)
        if (r > 0 && r < ROWS - 1 && c > 0 && c < COLS - 1)
          m[r][c] = T_FLOOR;
    rooms.push({ cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2) });
  }

  /**
   * Abre um corredor em L entre dois centros de sala.
   */
  function tunnel(r1, r2) {
    let { cx: x1, cy: y1 } = r1;
    let { cx: x2, cy: y2 } = r2;
    while (x1 !== x2) {
      if (y1 > 0 && y1 < ROWS - 1 && x1 > 0 && x1 < COLS - 1) m[y1][x1] = T_FLOOR;
      x1 += x1 < x2 ? 1 : -1;
    }
    while (y1 !== y2) {
      if (y1 > 0 && y1 < ROWS - 1 && x1 > 0 && x1 < COLS - 1) m[y1][x1] = T_FLOOR;
      y1 += y1 < y2 ? 1 : -1;
    }
    if (y1 > 0 && y1 < ROWS - 1 && x1 > 0 && x1 < COLS - 1) m[y1][x1] = T_FLOOR;
  }

  // Layout fixo de salas (pode ser aleatorizado futuramente)
  carveRoom(1,  1,  5, 4);
  carveRoom(7,  1,  4, 3);
  carveRoom(13, 1,  4, 5);
  carveRoom(1,  6,  4, 5);
  carveRoom(6,  5,  5, 4);
  carveRoom(12, 7,  5, 5);
  carveRoom(3,  10, 6, 3);
  carveRoom(9,  10, 4, 3);

  // Conecta salas sequencialmente + fecha o anel
  for (let i = 0; i < rooms.length - 1; i++) tunnel(rooms[i], rooms[i + 1]);
  tunnel(rooms[0], rooms[rooms.length - 1]);

  // Saída na última sala
  const lastRoom = rooms[rooms.length - 1];
  const exitPos  = { row: lastRoom.cy, col: lastRoom.cx };
  m[exitPos.row][exitPos.col] = T_EXIT;

  return { map: m, rooms, exitPos };
}

/**
 * Embaralha um array in-place (Fisher-Yates).
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

/**
 * Coleta todas as posições de chão livres do mapa.
 */
function getFloorTiles(m) {
  const floors = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (m[r][c] === T_FLOOR) floors.push([r, c]);
  return floors;
}
