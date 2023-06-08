let plots = [];
let money = 0;
let season = "spring";
let day = 1;
let seasonCounter = 1;
let numPlots = 2;
let plotCost = 10;
let inventory = {};
let hunger = 10;

class Plot {
  constructor() {
    this.crop = null;
    this.growthProgress = 0;
    this.maxGrowthProgress = 0;
    this.isHarvested = false;

    this.element = document.createElement("div");
    this.element.className = "plot";
    this.element.innerHTML = "<p>Empty</p>";
    document.getElementById("plot-container").appendChild(this.element);

    this.growButton = document.createElement("button");
    this.growButton.className = "grow-button";
    this.growButton.innerText = "Grow";
    this.element.appendChild(this.growButton);
    this.growButton.addEventListener("click", () => {
      this.growCrop();
    });

    this.harvestButton = document.createElement("button");
    this.harvestButton.className = "harvest-button";
    this.harvestButton.innerText = "Harvest";
    this.element.appendChild(this.harvestButton);
    this.harvestButton.addEventListener("click", () => {
      this.harvestCrop();
    });
  }

  growCrop() {
    const cropSelector = document.getElementById("crop-selector");
    const selectedCrop = cropSelector.value;

    if (selectedCrop) {
      this.plantCrop(selectedCrop);
    } else {
      console.log("Invalid crop selection or plot is already occupied!");
    }
  }
  plantCrop(crop) {
    if (this.crop == null) {
      this.crop = crop;
      this.maxGrowthProgress = crops[crop]["growthTime"];
      console.log(
        "You planted " + crop + " on plot " + (plots.indexOf(this) + 1) + "!"
      );
    }
    updateGameState();
  }
  harvestCrop() {
    if (this.crop !== null && this.isHarvested) {
      inventory[this.crop] = (inventory[this.crop] || 0) + 1;

      console.log("You harvested the crop: " + this.crop);
      this.crop = null;
      this.growthProgress = 0;
      this.maxGrowthProgress = 0;
      this.isHarvested = false;
      updateGameState();
    } else {
      console.log("Crop is not ready to be harvested yet!");
    }
  }

  updateGrowButton() {
    this.growButton.disabled = this.crop !== null && !this.isHarvested;
  }
  destroyPlot() {
    this.element.remove();
  }
}

function plantAll() {
  const cropSelector = document.getElementById("crop-selector");
  const selectedCrop = cropSelector.value;

  if (selectedCrop) {
    for (let i = 0; i < plots.length; i++) {
      const plot = plots[i];
      if (plot.crop === null) {
        plot.plantCrop(selectedCrop);
      }
    }
    updateGameState();
  } else {
    console.log("No crop selected!");
  }
  console.log(selectedCrop);
}
document.getElementById("plant-all-button").addEventListener("click", () => {
  plantAll();
});

const crops = {
  Tomatoes: {
    growthTime: 3,
    value: 2,
    foodValue: 3,
  },
  Grapes: {
    growthTime: 4,
    value: 3,
    foodValue: 4,
  },
  Almonds: {
    growthTime: 5,
    value: 4,
    foodValue: 2,
  },
  Rice: {
    growthTime: 4,
    value: 3,
    foodValue: 6,
  },
  Sunflowers: {
    growthTime: 3,
    value: 2,
    foodValue: 1,
  },
  Walnuts: {
    growthTime: 6,
    value: 5,
    foodValue: 3,
  },
  Hay: {
    growthTime: 2,
    value: 1,
    foodValue: 1,
  },
  Olives: {
    growthTime: 4,
    value: 3,
    foodValue: 4,
  },
  Wheat: {
    growthTime: 4,
    value: 3,
    foodValue: 3,
  },
  Pistachios: {
    growthTime: 5,
    value: 4,
    foodValue: 2,
  },
  Corn: {
    growthTime: 3,
    value: 2,
    foodValue: 4,
  },
  Plums: {
    growthTime: 4,
    value: 3,
    foodValue: 5,
  },
};

function poplulateCropToEatSelector() {
  const cropToEat = document.getElementById("crop-to-eat");
  cropToEat.innerHTML =
    '<option value="" selected disabled>Select a crop</option>';
  const availableCrops = Object.keys(inventory);
  availableCrops.forEach((crop) => {
    const option = document.createElement("option");
    option.value = crop;
    option.text = crop + " (" + crops[crop]["foodValue"] + " hunger)";
    cropToEat.appendChild(option);
  });
}

