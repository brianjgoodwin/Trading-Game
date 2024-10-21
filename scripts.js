let playerMoney = 100;
let playerLocation = "Forest";
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
  forest: {
    grain: 5,
    wood: 6,
    iron: 12,
    wool: 8,
    leather: 10,
    spices: 25,
    wine: 8,
    preciousMetals: 20,
    salt: 12,
    pottery: 7
  },
  desert: {
    grain: 10,
    wood: 15,
    iron: 6,
    wool: 14,
    leather: 12,
    spices: 10,
    wine: 20,
    preciousMetals: 18,
    salt: 8,
    pottery: 12
  },
  beach: {
    grain: 8,
    wood: 12,
    iron: 18,
    wool: 10,
    leather: 15,
    spices: 30,
    wine: 12,
    preciousMetals: 15,
    salt: 5,
    pottery: 9
  },
  mountain: {
    grain: 12,
    wood: 14,
    iron: 8,
    wool: 10,
    leather: 18,
    spices: 28,
    wine: 15,
    preciousMetals: 22,
    salt: 11,
    pottery: 16
  },
  plains: {
    grain: 9,
    wood: 8,
    iron: 14,
    wool: 9,
    leather: 11,
    spices: 26,
    wine: 14,
    preciousMetals: 19,
    salt: 10,
    pottery: 13
  },
  river: {
    grain: 6,
    wood: 10,
    iron: 16,
    wool: 11,
    leather: 9,
    spices: 27,
    wine: 10,
    preciousMetals: 21,
    salt: 9,
    pottery: 12
  },
  valley: {
    grain: 7,
    wood: 11,
    iron: 20,
    wool: 7,
    leather: 13,
    spices: 32,
    wine: 9,
    preciousMetals: 23,
    salt: 8,
    pottery: 11
  }
};

// Travel times between cities
let travelTimes = {
  forest: { desert: 4, beach: 3, mountain: 5, plains: 6, river: 7, valley: 8 },
  desert: { forest: 4, beach: 2, mountain: 6, plains: 5, river: 4, valley: 6 },
  beach: { forest: 3, desert: 2, mountain: 4, plains: 6, river: 5, valley: 7 },
  mountain: { forest: 5, desert: 6, beach: 4, plains: 3, river: 4, valley: 3 },
  plains: { forest: 6, desert: 5, beach: 6, mountain: 3, river: 2, valley: 4 },
  river: { forest: 7, desert: 4, beach: 5, mountain: 4, plains: 2, valley: 2 },
  valley: { forest: 8, desert: 6, beach: 7, mountain: 3, plains: 4, river: 2 }
};

function updateTravelTimes() {
  const cities = ["forest", "desert", "beach", "mountain", "plains", "river", "valley"];
  
  cities.forEach((city) => {
    // Skip the player's current location as there's no travel time to itself
    if (city.toLowerCase() !== playerLocation.toLowerCase()) {
      const travelTime = travelTimes[playerLocation.toLowerCase()][city];
      const travelTimeElement = document.getElementById(`${city}-travel-time`);
      if (travelTimeElement) {
        travelTimeElement.textContent = `${travelTime} days`;
      }
    } else {
      // For the player's current location, show "You are here"
      const travelTimeElement = document.getElementById(`${city}-travel-time`);
      if (travelTimeElement) {
        travelTimeElement.textContent = "You are here";
      }
    }
  });
}

// Function to format date to "DD MMM YYYY"
function formatDate(date) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Update UI for player location, money, current day, and date
function updateUI() {
  document.getElementById(
    "player-location"
  ).textContent = `Location: ${playerLocation}`;
  document.getElementById(
    "player-money"
  ).textContent = `Money: $${playerMoney}`;
  document.getElementById("current-date").textContent = `Date: ${formatDate(
    currentDate
  )}`;
  document.getElementById("current-day").textContent = `Day: ${currentDay}`;
}

// Function to update the price display in the table
function displayPrices() {
  const cities = ["forest", "desert", "beach", "mountain", "plains", "river", "valley"];
  const resources = [
    "grain",
    "wood",
    "iron",
    "wool",
    "leather",
    "spices",
    "wine",
    "preciousMetals",
    "salt",
    "pottery"
  ];

  cities.forEach((city) => {
    resources.forEach((resource) => {
      const priceElement = document.getElementById(`${city}-${resource}-price`);
      if (priceElement) {
        priceElement.textContent = `$${prices[city][resource]}`;
      }
    });
  });
}

