# ⛏ Relic Hunter

> Jogo de exploração arqueológica com algoritmos clássicos da Ciência da Computação integrados à jogabilidade.

## 🎮 Como jogar

Abra o `index.html` diretamente no navegador — sem servidor, sem dependências.

| Tecla | Ação |
|-------|------|
| `↑ ↓ ← →` ou `WASD` | Mover o arqueólogo |
| `E` | Coletar relíquia (quando em cima dela) |
| `T` | Calcular e exibir rota TSP |
| `B` | Traçar caminho BFS até a saída |
| `K` | Abrir otimizador de mochila (Knapsack) |
| `R` | Gerar novo mapa |

**Objetivo:** coletar o máximo de relíquias possível respeitando o limite de peso (15 kg) e chegar à saída 🚪.

---

## 🗂 Estrutura do Repositório

```
relic-hunter/
├── index.html                  # HTML principal + layout
├── README.md
├── docs/
│   └── algoritmos.md           # Justificativa das escolhas algorítmicas
└── src/
    ├── style.css               # Estilos (tema arqueológico)
    ├── constants.js            # Constantes globais (tiles, itens, tamanhos)
    ├── map.js                  # Geração procedural de mapa
    ├── render.js               # Renderização (canvas 2D + overlay)
    ├── inventory.js            # Sistema de inventário
    ├── game.js                 # Lógica principal + controles
    └── algorithms/
        ├── tsp.js              # TSP: Held-Karp + 2-opt
        ├── bfs.js              # BFS: menor caminho no grid
        └── knapsack.js         # Knapsack 0/1: programação dinâmica
```

---

## 🔬 Algoritmos Implementados

### 1. TSP — Travelling Salesman Problem (`src/algorithms/tsp.js`)

Calcula a **rota ótima de coleta** passando por todas as relíquias do mapa e retornando ao ponto inicial.

- **n ≤ 12 pontos** → **Held-Karp** (solução exata via DP com bitmask)  
  Complexidade: `O(n² · 2ⁿ)`
- **n > 12 pontos** → **Nearest Neighbor + 2-opt** (heurística)  
  Complexidade: `O(n²)`

A rota é desenhada no mapa com linha tracejada roxa e numeração da ordem de visita.

### 2. BFS — Busca em Largura (`src/algorithms/bfs.js`)

Encontra o **menor caminho em número de passos** entre o jogador e a saída, respeitando paredes.

- Complexidade: `O(V + E)` onde V = tiles do mapa, E = adjacências (4-conectividade)
- Exibe o caminho em vermelho tracejado sobre o mapa

### 3. Knapsack 0/1 — Programação Dinâmica (`src/algorithms/knapsack.js`)

Dado o limite de peso da mochila (15 kg), seleciona a **combinação de itens com maior valor total**.

- Complexidade: `O(n × W)` onde n = itens, W = capacidade
- Backtracking na tabela DP para identificar os itens selecionados
- Modal interativo permite ver e aplicar a seleção ótima ao inventário

---

## 🏛 Gênero

**Exploração / Aventura** — o jogador navega por ruínas arqueológicas, coleta relíquias e precisa gerenciar recursos (peso, slots) para maximizar a pontuação antes de chegar à saída.

---

## 📋 Issues do Projeto

Ver aba **Issues** do repositório para o detalhamento de cada requisito, critérios de aceitação e labels.

Labels utilizadas: `algoritmo` · `gameplay` · `inventário` · `mapa` · `documentação`
