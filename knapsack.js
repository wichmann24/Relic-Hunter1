// ============================================================
// knapsack.js — Problema da Mochila 0/1 (Knapsack 0/1)
//
// Seleciona o subconjunto de itens com maior valor total
// sem exceder a capacidade de peso da mochila.
//
// Abordagem: Programação Dinâmica
// Complexidade: O(n × W) tempo e espaço
//   n = número de itens
//   W = capacidade máxima (MAX_WEIGHT)
// ============================================================

/**
 * Knapsack 0/1 via Programação Dinâmica.
 *
 * @param {Array<{weight: number, value: number}>} items
 * @param {number} capacity - Peso máximo suportado
 * @returns {{ maxValue: number, selected: number[] }}
 *   maxValue  → maior valor alcançável dentro da capacidade
 *   selected  → índices (0-based) dos itens escolhidos
 */
function knapsack01(items, capacity) {
  const n = items.length;

  // dp[i][c] = maior valor usando os primeiros i itens com capacidade c
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { weight: w, value: v } = items[i - 1];
    for (let c = 0; c <= capacity; c++) {
      // Opção 1: não incluir o item i
      dp[i][c] = dp[i - 1][c];
      // Opção 2: incluir o item i (se couber)
      if (c >= w && dp[i - 1][c - w] + v > dp[i][c]) {
        dp[i][c] = dp[i - 1][c - w] + v;
      }
    }
  }

  // Backtracking para descobrir quais itens foram selecionados
  const selected = [];
  let c = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][c] !== dp[i - 1][c]) {
      selected.push(i - 1); // índice 0-based
      c -= items[i - 1].weight;
    }
  }

  return {
    maxValue: dp[n][capacity],
    selected,           // índices dos itens incluídos na solução ótima
  };
}