function populateCropSelector() {
  const cropSelector = document.getElementById("crop-selector");
  cropSelector.innerHTML =
    '<option value="" selected disabled>Select a crop</option>';
  const availableCrops = getCropsForSeason();
  availableCrops.forEach((crop) => {
    const option = document.createElement("option");
    option.value = crop;
    option.text = crop + " (" + crops[crop]["growthTime"] + " days)";
    cropSelector.appendChild(option);
  });
}
function getCropsForSeason() {
  let crops = [];
  switch (season) {
    case "spring":
      crops = [
        "Tomatoes",
        "Grapes",
        "Almonds",
        "Rice",
        "Sunflowers",
        "Walnuts",
        "Hay",
        "Wheat",
        "Corn",
        "Plums",
      ];
      break;
    case "summer":
      crops = [
        "Tomatoes",
        "Grapes",
        "Rice",
        "Sunflowers",
        "Walnuts",
        "Hay",
        "Olives",
        "Wheat",
        "Pistachios",
        "Corn",
        "Plums",
      ];
      break;
    case "fall":
      crops = ["Tomatoes", "Grapes", "Olives", "Wheat", "Pistachios", "Corn"];
      break;
    case "winter":
      crops = ["Almonds", "Walnuts", "Wheat"];
      break;
    default:
      break;
  }
  return crops;
}

document.getElementById("harvest-all-button").addEventListener("click", () => {
  harvestAll();
});

function harvestAll() {
  for (let i = 0; i < plots.length; i++) {
    const plot = plots[i];
    if (plot.crop !== null && plot.isHarvested) {
      if (inventory.hasOwnProperty(plot.crop)) {
        inventory[plot.crop]++;
      } else {
        inventory[plot.crop] = 1;
      }
      plot.crop = null;
      plot.growthProgress = 0;
      plot.maxGrowthProgress = 0;
      plot.isHarvested = false;

      updateGameState();
    }
  }
}

function growCropOnPlot(plotIndex) {
  const selectedPlot = plots[plotIndex];
  selectedPlot.growCrop();
}

function updateCropGrowth() {
  for (let i = 0; i < plots.length; i++) {
    const plot = plots[i];
    if (plot.crop !== null && !plot.isHarvested) {
      plot.growthProgress += 1;
      if (plot.growthProgress >= plot.maxGrowthProgress) {
        console.log(
          "Your " +
            plot.crop +
            " on plot " +
            (i + 1) +
            " is ready to be harvested!"
        );
        plot.isHarvested = true;
      }
    }
  }
}

function sellCrops() {
  let harvestedCrops = 0;
  let earnings = 0;

  for (const crop in inventory) {
    const cropCount = inventory[crop];
    const cropEarnings = crops[crop]["value"] * cropCount;
    earnings += cropEarnings;
    harvestedCrops += cropCount;
    delete inventory[crop];
  }

  if (harvestedCrops > 0) {
    money += earnings;
    console.log(
      "You sold " + harvestedCrops + " crops and earned $" + earnings + "!"
    );
    updateGameState();
  } else {
    console.log("You don't have any crops in the inventory to sell!");
  }
}

function buyFood() {
  if (money >= 3) {
    money -= 3;
    console.log("You bought food for $3!");
    if (inventory.food) {
      inventory.food += 1;
    } else {
      inventory.food = 1;
    }
    updateGameState();
  } else {
    console.log("You don't have enough money to buy food!");
  }
}

function eatFood() {
  const cropToEat = document.getElementById("crop-to-eat").value;
  if (!cropToEat) {
    console.log("No crop selected!");
    return;
  }
  if (hunger < 10) {
    hunger += crops[cropToEat]["foodValue"];
    if (hunger > 10) {
      hunger = 10;
    }
    inventory[cropToEat] -= 1;
    if (inventory[cropToEat] === 0) {
      delete inventory[cropToEat];
    }
    console.log(inventory);
    console.log(cropToEat);
    console.log(
      "You ate a " +
        cropToEat +
        " and increased your hunger by " +
        crops[cropToEat]["foodValue"] +
        "!"
    );
    updateGameState();
  } else {
    console.log("Your hunger is already at the maximum level!");
  }
}

function buyPlot() {
  if (money >= plotCost) {
    money -= plotCost;
    numPlots++;
    console.log("You bought a new plot!");
    updateGameState();
    createPlot();
  } else {
    console.log("You don't have enough money to buy a new plot!");
  }
}

