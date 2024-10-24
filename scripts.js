let playerMoney = 100;
let playerLocation = "forest";
let currentDay = 1;
let currentDate = new Date(2024, 0, 1);

// Player inventory now tracks resource type and price
let inventory = {
  slot1: { item: null, price: null },
  slot2: { item: null, price: null },
  slot3: { item: null, price: null },
  slot4: { item: null, price: null },
  slot5: { item: null, price: null },
};

// Prices for each city
let prices = {
  forest: { grain: 5, wood: 6, iron: 12, wool: 8, leather: 10, spices: 25, wine: 8, preciousMetals: 20, salt: 12, pottery: 7 },
  desert: { grain: 10, wood: 15, iron: 6, wool: 14, leather: 12, spices: 10, wine: 20, preciousMetals: 18, salt: 8, pottery: 12 },
  valley: { grain: 7, wood: 11, iron: 20, wool: 7, leather: 13, spices: 32, wine: 9, preciousMetals: 23, salt: 8, pottery: 11 },
  mountain: { grain: 12, wood: 14, iron: 8, wool: 10, leather: 18, spices: 28, wine: 15, preciousMetals: 22, salt: 11, pottery: 16 },
  plains: { grain: 9, wood: 8, iron: 14, wool: 9, leather: 11, spices: 26, wine: 14, preciousMetals: 19, salt: 10, pottery: 13 },
  river: { grain: 6, wood: 10, iron: 16, wool: 11, leather: 9, spices: 27, wine: 10, preciousMetals: 21, salt: 9, pottery: 12 },
  beach: { grain: 8, wood: 12, iron: 18, wool: 10, leather: 15, spices: 30, wine: 12, preciousMetals: 15, salt: 5, pottery: 9 },
};

// Factions for each city
const cityFactions = {
  forest: "faction1",
  desert: "faction1",
  valley: "faction1",
  mountain: "faction2",
  plains: "faction2",
  river: "faction2",
  beach: "neutral"
};

// Travel times between cities
let travelTimes = {
  forest: { desert: 2, valley: 3, mountain: 8, plains: 7, river: 9, beach: 10 },
  desert: { forest: 2, valley: 4, mountain: 9, plains: 6, river: 8, beach: 7 },
  valley: { forest: 3, desert: 4, mountain: 10, plains: 8, river: 7, beach: 9 },
  mountain: { forest: 8, desert: 9, valley: 10, plains: 2, river: 3, beach: 11 },
  plains: { forest: 7, desert: 6, valley: 8, mountain: 2, river: 4, beach: 10 },
  river: { forest: 9, desert: 8, valley: 7, mountain: 3, plains: 4, beach: 12 },
  beach: { forest: 10, desert: 7, valley: 9, mountain: 11, plains: 10, river: 12 }
};

// Tariff cost when traveling between factions
const tariffCost = 15;

// Function to format date to "DD MMM YYYY"
function formatDate(date) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Update UI for player location, money, current day, and date
function updateUI() {
  document.getElementById("player-location").textContent = `Location: ${playerLocation.charAt(0).toUpperCase() + playerLocation.slice(1)}`;
  document.getElementById("player-money").textContent = `Money: $${playerMoney}`;
  document.getElementById("current-date").textContent = `Date: ${formatDate(currentDate)}`;
  document.getElementById("current-day").textContent = `Day: ${currentDay}`;
}

// Function to update the price display in the table
function displayPrices() {
  for (let city in prices) {
    for (let resource in prices[city]) {
      const priceElement = document.getElementById(`${city}-${resource}-price`);
      if (priceElement) {
        priceElement.textContent = `$${prices[city][resource]}`;
      }
    }
  }
}

// Update prices by -2% to +2% each day
function updatePrices() {
  for (let city in prices) {
    for (let resource in prices[city]) {
      let changePercent = (Math.random() * 4 - 2) / 100; // Random between -2% and +2%
      prices[city][resource] = +(prices[city][resource] * (1 + changePercent)).toFixed(2);
    }
  }
  displayPrices();
}

// Travel function with faction tariff system and daily travel cost
function travelToCity(cityName) {
  if (playerLocation === cityName) {
    document.getElementById("travel-status").textContent = `You're already at ${cityName.charAt(0).toUpperCase() + cityName.slice(1)}!`;
    return;
  }

  let travelDays = travelTimes[playerLocation.toLowerCase()][cityName.toLowerCase()];
  let newFaction = cityFactions[cityName.toLowerCase()];
  let currentFaction = cityFactions[playerLocation.toLowerCase()];
  const travelCostPerDay = 0.5; // Daily travel cost
  let totalTravelCost = travelDays * travelCostPerDay;

  // Check if a tariff applies and add it to the total travel cost if necessary
  let tariffApplied = false;
  if (newFaction !== currentFaction && newFaction !== "neutral" && currentFaction !== "neutral") {
    totalTravelCost += tariffCost;
    tariffApplied = true;
  }

  // Check if the player has enough money for the total travel cost
  if (playerMoney < totalTravelCost) {
    document.getElementById("travel-status").textContent = `You don't have enough money to travel to ${cityName.charAt(0).toUpperCase() + cityName.slice(1)}. You need $${totalTravelCost}, but you only have $${playerMoney}.`;
    return; // Stop the function if player doesn't have enough money
  }

  // Deduct the total travel cost from the player's money
  playerMoney -= totalTravelCost;

  if (tariffApplied) {
    document.getElementById("tariff-notification").classList.remove("hidden");
    document.getElementById("current-location").textContent = playerLocation.charAt(0).toUpperCase() + playerLocation.slice(1);
    document.getElementById("target-location").textContent = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  } else {
    document.getElementById("tariff-notification").classList.add("hidden");
  }

  // Update player location and increment the current day by the travel time
  playerLocation = cityName;
  currentDay += travelDays;
  currentDate.setDate(currentDate.getDate() + travelDays);

  document.getElementById("travel-status").textContent = `Traveling to ${cityName.charAt(0).toUpperCase() + cityName.slice(1)} for ${travelDays} days at a cost of $${totalTravelCost}...`;

  updateUI();

  // Simulate travel time with a timeout
  setTimeout(() => {
    document.getElementById("travel-status").textContent = `Arrived at ${cityName.charAt(0).toUpperCase() + cityName.slice(1)}!`;
    updatePrices();
    updateMarketDisplay();
    updateTravelTimes();
  }, 1000);
}

