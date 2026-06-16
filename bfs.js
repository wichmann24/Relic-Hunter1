// ============================================================
// bfs.js — Busca em Largura (Breadth-First Search)
//
// Encontra o MENOR CAMINHO em número de passos entre dois
// tiles do mapa, respeitando paredes.
//
// Complexidade: O(V + E) onde V = tiles, E = arestas do grid
// ============================================================

/**
 * Verifica se um tile é caminhável (não é parede e está dentro do mapa).
 * Depende do estado global `map` definido em game.js.
 */
function isWalkable(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
  return map[r][c] !== T_WALL;
}

/**
 * BFS no grid. Retorna o caminho como array de [row, col] do início ao fim,
 * ou null se não existir caminho.
 *
 * @param {number} startRow
 * @param {number} startCol
 * @param {number} endRow
 * @param {number} endCol
 * @returns {Array<[number,number]>|null}
 */
function bfs(startRow, startCol, endRow, endCol) {
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const prev    = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const queue   = [[startRow, startCol]];
  visited[startRow][startCol] = true;

  // Direções: cima, baixo, esquerda, direita (movimento cardinal)
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length) {
    const [r, c] = queue.shift();

    if (r === endRow && c === endCol) {
      // Reconstrói o caminho via backtracking
      const path = [];
      let cur = [endRow, endCol];
      while (cur) {
        path.unshift(cur);
        cur = prev[cur[0]][cur[1]];
      }
      return path;
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (!visited[nr]?.[nc] && isWalkable(nr, nc)) {
        visited[nr][nc] = true;
        prev[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }

  return null; // sem caminho
}
