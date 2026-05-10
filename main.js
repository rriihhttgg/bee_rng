const state = {
  resources: {
    honey: 0,
    wax: 0
  },

  inventory: {},

  ownedAccessories: [],

  equippedAccessories: [],

  selectedFighterId: null,

  rollCooldown: false
};

/*
  You can replace later:
  name — card name
  image — card image path
  attacks — attack names
*/

const cards = [
  {
    id: "worker_bee",
    name: "Worker Bee",
    image: ""images/cards/worker_bee.png",
    rarity: "common",
    chance: 55,
    hp: 30,
    attack: 6,
    speed: 10,
    attacks: [
      { name: "Buzz Strike", power: 6 },
      { name: "Stinger Jab", power: 8 }
    ],
    rewards: {
      honey: 2,
      wax: 1
    }
  },
  {
    id: "sport_bee",
    name: "Sport Bee",
    image: ""images/cards/sport_bee.png",
    rarity: "rare",
    chance: 25,
    hp: 45,
    attack: 10,
    speed: 8,
    attacks: [
      { name: "Sport Sting", power: 10 },
      { name: "Hive Charge", power: 13 }
    ],
    rewards: {
      honey: 4,
      wax: 2
    }
  },
  {
    id: "robot_bee",
    name: "Robot Bee",
    image: ""images/cards/robot_bee.png",
    rarity: "rare",
    chance: 14,
    hp: 35,
    attack: 8,
    speed: 18,
    attacks: [
      { name: "Quick Bite", power: 8 },
      { name: "Robot Dance", power: 11 }
    ],
    rewards: {
      honey: 3,
      wax: 2
    }
  },
  {
    id: "anime_bee",
    name: "Anime Girl Bee",
    image: ""images/cards/anime_bee.png",
    rarity: "epic",
    chance: 4.5,
    hp: 70,
    attack: 18,
    speed: 9,
    attacks: [
      { name: "Anime Bite", power: 20 },
      { name: "Honey Armor Bash", power: 15 }
    ],
    rewards: {
      honey: 8,
      wax: 4
    }
  },
  {
    id: cat_bee",
    name: "Cat Bee",
    image: ""images/cards/cat_bee.png",
    rarity: "legendary",
    chance: 1.3,
    hp: 100,
    attack: 28,
    speed: 12,
    attacks: [
      { name: "Flower Attack", power: 30 },
      { name: "Cat Bee Sting", power: 36 }
    ],
    rewards: {
      honey: 15,
      wax: 8
    }
  },
  {
    id: "Riht",
    name: "Riht",
    image: ""images/cards/Riht.png",
    rarity: "mythic",
    chance: 0.2,
    hp: 140,
    attack: 42,
    speed: 18,
    attacks: [
      { name: "Riht Swarm", power: 58 },
      { name: "Nectar Explosion", power: 70 }
    ],
    rewards: {
      honey: 35,
      wax: 15
    }
  }
];

/*
  Accessory bonuses:
  luck — increases rare card roll chances
  rollSpeed — reduces card roll cooldown
  attack — battle attack bonus
  hp — battle HP bonus
*/

const accessories = [
  {
    id: "lucky_antenna",
    name: "Lucky Antenna",
    description: "Increases card roll luck.",
    bonuses: {
      luck: 15,
      rollSpeed: 0,
      attack: 0,
      hp: 0
    },
    recipe: {
      honey: 20,
      wax: 10,
      cards: {
        worker_bee: 3,
        scout_bee: 1
      }
    }
  },
  {
    id: "wax_engine",
    name: "Wax Engine",
    description: "Increases card roll speed.",
    bonuses: {
      luck: 0,
      rollSpeed: 25,
      attack: 0,
      hp: 0
    },
    recipe: {
      honey: 30,
      wax: 18,
      cards: {
        worker_bee: 5,
        guard_bee: 1
      }
    }
  },
  {
    id: "honey_blade",
    name: "Honey Blade",
    description: "Increases attack in battles.",
    bonuses: {
      luck: 0,
      rollSpeed: 0,
      attack: 12,
      hp: 0
    },
    recipe: {
      honey: 50,
      wax: 25,
      cards: {
        guard_bee: 2,
        royal_knight: 1
      }
    }
  },
  {
    id: "royal_shell",
    name: "Royal Shell",
    description: "Increases HP in battles.",
    bonuses: {
      luck: 0,
      rollSpeed: 0,
      attack: 0,
      hp: 40
    },
    recipe: {
      honey: 70,
      wax: 40,
      cards: {
        royal_knight: 1,
        queen_avatar: 1
      }
    }
  }
];