function createPlot() {
  const newPlot = new Plot();
  plots.push(newPlot);
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function incrementDay() {
  hunger -= 1;
  if (hunger === 0) {
    showGameOverScreen();
    return;
  }

  day += 1;
  console.log("Day " + day + " (" + daysOfWeek[(day - 1) % 7] + ")");
  if (day > 28) {
    day = 1;
    incrementSeason();
  }
  updateCropGrowth();
  updateGameState();
}

function incrementSeason() {
  seasonCounter++;
  switch (seasonCounter) {
    case 1:
      season = "spring";
      break;
    case 2:
      season = "summer";
      break;
    case 3:
      season = "fall";
      break;
    case 4:
      season = "winter";
      seasonCounter = 0;
      break;
    default:
      break;
  }
  console.log("It's now " + season + "!");
}

function showGameOverScreen() {
  const gameOverDialog = document.getElementById("game-over-dialog");
  gameOverDialog.showModal();
}

function updateGameState() {
  document.getElementById("hunger-display").textContent = hunger;
  formatInventory(inventory);

  document.getElementById("money-display").textContent = money;
  document.getElementById("season-display").textContent = season;
  document.getElementById("day-display").textContent = day;
  document.getElementById("day-of-the-week").textContent =
    daysOfWeek[(day - 1) % 7];
  poplulateCropToEatSelector();

  const plotElements = document.getElementsByClassName("plot");
  for (let i = 0; i < plots.length; i++) {
    const plot = plots[i];
    const plotElement = plotElements[i];
    plot.harvestButton.style.display = "none";
    plot.growButton.style.display = "none";

    if (plot.crop !== null) {
      plotElement.querySelector("p").innerText =
        plot.crop +
        "\n(Growth: " +
        plot.growthProgress +
        "/" +
        plot.maxGrowthProgress +
        ")";
      if (plot.isHarvested) {
        plot.harvestButton.style.display = "block";
      }
    } else {
      plotElement.querySelector("p").innerText = "Empty";
      plot.growButton.style.display = "block";
    }

    plot.growButton.disabled = plot.crop !== null && !plot.isHarvested;
  }
}

function formatInventory(inventory) {
  const inventoryDisplay = document.getElementById("inventory-display");

  inventoryDisplay.innerHTML = "";

  for (const item in inventory) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="item-name">${item}:</span> <span class="item-quantity">${inventory[item]}</span>`;
    inventoryDisplay.appendChild(listItem);
  }
}

function restartGame() {
  // Reset game state
  hunger = 10;
  money = 0;
  day = 1;
  seasonCounter = 1;
  plots.forEach((plot) => {
    plot.destroyPlot();
  });

  plots = [];
  questNum = 0;
  questRequirements = {
    Tomatoes: 5,
  };
  setCurrentQuest(initialQuest);

  // Close game over dialog
  const gameOverDialog = document.getElementById("game-over-dialog");
  gameOverDialog.close();

  // Reinitialize the game
  initializeGame();
}
const initialQuest =
  "Davis has a rich history of agriculture. In fact, UC Davis started off as University Farm,\
     a research farm for UC Berkeley. The farm was established in 1908 and was used to conduct research\
      on crops, livestock, and irrigation. Try out being a farmer and plant some tomatoes! Turn in 5 tomatoes!\
      But don't forget to eat!";
// Initialize the game
function initializeGame() {
  for (let i = 0; i < numPlots; i++) {
    createPlot();
  }
  populateCropSelector();
  updateGameState();

  setCurrentQuest(initialQuest);
}
const currentQuestElement = document.getElementById("current-quest");
function setCurrentQuest(quest) {
  currentQuestElement.textContent = quest;
}

// Define the quest requirements object
let questRequirements = {
  Tomatoes: 5,
};

// Function to check if the current quest is completed
function isCurrentQuestCompleted() {
  const currentQuest = document.getElementById("current-quest").textContent;

  for (const crop in questRequirements) {
    const requiredQuantity = questRequirements[crop];
    const cropInInventory = inventory[crop] || 0;

    if (cropInInventory < requiredQuantity) {
      return false;
    }
  }

  return true;
}

document.getElementById("turn-in-button").addEventListener("click", () => {
  turnInCrops();
});
let questNum = 0;
function turnInCrops() {
  if (isCurrentQuestCompleted()) {
    for (const crop in questRequirements) {
      const requiredQuantity = questRequirements[crop];
      removeCropFromInventory(crop, requiredQuantity);
    }

    if (questNum == 0) {
      const newQuest =
        "Congrats! Fun fact, Yolo county is the second largest producer of <a href='https://bfarm.com/processing-tomato'>processing tomatoes</a> in California!\
        Now, try planting some grapes! Turn in 5 grapes!";
      questRequirements = {
        Grapes: 5,
      };
      setCurrentQuest(newQuest);
    } else {
      const newQuest = "Quest Completed";
      setCurrentQuest(newQuest);
    }
    questNum++;
  } else {
    console.log("You haven't fulfilled the quest requirements!");
  }
}
function removeCropFromInventory(crop, quantity) {
  if (inventory.hasOwnProperty(crop)) {
    inventory[crop] -= quantity;
    if (inventory[crop] <= 0) {
      delete inventory[crop];
    }
  }
  updateGameState();
}

document.getElementById("eat-button").addEventListener("click", () => {
  eatFood();
});

document.getElementById("next-day-button").addEventListener("click", () => {
  incrementDay();
});

document.getElementById("sell-button").addEventListener("click", () => {
  sellCrops();
});

document.getElementById("buy-button").addEventListener("click", () => {
  buyFood();
});

document.getElementById("buy-plot-button").addEventListener("click", () => {
  buyPlot();
});
document
  .getElementById("restart-button")
  .addEventListener("click", restartGame);

// Initialize the game
initializeGame();
updateGameState();
