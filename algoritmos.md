# Documentação Algorítmica — Relic Hunter

## 1. TSP — Travelling Salesman Problem

### Justificativa de escolha
O TSP foi integrado como mecânica de **auxílio ao jogador**: ao pressionar T, o jogo mostra qual ordem de coleta das relíquias minimiza a distância total percorrida. Isso transforma um conceito NP-difícil abstrato em algo visível e útil dentro da jogabilidade.

### Implementação

#### Held-Karp (n ≤ 12) — Solução Exata

```
Estado: dp[mask][u] = menor custo para visitar exatamente os
        nós em `mask`, terminando no nó u, partindo do nó 0.

Transição:
  dp[mask | (1<<v)][v] = min(dp[mask | (1<<v)][v],
                              dp[mask][u] + dist(u, v))
  para todo u em mask, v fora de mask.

Resposta: min_{u != 0} (dp[fullMask][u] + dist(u, 0))

Reconstrução: backtracking via tabela `parent`.
```

- **Complexidade de tempo:** `O(n² · 2ⁿ)`
- **Complexidade de espaço:** `O(n · 2ⁿ)`

#### 2-opt (n > 12) — Heurística

1. **Fase gulosa (Nearest Neighbor):** começa no jogador, sempre vai para a relíquia não visitada mais próxima. `O(n²)`
2. **Fase de melhoria (2-opt):** enquanto houver melhora, troca pares de arestas que reduzem o custo total. `O(n²)` por iteração.

### Trade-off discutido
A solução exata garante o ótimo global mas cresce exponencialmente. Para mapas com muitas relíquias, a heurística 2-opt obtém soluções próximas do ótimo em tempo polinomial — típico trade-off de problemas NP-difíceis.

---

## 2. BFS — Busca em Largura

### Justificativa de escolha
BFS garante o **caminho mais curto em grafos não ponderados**, o que é exatamente o caso do grid do jogo (cada movimento custa 1 passo). É preferível ao DFS (que não garante o menor caminho) e ao Dijkstra (desnecessariamente complexo para pesos unitários).

### Implementação

```
Fila FIFO inicializada com a posição do jogador.
Para cada tile desempilhado:
  - Se é a saída → reconstrói caminho via backtracking e retorna.
  - Para cada vizinho (4-conectividade) não visitado e caminhável:
    - Marca como visitado, registra predecessor, enfileira.

Reconstrução: percorre a tabela `prev` do destino até a origem.
```

- **Complexidade:** `O(V + E)` = `O(ROWS × COLS)`

---

## 3. Knapsack 0/1 — Programação Dinâmica

### Justificativa de escolha
Cada relíquia tem peso e valor diferentes. O limite de 15 kg força o jogador a escolher quais itens carregar — exatamente o **Problema da Mochila 0/1**: cada item pode ser incluído ou não (sem frações).

A DP é escolhida sobre o algoritmo guloso porque a abordagem gulosa (pegar sempre o de maior valor/peso) **não garante a solução ótima** para o Knapsack 0/1. A DP é pseudo-polinomial e eficiente para os valores de n e W usados no jogo.

### Implementação

```
dp[i][c] = maior valor usando os primeiros i itens com capacidade c.

dp[0][c] = 0  (sem itens)
dp[i][c] = dp[i-1][c]                         se item i não incluído
         = dp[i-1][c - w_i] + v_i             se item i incluído (c >= w_i)
         → max dos dois

Backtracking:
  Se dp[i][c] != dp[i-1][c] → item i foi incluído
  c -= w_i; continua com i-1.
```

- **Complexidade de tempo:** `O(n × W)`
- **Complexidade de espaço:** `O(n × W)`
- Com n ≤ 15 itens e W = 15, a tabela tem apenas 225 células.

---

## Resumo

| Algoritmo | Onde aparece | Complexidade | Tipo |
|-----------|-------------|--------------|------|
| TSP Held-Karp | Rota de coleta (n ≤ 12) | O(n² · 2ⁿ) | Exato |
| TSP 2-opt | Rota de coleta (n > 12) | O(n²) | Heurístico |
| BFS | Caminho até a saída | O(V + E) | Exato |
| Knapsack 0/1 DP | Otimização de inventário | O(n × W) | Exato |
