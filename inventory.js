// ============================================================
// inventory.js — Sistema de Inventário
//
// Estrutura: array de objetos { type, id }
// Operações: adicionar, remover (drop), consultar peso/valor
// ============================================================

/**
 * Retorna o peso total atual do inventário.
 */
function invWeight() {
  return inventory.reduce((sum, item) => sum + item.type.weight, 0);
}

/**
 * Retorna o valor total atual do inventário.
 */
function invValue() {
  return inventory.reduce((sum, item) => sum + item.type.value, 0);
}

/**
 * Verifica se um item pode ser adicionado (slot livre + peso).
 */
function canAddItem(itemType) {
  return inventory.length < INV_SIZE && invWeight() + itemType.weight <= MAX_WEIGHT;
}

/**
 * Adiciona item ao inventário. Retorna true se bem-sucedido.
 */
function addItem(itemType, id) {
  if (!canAddItem(itemType)) return false;
  inventory.push({ type: itemType, id });
  return true;
}

/**
 * Remove item do inventário pelo índice do slot.
 */
function dropItem(idx) {
  if (!inventory[idx]) return;
  const item = inventory[idx];
  addLog(`Descartou: ${item.type.emoji} ${item.type.name}`);
  inventory.splice(idx, 1);
  updateUI();
}

// ---- Renderização do inventário na UI ----------------------

function renderInventoryUI() {
  const grid = document.getElementById('inv-grid');
  grid.innerHTML = '';

  for (let i = 0; i < INV_SIZE; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot' + (inventory[i] ? ' occupied' : '');

    if (inventory[i]) {
      slot.textContent = inventory[i].type.emoji;
      slot.title = `${inventory[i].type.name} | Peso: ${inventory[i].type.weight}kg | Valor: ${inventory[i].type.value}pts\nClique para descartar`;
      slot.addEventListener('click', () => dropItem(i));
    }

    grid.appendChild(slot);
  }

  const w = invWeight();
  document.getElementById('iw-val').textContent = w;
  document.getElementById('s-relics').textContent = inventory.length;
  document.getElementById('s-weight').textContent = `${w}/${MAX_WEIGHT}`;
}