// Function to update the market display based on the player's location
function updateMarketDisplay() {
  const marketHeading = document.getElementById("market-heading");
  const resourceGrid = document.getElementById("resource-grid");

  marketHeading.textContent = `${playerLocation.charAt(0).toUpperCase() + playerLocation.slice(1)} Trading Post`;

  resourceGrid.innerHTML = "";

  const resources = prices[playerLocation.toLowerCase()];

  for (let resource in resources) {
    const card = document.createElement("div");
    card.className = "resource-card";

    const resourceName = document.createElement("p");
    resourceName.textContent = resource.charAt(0).toUpperCase() + resource.slice(1);
    card.appendChild(resourceName);

    const resourcePrice = document.createElement("p");
    resourcePrice.textContent = `$${resources[resource]}`;
    card.appendChild(resourcePrice);

    const buyButton = document.createElement("button");
    buyButton.textContent = "Buy";
    buyButton.onclick = () => buyResource(resource);
    card.appendChild(buyButton);

    const sellButton = document.createElement("button");
    sellButton.textContent = "Sell";
    sellButton.onclick = () => sellResource(resource);
    card.appendChild(sellButton);

    resourceGrid.appendChild(card);
  }
}

// Function to buy resources
function buyResource(resource) {
  if (!playerLocation) {
    alert("You need to be at a city first!");
    return;
  }

  const resourcePrice = prices[playerLocation.toLowerCase()][resource];

  if (playerMoney >= resourcePrice) {
    let emptySlot = Object.keys(inventory).find((slot) => inventory[slot].item === null);
    if (emptySlot) {
      inventory[emptySlot] = { item: resource, price: resourcePrice };
      playerMoney -= resourcePrice;
      document.getElementById("player-money").textContent = `Money: $${playerMoney}`;
      updateInventoryDisplay();
    } else {
      alert("No empty slots in inventory!");
    }
  } else {
    alert("Not enough money to buy this resource!");
  }
}

// Function to sell resources
function sellResource(resource) {
  if (!playerLocation) {
    alert("You need to be at a city first!");
    return;
  }

  const resourcePrice = prices[playerLocation.toLowerCase()][resource];

  let slotWithResource = Object.keys(inventory).find((slot) => inventory[slot].item === resource);
  if (slotWithResource) {
    playerMoney += resourcePrice;
    document.getElementById("player-money").textContent = `Money: $${playerMoney}`;
    inventory[slotWithResource] = { item: null, price: null };
    updateInventoryDisplay();
  } else {
    alert(`You don't have any ${resource} to sell!`);
  }
}


// Update the display for the inventory slots
function updateInventoryDisplay() {
  for (let slot in inventory) {
      const slotElement = document.getElementById(slot);
      slotElement.innerHTML = ''; // Clear any existing content in the slot

      if (inventory[slot].item) {
          // Create an image element for the inventory item
          const img = document.createElement('img');
          img.src = `${inventory[slot].item}.png`; // Use the item name to construct the file path
          img.alt = inventory[slot].item;
          img.style.width = '80%'; // Set the width of the image
          img.style.height = 'auto'; // Maintain aspect ratio
          img.style.borderRadius = '5px'; // Optional rounded corners

          // Add the class for styling
          img.classList.add('inventory-card-img');

          // Append the image to the inventory slot
          slotElement.appendChild(img);

          // Add the item name and price below the image
          const itemInfo = document.createElement('p');
          itemInfo.textContent = `${inventory[slot].item.charAt(0).toUpperCase() + inventory[slot].item.slice(1)} - $${inventory[slot].price}`;
          slotElement.appendChild(itemInfo);
      } else {
          // If the slot is empty, display the slot name and "Empty"
          slotElement.textContent = `${slot.charAt(0).toUpperCase() + slot.slice(1)}: Empty`;
      }
  }
}


// Function to update travel times based on player's location
function updateTravelTimes() {
  const cities = ["forest", "desert", "valley", "mountain", "plains", "river", "beach"];
  
  cities.forEach((city) => {
    if (city.toLowerCase() !== playerLocation.toLowerCase()) {
      const travelTime = travelTimes[playerLocation.toLowerCase()][city];
      const travelTimeElement = document.getElementById(`${city}-travel-time`);
      if (travelTimeElement) {
        travelTimeElement.textContent = `${travelTime} days`;
      }
    } else {
      const travelTimeElement = document.getElementById(`${city}-travel-time`);
      if (travelTimeElement) {
        travelTimeElement.textContent = "You are here";
      }
    }
  });
}

// Initial setup
updateUI();
displayPrices();
updateInventoryDisplay();
updateMarketDisplay();
updateTravelTimes();
