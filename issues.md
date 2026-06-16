# Issues do Repositório — Relic Hunter

Cole cada bloco abaixo como uma issue separada no GitHub.
Labels a criar primeiro: `algoritmo`, `gameplay`, `inventário`, `mapa`, `documentação`

---

## Issue #1

**Título:** Implementar TSP para cálculo da rota ótima de coleta

**Labels:** `algoritmo`

**Descrição:**
Calcular a menor rota que passe por todos os pontos de coleta marcados no mapa e retorne ao ponto inicial (posição do jogador).

**Critérios de aceitação:**
- [ ] Algoritmo recebe lista de coordenadas: jogador + relíquias presentes no mapa
- [ ] Retorna ordem ótima de visitação (array de índices)
- [ ] Para n ≤ 12 usa solução exata (Held-Karp com bitmask DP)
- [ ] Para n > 12 usa heurística (Nearest Neighbor + 2-opt)
- [ ] Rota é desenhada visualmente no canvas (linha tracejada roxa)
- [ ] Cada ponto exibe sua ordem numérica de visita
- [ ] Painel lateral mostra algoritmo usado, distância total e sequência

**Algoritmo:** Travelling Salesman Problem  
**Complexidade:** O(n² · 2ⁿ) exato / O(n²) heurística

---

## Issue #2

**Título:** Implementar BFS para encontrar caminho até a saída

**Labels:** `algoritmo`, `gameplay`

**Descrição:**
Usar Busca em Largura para encontrar o menor caminho (em número de passos) entre a posição atual do jogador e o tile de saída do mapa, respeitando paredes.

**Critérios de aceitação:**
- [ ] Algoritmo opera sobre o grid do mapa (4-conectividade)
- [ ] Retorna array de tiles `[row, col]` do início ao fim
- [ ] Retorna null se não houver caminho
- [ ] Caminho é desenhado no overlay (linha tracejada vermelha)
- [ ] Caminho é recalculado/apagado sempre que o jogador se move
- [ ] Log exibe o número de passos do caminho encontrado

**Algoritmo:** BFS (Breadth-First Search)  
**Complexidade:** O(V + E) onde V = ROWS × COLS

---

## Issue #3

**Título:** Implementar Knapsack 0/1 para otimização de inventário

**Labels:** `algoritmo`, `inventário`

**Descrição:**
Dado o limite de peso da mochila (15 kg) e os itens disponíveis (inventário + relíquias no mapa), usar programação dinâmica para determinar a combinação de itens com maior valor total possível.

**Critérios de aceitação:**
- [ ] Algoritmo recebe lista de itens com peso e valor
- [ ] Usa DP O(n × W) para encontrar a solução ótima
- [ ] Backtracking identifica quais itens compõem a solução
- [ ] Modal exibe todos os itens candidatos com destaque nos selecionados
- [ ] Mostra valor máximo alcançável e peso total da seleção
- [ ] Botão "Aplicar" reorganiza o inventário com os itens ótimos (apenas os que já estão no inventário)
- [ ] Log registra o resultado da otimização

**Algoritmo:** Knapsack 0/1 (Programação Dinâmica)  
**Complexidade:** O(n × W) onde W = 15 (capacidade)

---

## Issue #4

**Título:** Sistema de inventário com operações de adicionar, remover e consultar

**Labels:** `inventário`, `gameplay`

**Descrição:**
Construir a estrutura de dados do inventário do jogador com todas as operações necessárias e sua representação visual em grid de slots.

**Critérios de aceitação:**
- [ ] Inventário armazena até 8 itens (slots)
- [ ] Operação adicionar: verifica slot livre e peso disponível
- [ ] Operação remover: clique no slot descarta o item
- [ ] Operação consultar: retorna peso total e valor total
- [ ] UI atualiza em tempo real após cada operação
- [ ] Tooltip em cada slot exibe nome, peso e valor do item

**Algoritmo:** Nenhum (estrutura de dados linear)

---

## Issue #5

**Título:** Mecânica de coleta de relíquias no mapa

**Labels:** `gameplay`

**Descrição:**
Implementar a interação entre o jogador e os tiles de relíquia: detectar proximidade, validar coleta (peso/slots) e atualizar estado do mapa e inventário.

**Critérios de aceitação:**
- [ ] Relíquias são posicionadas em tiles de chão aleatórios ao iniciar
- [ ] Tile de relíquia exibe emoji e brilho dourado
- [ ] Jogador precisa estar sobre a relíquia e pressionar E para coletar
- [ ] Coleta é bloqueada se inventário cheio ou peso excedido
- [ ] Tile volta a ser chão após coleta
- [ ] Score aumenta com o valor da relíquia coletada
- [ ] Log registra cada coleta com nome, valor e peso

**Algoritmo:** Nenhum (lógica de jogo)

---

## Issue #6

**Título:** Geração procedural do mapa com salas e corredores

**Labels:** `mapa`

**Descrição:**
Implementar o gerador de mapas que cria salas retangulares interligadas por corredores, garante conectividade, posiciona a saída e o spawn do jogador.

**Critérios de aceitação:**
- [ ] Mapa tem dimensões fixas (18×14 tiles)
- [ ] Salas são escavadas no grid inicialmente todo-parede
- [ ] Corredores em L conectam todos os pares de salas adjacentes + fecha anel
- [ ] Saída (🚪) posicionada na última sala
- [ ] Jogador começa na primeira sala
- [ ] Relíquias são colocadas em tiles de chão aleatórios (sem colisão com saída/jogador)
- [ ] Novo mapa gerado ao pressionar R

**Algoritmo:** Geração procedural simples (sem algoritmo específico)

---

## Issue #7

**Título:** README e documentação algorítmica

**Labels:** `documentação`

**Descrição:**
Criar o README do repositório e o documento `docs/algoritmos.md` com justificativa das escolhas algorítmicas, complexidades e como cada algoritmo se integra à jogabilidade.

**Critérios de aceitação:**
- [ ] README explica como rodar o jogo
- [ ] README lista todos os algoritmos implementados
- [ ] README descreve o gênero e objetivo do jogo
- [ ] `docs/algoritmos.md` justifica cada escolha algorítmica
- [ ] Complexidades de tempo e espaço documentadas
- [ ] Trade-offs entre soluções exatas e heurísticas explicados (TSP)
