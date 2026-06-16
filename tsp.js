// ============================================================
// tsp.js — Travelling Salesman Problem
//
// Estratégia dual:
//   n ≤ 12 → Held-Karp (solução exata, O(n² · 2ⁿ))
//   n > 12 → Nearest Neighbor + 2-opt (heurística, O(n²))
//
// Entrada: array de pontos { row, col }
// Saída:   array de índices representando a ordem de visita
// ============================================================

/**
 * Distância euclidiana entre dois pontos do grid.
 */
function dist(a, b) {
  return Math.hypot(a.col - b.col, a.row - b.row);
}

/**
 * Ponto de entrada do TSP.
 * Escolhe automaticamente o algoritmo com base em n.
 */
function tsp(points) {
  const n = points.length;
  if (n <= 1) return points.map((_, i) => i);

  // Monta matriz de distâncias
  const d = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => dist(points[i], points[j]))
  );

  return n <= 12 ? tspHeldKarp(n, d) : tsp2opt(n, d);
}

// ------------------------------------------------------------
// Held-Karp — Programação Dinâmica Exata
// Estado: dp[mask][u] = menor custo para visitar os nós em
//         `mask` terminando no nó `u`, partindo do nó 0.
// ------------------------------------------------------------
function tspHeldKarp(n, d) {
  const INF = 1e9;
  const size = 1 << n;
  const dp     = Array.from({ length: size }, () => Array(n).fill(INF));
  const parent = Array.from({ length: size }, () => Array(n).fill(-1));

  dp[1][0] = 0; // começa no nó 0, somente ele visitado

  for (let mask = 1; mask < size; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      if (dp[mask][u] === INF) continue;

      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue; // v já visitado
        const newMask = mask | (1 << v);
        const cost = dp[mask][u] + d[u][v];
        if (cost < dp[newMask][v]) {
          dp[newMask][v] = cost;
          parent[newMask][v] = u;
        }
      }
    }
  }

  // Encontra o melhor nó final (retorno ao nó 0)
  const fullMask = size - 1;
  let best = INF, last = -1;
  for (let u = 1; u < n; u++) {
    const c = dp[fullMask][u] + d[u][0];
    if (c < best) { best = c; last = u; }
  }

  // Reconstrói o caminho via backtracking
  const path = [];
  let mask = fullMask, cur = last;
  while (cur !== -1) {
    path.unshift(cur);
    const prev = parent[mask][cur];
    mask ^= (1 << cur);
    cur = prev;
  }
  return path;
}

// ------------------------------------------------------------
// 2-opt — Heurística para n > 12
// 1. Constrói rota gulosa pelo vizinho mais próximo
// 2. Aplica 2-opt: troca pares de arestas enquanto reduzir custo
// ------------------------------------------------------------
function tsp2opt(n, d) {
  // Fase 1: vizinho mais próximo
  const visited = Array(n).fill(false);
  const route = [0];
  visited[0] = true;

  for (let i = 1; i < n; i++) {
    const last = route[route.length - 1];
    let best = -1, bestD = Infinity;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && d[last][j] < bestD) {
        bestD = d[last][j];
        best = j;
      }
    }
    route.push(best);
    visited[best] = true;
  }

  // Fase 2: melhoria 2-opt
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 2; j < n; j++) {
        const gain =
          d[route[i]][route[j]] + d[route[i + 1]][route[(j + 1) % n]] -
          d[route[i]][route[i + 1]] - d[route[j]][route[(j + 1) % n]];
        if (gain < -1e-9) {
          route.splice(i + 1, j - i, ...route.slice(i + 1, j + 1).reverse());
          improved = true;
        }
      }
    }
  }
  return route;
}
