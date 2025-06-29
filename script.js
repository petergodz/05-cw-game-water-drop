// Clean Water Tycoon - Starter JS




// Game state
let donations = 0;
let cleanWater = 0;
let upgrades = {
  bucket: { count: 0, price: 5, water: 1 },
  well: { count: 0, price: 20, water: 5 },
  filtration: { count: 0, price: 50, water: 20 }
};
let gameStarted = false;




// Water facts/messages
const messages = [
  "771 million people lack access to clean water.",
  "Every $1 invested in clean water can yield $4–$12 in economic returns.",
  "Women and girls spend 200 million hours every day collecting water.",
  "Charity: Water has funded over 100,000 water projects worldwide.",
  "Access to clean water can reduce water-related diseases by up to 50%.",
  "The game never ends—just like the mission to bring clean water to all!"
];
let messageIndex = 0;
let messageInterval = null;




// DOM elements
const donationAmount = document.getElementById('donation-amount');
const cleanWaterElem = document.getElementById('clean-water');
const donateBtn = document.getElementById('donate-btn');
const dollarSign = document.getElementById('dollar-sign');
const resetBtn = document.getElementById('reset-btn');
const messageBox = document.getElementById('message-box');
const buyBtns = {
  bucket: document.getElementById('buy-bucket'),
  well: document.getElementById('buy-well'),
  filtration: document.getElementById('buy-filtration')
};
const upgradeCounts = {
  bucket: document.getElementById('bucket-count'),
  well: document.getElementById('well-count'),
  filtration: document.getElementById('filtration-count')
};
const upgradePrices = {
  bucket: document.getElementById('bucket-price'),
  well: document.getElementById('well-price'),
  filtration: document.getElementById('filtration-price')
};
const village = document.getElementById('village');




// --- Functions ---
function updateUI() {
  donationAmount.textContent = `$${donations}`;
  cleanWaterElem.textContent = `${cleanWater} gallons`;
  for (let key in upgrades) {
    upgradeCounts[key].textContent = upgrades[key].count;
    upgradePrices[key].textContent = `Price: $${upgrades[key].price}`;
    buyBtns[key].disabled = !gameStarted || donations < upgrades[key].price;
  }
}




function showMessage(msg) {
  messageBox.textContent = msg;
}




function nextMessage() {
  showMessage(messages[messageIndex]);
  messageIndex = (messageIndex + 1) % messages.length;
}




function startMessages() {
  nextMessage();
  if (messageInterval) clearInterval(messageInterval);
  messageInterval = setInterval(nextMessage, 60000); // every minute
}




function boingAnimation() {
  donateBtn.classList.add('boing');
  setTimeout(() => donateBtn.classList.remove('boing'), 300);
}




function addUpgradeToVillage(type) {
  // For now, just add a small icon to the village area
  const img = document.createElement('img');
  if (type === 'bucket') {
    img.src = 'img/water-can.png';
    img.alt = 'Bucket';
    img.className = 'village-upgrade bucket';
  } else if (type === 'well') {
    img.src = 'img/Well.png';
    img.alt = 'Well';
    img.className = 'village-upgrade well';
  } else if (type === 'filtration') {
    img.src = 'img/Water Filter.png';
    img.alt = 'Filtration';
    img.className = 'village-upgrade filtration';
  }
  img.style.width = '40px';
  img.style.margin = '0 5px';
  // Add sell functionality
  img.title = `Click to sell this ${type} upgrade for $${upgrades[type].price}`;
  img.style.cursor = 'pointer';
  img.addEventListener('click', function() {
    // Remove upgrade from state and UI
    if (upgrades[type].count > 0) {
      upgrades[type].count--;
      cleanWater -= upgrades[type].water;
      donations += upgrades[type].price;
      img.remove();
      updateUI();
      showMessage(`Sold a ${type} upgrade for $${upgrades[type].price}!`);
    }
  });
  village.appendChild(img);
}




function resetGame() {
  donations = 0;
  cleanWater = 0;
  for (let key in upgrades) {
    upgrades[key].count = 0;
  }
  gameStarted = false;
  // Remove upgrade images
  document.querySelectorAll('.village-upgrade').forEach(e => e.remove());
  updateUpgradePricesForDifficulty();
  updateUI();
  showMessage('Game reset! Click the dollar sign to start donating.');
}




// --- Event Listeners ---
donateBtn.addEventListener('click', () => {
  donations += 1;
  if (!gameStarted) {
    gameStarted = true;
    startMessages();
  }
  boingAnimation();
  updateUI();
});




buyBtns.bucket.addEventListener('click', () => {
  if (donations >= upgrades.bucket.price) {
    donations -= upgrades.bucket.price;
    upgrades.bucket.count++;
    cleanWater += upgrades.bucket.water;
    addUpgradeToVillage('bucket');
    updateUI();
  }
});
buyBtns.well.addEventListener('click', () => {
  if (donations >= upgrades.well.price) {
    donations -= upgrades.well.price;
    upgrades.well.count++;
    cleanWater += upgrades.well.water;
    addUpgradeToVillage('well');
    updateUI();
  }
});
buyBtns.filtration.addEventListener('click', () => {
  if (donations >= upgrades.filtration.price) {
    donations -= upgrades.filtration.price;
    upgrades.filtration.count++;
    cleanWater += upgrades.filtration.water;
    addUpgradeToVillage('filtration');
    updateUI();
  }
});




resetBtn.addEventListener('click', resetGame);




// --- Initial UI ---
updateUI();
showMessage('Click the dollar sign to start donating!');


// Difficulty multipliers
const difficultyMultipliers = {
  easy: 1,
  medium: 1.5,
  hard: 2
};
let currentDifficulty = 'easy';


// Store base prices for reset and difficulty switching
const basePrices = {
  bucket: 5,
  well: 20,
  filtration: 50
};


// Update upgrade prices based on difficulty
function updateUpgradePricesForDifficulty() {
  for (let key in upgrades) {
    upgrades[key].price = Math.round(basePrices[key] * difficultyMultipliers[currentDifficulty]);
  }
}


// Listen for difficulty change
document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentDifficulty = e.target.value;
    updateUpgradePricesForDifficulty();
    updateUI();
  });
});


// When resetting, also reset difficulty to easy and prices
function resetGame() {
  donations = 0;
  cleanWater = 0;
  for (let key in upgrades) {
    upgrades[key].count = 0;
  }
  gameStarted = false;
  // Remove upgrade images
  document.querySelectorAll('.village-upgrade').forEach(e => e.remove());
  updateUpgradePricesForDifficulty();
  updateUI();
  showMessage('Game reset! Click the dollar sign to start donating.');
}


// On page load, set prices for current difficulty
updateUpgradePricesForDifficulty();
updateUI();