const rarityNames = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic"
};

const rarityPower = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
mythic: 5
};

const honeyEl = document.getElementById("honey");
const waxEl = document.getElementById("wax");

const luckStatEl = document.getElementById("luckStat");
const speedStatEl = document.getElementById("speedStat");
const attackBonusStatEl = document.getElementById("attackBonusStat");
const hpBonusStatEl = document.getElementById("hpBonusStat");

const rollBtn = document.getElementById("rollBtn");
const lastCardEl = document.getElementById("lastCard");
const inventoryEl = document.getElementById("inventory");
const craftListEl = document.getElementById("craftList");
const ownedAccessoriesEl = document.getElementById("ownedAccessories");
const equippedAccessoriesEl = document.getElementById("equippedAccessories");
const fighterSelectEl = document.getElementById("fighterSelect");
const botBattleBtn = document.getElementById("botBattleBtn");
const battleLogEl = document.getElementById("battleLog");

const menuButtons = document.querySelectorAll(".menu-btn");
const screens = document.querySelectorAll(".screen");

menuButtons.forEach(button => {
  button.addEventListener("click", () => {
    const targetScreenId = button.dataset.screen;

    menuButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    screens.forEach(screen => {
      screen.classList.remove("active-screen");
    });

    document.getElementById(targetScreenId).classList.add("active-screen");
  });
});

function getTotalBonuses() {
  const total = {
    luck: 0,
    rollSpeed: 0,
    attack: 0,
    hp: 0
  };

  for (const accessoryId of state.equippedAccessories) {
    const accessory = accessories.find(a => a.id === accessoryId);
    if (!accessory) continue;

    total.luck += accessory.bonuses.luck  0;
    total.rollSpeed += accessory.bonuses.rollSpeed  0;
    total.attack += accessory.bonuses.attack  0;
    total.hp += accessory.bonuses.hp  0;
}

  return total;
}

function getRollDelay() {
  const bonuses = getTotalBonuses();

  const baseDelay = 1200;
  const reduction = Math.min(bonuses.rollSpeed, 80) / 100;

  return Math.floor(baseDelay * (1 - reduction));
}

function getAdjustedChance(card) {
  const bonuses = getTotalBonuses();

  const power = rarityPower[card.rarity] || 1;
  const luckMultiplier = 1 + (bonuses.luck / 100) * (power - 1) * 0.7;

  return card.chance * luckMultiplier;
}

function rollCard() {
  const weightedCards = cards.map(card => ({
    card,
    weight: getAdjustedChance(card)
  }));

  const totalWeight = weightedCards.reduce((sum, item) => sum + item.weight, 0);

  let random = Math.random() * totalWeight;

  for (const item of weightedCards) {
    random -= item.weight;

    if (random <= 0) {
      return item.card;
    }
  }

  return cards[0];
}

function addCardToInventory(cardId) {
  if (!state.inventory[cardId]) {
    state.inventory[cardId] = 0;
  }

  state.inventory[cardId]++;
}

function addRewards(card) {
  state.resources.honey += card.rewards.honey;
  state.resources.wax += card.rewards.wax;
}

