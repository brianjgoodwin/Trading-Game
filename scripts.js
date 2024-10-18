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

// Prices for each trading post
let prices = {
  forest: { wood: 5, stone: 10, metal: 15 },
  desert: { wood: 20, stone: 8, metal: 10 },
  beach: { wood: 10, stone: 12, metal: 8 },
};

// Travel times between trading posts
let travelTimes = {
  forest: { desert: 4, beach: 3 },
  desert: { forest: 4, beach: 2 },
  beach: { forest: 3, desert: 2 },
};

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
  document.getElementById(
    "forest-wood-price"
  ).textContent = `$${prices.forest.wood}`;
  document.getElementById(
    "forest-stone-price"
  ).textContent = `$${prices.forest.stone}`;
  document.getElementById(
    "forest-metal-price"
  ).textContent = `$${prices.forest.metal}`;

  document.getElementById(
    "desert-wood-price"
  ).textContent = `$${prices.desert.wood}`;
  document.getElementById(
    "desert-stone-price"
  ).textContent = `$${prices.desert.stone}`;
  document.getElementById(
    "desert-metal-price"
  ).textContent = `$${prices.desert.metal}`;

  document.getElementById(
    "beach-wood-price"
  ).textContent = `$${prices.beach.wood}`;
  document.getElementById(
    "beach-stone-price"
  ).textContent = `$${prices.beach.stone}`;
  document.getElementById(
    "beach-metal-price"
  ).textContent = `$${prices.beach.metal}`;
}

// Update prices by -2% to +2% each day
function updatePrices() {
  for (let post in prices) {
    for (let resource in prices[post]) {
      let changePercent = (Math.random() * 4 - 2) / 100; // Random between -2% and +2%
      prices[post][resource] = +(
        prices[post][resource] *
        (1 + changePercent)
      ).toFixed(2); // Round to 2 decimals
    }
  }
  displayPrices();
}

// Travel function with relative travel times
function travelToPost(postName) {
  if (playerLocation === postName) {
    document.getElementById(
      "travel-status"
    ).textContent = `You're already at ${postName}!`;
    return;
  }

  // Get travel time based on current location and destination
  let travelDays =
    travelTimes[playerLocation.toLowerCase()][postName.toLowerCase()];

  // Update player location and increment the current day by the travel time
  playerLocation = postName;
  currentDay += travelDays;
  currentDate.setDate(currentDate.getDate() + travelDays); // Increment the current date

  document.getElementById(
    "travel-status"
  ).textContent = `Traveling to ${postName} for ${travelDays} days...`;

  updateUI(); // Update UI with new day, location, and date

  // Simulate travel time with a timeout
  setTimeout(() => {
    document.getElementById(
      "travel-status"
    ).textContent = `Arrived at ${postName}!`;
    updatePrices(); // Update prices daily
    updateMarketDisplay(); // Update the market display based on the new location
  }, 1000); // Simulate the travel with a 1 second delay for now
}

// Function to update the market display based on the player's location
function updateMarketDisplay() {
  const marketHeading = document.getElementById("market-heading");
  const resourceGrid = document.getElementById("resource-grid");

  // Set the heading to the current trading post dynamically
  marketHeading.textContent = `${playerLocation} Trading Post`;

  // Clear any existing resources in the grid
  resourceGrid.innerHTML = "";

  // Get the resources and prices for the current trading post
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
    alert("You need to be at a trading post first!");
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
    alert("You need to be at a trading post first!");
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