// ============================================================
// constants.js — Constantes globais do jogo
// ============================================================

const TILE = 32;
const COLS = 18;
const ROWS = 14;
const W = COLS * TILE;
const H = ROWS * TILE;

// Tipos de tile
const T_WALL  = 0;
const T_FLOOR = 1;
const T_RELIC = 2;
const T_EXIT  = 3;

// Limite de peso da mochila
const MAX_WEIGHT = 15;

// Tamanho máximo do inventário (slots)
const INV_SIZE = 8;

// Catálogo de relíquias: cada uma tem peso e valor diferentes,
// o que alimenta o algoritmo Knapsack 0/1
const RELIC_TYPES = [
  { emoji: '🏺', name: 'Ânfora',   weight: 3, value: 40 },
  { emoji: '💎', name: 'Gema',     weight: 1, value: 30 },
  { emoji: '📜', name: 'Papiro',   weight: 1, value: 20 },
  { emoji: '⚔️',  name: 'Espada',  weight: 5, value: 60 },
  { emoji: '👑',  name: 'Coroa',   weight: 4, value: 70 },
  { emoji: '🗿',  name: 'Estátua', weight: 6, value: 80 },
  { emoji: '🔮',  name: 'Orbe',    weight: 2, value: 50 },
  { emoji: '🪙',  name: 'Moeda',   weight: 1, value: 15 },
];

// Cores dos tiles para o renderer
const TILE_COLORS = {
  [T_WALL]:  '#2C241C',
  [T_FLOOR]: '#C8A96E',
  [T_RELIC]: '#8B6914',
  [T_EXIT]:  '#1A4A1A',
};