function handleRoll() {
  if (state.rollCooldown) return;

  state.rollCooldown = true;
  rollBtn.disabled = true;
  rollBtn.textContent = "Rolling...";

  setTimeout(() => {
    const card = rollCard();

    addCardToInventory(card.id);
    addRewards(card);

    showLastCard(card);
    render();

    const delay = getRollDelay();

    setTimeout(() => {
      state.rollCooldown = false;
      rollBtn.disabled = false;
      rollBtn.textContent = "Roll Card";
    }, delay);
  }, 450);
}

function showLastCard(card) {
  lastCardEl.innerHTML = 
    <div class="card rarity-${card.rarity}">
      ${
        card.image
          ? <img src="${card.image}" alt="${card.name}">
          : <div class="fake-card-image">🐝</div>`
      }
      <h3>${card.name}</h3>
<div><b>${rarityNames[card.rarity]}</b></div>
      <div>❤️ HP: ${card.hp}</div>
      <div>⚔️ Attack: ${card.attack}</div>
      <div>⚡ Speed: ${card.speed}</div>
      <div class="small">
        Attacks: ${card.attacks.map(a => a.name).join(", ")}
      </div>
      <div class="small">
        Rewards: 🍯 ${card.rewards.honey}, 🕯 ${card.rewards.wax}
      </div>
    </div>
  `;
}

function canCraft(accessory) {
  const recipe = accessory.recipe;

  if (state.resources.honey < recipe.honey) return false;
  if (state.resources.wax < recipe.wax) return false;

  for (const [cardId, amount] of Object.entries(recipe.cards)) {
    if ((state.inventory[cardId] || 0) < amount) {
      return false;
    }
  }

  return true;
}

function craftAccessory(accessoryId) {
  const accessory = accessories.find(a => a.id === accessoryId);
  if (!accessory) return;

  if (state.ownedAccessories.includes(accessoryId)) {
    alert("This accessory is already crafted.");
    return;
  }

  if (!canCraft(accessory)) {
    alert("Not enough resources or cards.");
    return;
  }

  const recipe = accessory.recipe;

  state.resources.honey -= recipe.honey;
  state.resources.wax -= recipe.wax;

  for (const [cardId, amount] of Object.entries(recipe.cards)) {
    state.inventory[cardId] -= amount;
  }

  state.ownedAccessories.push(accessoryId);

  render();
}

function equipAccessory(accessoryId) {
  if (!state.ownedAccessories.includes(accessoryId)) return;

  if (state.equippedAccessories.includes(accessoryId)) {
    state.equippedAccessories = state.equippedAccessories.filter(id => id !== accessoryId);
    render();
    return;
  }

  if (state.equippedAccessories.length >= 3) {
    alert("You can equip up to 3 accessories.");
    return;
  }

  state.equippedAccessories.push(accessoryId);
  render();
}

function getCardById(cardId) {
  return cards.find(card => card.id === cardId);
}
function calculateFighterStats(card) {
  const bonuses = getTotalBonuses();

  return {
    name: card.name,
    hp: card.hp + bonuses.hp,
    attack: card.attack + bonuses.attack,
    speed: card.speed,
    attacks: card.attacks
  };
}

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function doAttack(attacker) {
  const chosenAttack = randomFromArray(attacker.attacks);

  const base = chosenAttack.power + attacker.attack * 0.5;
  const randomFactor = 0.85 + Math.random() * 0.3;

  const damage = Math.max(1, Math.floor(base * randomFactor));

  return {
    attackName: chosenAttack.name,
    damage
  };
}

function startBotBattle() {
  const fighterId = fighterSelectEl.value;

  if (!fighterId) {
    alert("Choose your fighter card first.");
    return;
  }

  const card = getCardById(fighterId);
  if (!card) return;

  const player = calculateFighterStats(card);

  const bot = {
    name: "Training Hornet",
    hp: 80,
    attack: 12,
    speed: 10,
    attacks: [
      { name: "Hornet Bite", power: 12 },
      { name: "Venom Dash", power: 16 }
    ]
  };

  let playerHp = player.hp;
  let botHp = bot.hp;

  let log = ⚔️ Battle started!\n;
  log += Your fighter: ${player.name}\n;
  log += Enemy: ${bot.name}\n\n;

  let round = 1;

  while (playerHp > 0 && botHp > 0 && round <= 20) {
    log += Round ${round}\n;

    const playerFirst = player.speed >= bot.speed;

    if (playerFirst) {
      const result1 = doAttack(player);
      botHp -= result1.damage;
      log += 🐝 ${player.name}: ${result1.attackName} — ${result1.damage} damage. Enemy HP: ${Math.max(botHp, 0)}\n;

      if (botHp <= 0) break;

      const result2 = doAttack(bot);
      playerHp -= result2.damage;
      log += 🐝 ${bot.name}: ${result2.attackName} — ${result2.damage} damage. Your HP: ${Math.max(playerHp, 0)}\n;
    } else {
const result1 = doAttack(bot);
      playerHp -= result1.damage;
      log += 🐝 ${bot.name}: ${result1.attackName} — ${result1.damage} damage. Your HP: ${Math.max(playerHp, 0)}\n;

      if (playerHp <= 0) break;

      const result2 = doAttack(player);
      botHp -= result2.damage;
      log += 🐝 ${player.name}: ${result2.attackName} — ${result2.damage} damage. Enemy HP: ${Math.max(botHp, 0)}\n;
    }

    log += \n;
    round++;
  }

  if (playerHp > 0 && botHp <= 0) {
    log += 🏆 Victory! You received 15 honey and 5 wax.;
    state.resources.honey += 15;
    state.resources.wax += 5;
  } else if (botHp > 0 && playerHp <= 0) {
    log += 💀 Defeat. Try rolling a stronger card or crafting an accessory.;
  } else {
    log += 🤝 Draw.;
  }

  battleLogEl.textContent = log;
  render();
}

function renderResources() {
  honeyEl.textContent = state.resources.honey;
  waxEl.textContent = state.resources.wax;
}

function renderStats() {
  const bonuses = getTotalBonuses();

  luckStatEl.textContent = bonuses.luck;
  speedStatEl.textContent = bonuses.rollSpeed;
  attackBonusStatEl.textContent = bonuses.attack;
  hpBonusStatEl.textContent = bonuses.hp;
}

function renderInventory() {
  inventoryEl.innerHTML = "";

  const ownedCardIds = Object.keys(state.inventory).filter(cardId => state.inventory[cardId] > 0);

  if (ownedCardIds.length === 0) {
    inventoryEl.innerHTML = <div class="small">No cards yet.</div>;
    return;
  }

  for (const cardId of ownedCardIds) {
    const card = getCardById(cardId);
    const count = state.inventory[cardId];

    const div = document.createElement("div");
    div.className = inv-item rarity-${card.rarity};

    div.innerHTML = `
      <h3>${card.name}</h3>
      <div><b>${rarityNames[card.rarity]}</b></div>
      <div>Amount: ${count}</div>
      <div>❤️ HP: ${card.hp}</div>
<div>⚔️ Attack: ${card.attack}</div>
      <div>⚡ Speed: ${card.speed}</div>
      <div class="small">Attacks: ${card.attacks.map(a => a.name).join(", ")}</div>
    ;

    inventoryEl.appendChild(div);
  }
}

function renderCraft() {
  craftListEl.innerHTML = "";

  for (const accessory of accessories) {
    const alreadyOwned = state.ownedAccessories.includes(accessory.id);
    const craftAvailable = canCraft(accessory);

    const cardsText = Object.entries(accessory.recipe.cards)
      .map(([cardId, amount]) => {
        const card = getCardById(cardId);
        const owned = state.inventory[cardId] || 0;
        return ${card.name}: ${owned}/${amount};
      })
      .join("<br>");

    const div = document.createElement("div");
    div.className = "recipe";

    div.innerHTML = 
      <h3>${accessory.name}</h3>
      <div>${accessory.description}</div>
      <div class="small">
        Bonuses:
        🍀 ${accessory.bonuses.luck}%,
        ⚡ ${accessory.bonuses.rollSpeed}%,
        ⚔️ ${accessory.bonuses.attack},
        ❤️ ${accessory.bonuses.hp}
      </div>
      <hr>
      <div>
        Required:<br>
        🍯 ${state.resources.honey}/${accessory.recipe.honey}<br>
        🕯 ${state.resources.wax}/${accessory.recipe.wax}<br>
        ${cardsText}
      </div>
      <button ${alreadyOwned || !craftAvailable ? "disabled" : ""} data-craft="${accessory.id}">
        ${alreadyOwned ? "Already Crafted" : "Craft"}
      </button>
    `;

    craftListEl.appendChild(div);
  }

  document.querySelectorAll("[data-craft]").forEach(button => {
    button.addEventListener("click", () => {
      craftAccessory(button.dataset.craft);
    });
  });
}

function renderAccessories() {
  equippedAccessoriesEl.innerHTML = "";
  ownedAccessoriesEl.innerHTML = "";

  if (state.equippedAccessories.length === 0) {
equippedAccessoriesEl.innerHTML = <div class="small">Nothing equipped.</div>;
  } else {
    for (const accessoryId of state.equippedAccessories) {
      const accessory = accessories.find(a => a.id === accessoryId);

      const div = document.createElement("div");
      div.className = "accessory";

      div.innerHTML = 
        <h3>${accessory.name}</h3>
        <div class="small">${accessory.description}</div>
        <div class="small">
          🍀 ${accessory.bonuses.luck}%,
          ⚡ ${accessory.bonuses.rollSpeed}%,
          ⚔️ ${accessory.bonuses.attack},
          ❤️ ${accessory.bonuses.hp}
        </div>
        <button data-equip="${accessory.id}">Unequip</button>
      ;

      equippedAccessoriesEl.appendChild(div);
    }
  }

  const notEquipped = state.ownedAccessories.filter(id => !state.equippedAccessories.includes(id));

  if (notEquipped.length === 0) {
    ownedAccessoriesEl.innerHTML = <div class="small">No available accessories.</div>;
  } else {
    for (const accessoryId of notEquipped) {
      const accessory = accessories.find(a => a.id === accessoryId);

      const div = document.createElement("div");
      div.className = "accessory";

      div.innerHTML = 
        <h3>${accessory.name}</h3>
        <div class="small">${accessory.description}</div>
        <div class="small">
          🍀 ${accessory.bonuses.luck}%,
          ⚡ ${accessory.bonuses.rollSpeed}%,
          ⚔️ ${accessory.bonuses.attack},
          ❤️ ${accessory.bonuses.hp}
        </div>
        <button data-equip="${accessory.id}">Equip</button>
      ;

      ownedAccessoriesEl.appendChild(div);
    }
  }

  document.querySelectorAll("[data-equip]").forEach(button => {
    button.addEventListener("click", () => {
      equipAccessory(button.dataset.equip);
    });
  });
}

function renderFighterSelect() {
  const currentValue = fighterSelectEl.value;
fighterSelectEl.innerHTML = "";

  const ownedCardIds = Object.keys(state.inventory).filter(cardId => state.inventory[cardId] > 0);

  if (ownedCardIds.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No cards";
    fighterSelectEl.appendChild(option);
    return;
  }

  for (const cardId of ownedCardIds) {
    const card = getCardById(cardId);

    const option = document.createElement("option");
    option.value = card.id;
    option.textContent = ${card.name} — HP ${card.hp}, ATK ${card.attack};

    fighterSelectEl.appendChild(option);
  }

  if (currentValue && ownedCardIds.includes(currentValue)) {
    fighterSelectEl.value = currentValue;
  }
}

function render() {
  renderResources();
  renderStats();
  renderInventory();
  renderCraft();
  renderAccessories();
  renderFighterSelect();
}

rollBtn.addEventListener("click", handleRoll);
botBattleBtn.addEventListener("click", startBotBattle);

render();