// Update prices by -2% to +2% each day
function updatePrices() {
  for (let city in prices) {
    for (let resource in prices[city]) {
      let changePercent = (Math.random() * 4 - 2) / 100; // Random between -2% and +2%
      prices[city][resource] = +(
        prices[city][resource] *
        (1 + changePercent)
      ).toFixed(2); // Round to 2 decimals
    }
  }
  displayPrices();
}

// Travel function with relative travel times
function travelToCity(cityName) {
  if (playerLocation === cityName) {
    document.getElementById(
      "travel-status"
    ).textContent = `You're already at ${cityName}!`;
    return;
  }

  // Get travel time based on current location and destination
  let travelDays = travelTimes[playerLocation.toLowerCase()][cityName.toLowerCase()];

  // Update player location and increment the current day by the travel time
  playerLocation = cityName;
  currentDay += travelDays;
  currentDate.setDate(currentDate.getDate() + travelDays); // Increment the current date

  document.getElementById(
    "travel-status"
  ).textContent = `Traveling to ${cityName} for ${travelDays} days...`;

  updateUI(); // Update UI with new day, location, and date

  // Simulate travel time with a timeout
  setTimeout(() => {
    document.getElementById(
      "travel-status"
    ).textContent = `Arrived at ${cityName}!`;
    updatePrices(); // Update prices daily
    updateMarketDisplay(); // Update the market display based on the new location
    updateTravelTimes(); // Call to refresh travel times after arriving
  }, 1000); // Simulate the travel with a 1-second delay for now
}

// Function to update the market display based on the player's location
function updateMarketDisplay() {
  const marketHeading = document.getElementById("market-heading");
  const resourceGrid = document.getElementById("resource-grid");

  // Set the heading to the current city dynamically
  marketHeading.textContent = `${playerLocation} Market`;

  // Clear any existing resources in the grid
  resourceGrid.innerHTML = "";

  // Get the resources and prices for the current city
  const resources = prices[playerLocation.toLowerCase()];

  // Loop through the resources and create the grid items
  for (let resource in resources) {
    // Create a card for each resource
    const card = document.createElement("div");
    card.className = "resource-card";

    // Resource name
    const resourceName = document.createElement("p");
    resourceName.textContent =
      resource.charAt(0).toUpperCase() + resource.slice(1);
    card.appendChild(resourceName);

    // Resource price
    const resourcePrice = document.createElement("p");
    resourcePrice.textContent = `$${resources[resource]}`;
    card.appendChild(resourcePrice);

    // Buy button
    const buyButton = document.createElement("button");
    buyButton.textContent = "Buy";
    buyButton.onclick = () => buyResource(resource);
    card.appendChild(buyButton);

    // Sell button
    const sellButton = document.createElement("button");
    sellButton.textContent = "Sell";
    sellButton.onclick = () => sellResource(resource);
    card.appendChild(sellButton);

    // Add the card to the grid
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
    let emptySlot = Object.keys(inventory).find(
      (slot) => inventory[slot].item === null
    );
    if (emptySlot) {
      inventory[emptySlot] = { item: resource, price: resourcePrice }; // Store resource and price
      playerMoney -= resourcePrice;
      document.getElementById(
        "player-money"
      ).textContent = `Money: $${playerMoney}`;
      updateInventoryDisplay(); // Update inventory display
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

  // Check if the player has the resource in inventory
  let slotWithResource = Object.keys(inventory).find(
    (slot) => inventory[slot].item === resource
  );
  if (slotWithResource) {
    playerMoney += resourcePrice;
    document.getElementById(
      "player-money"
    ).textContent = `Money: $${playerMoney}`;
    inventory[slotWithResource] = { item: null, price: null }; // Empty the slot
    updateInventoryDisplay(); // Update inventory display
  } else {
    alert(`You don't have any ${resource} to sell!`);
  }
}

// Update the display for the inventory slots
function updateInventoryDisplay() {
  for (let slot in inventory) {
    const slotElement = document.getElementById(slot);
    if (inventory[slot].item) {
      slotElement.textContent = `${inventory[slot].item} - $${inventory[slot].price}`;
    } else {
      slotElement.textContent = `${
        slot.charAt(0).toUpperCase() + slot.slice(1)
      }: Empty`;
    }
  }
}

// Initial setup
updateUI();
displayPrices();
updateInventoryDisplay();
updateMarketDisplay();
updateTravelTimes();