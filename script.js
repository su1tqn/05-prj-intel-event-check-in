// Get all the necessary elements from the DOM
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamInput = document.getElementById("teamSelect");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");

// Track attendance
let count = Number(localStorage.getItem("count")) || 0;
const maxCount = 50;
let waterCount = Number(localStorage.getItem("waterCount")) || 0;
let zeroCount = Number(localStorage.getItem("zeroCount")) || 0;
let powerCount = Number(localStorage.getItem("powerCount")) || 0;
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

function saveProgress() {
  localStorage.setItem("count", count);
  localStorage.setItem("waterCount", waterCount);
  localStorage.setItem("zeroCount", zeroCount);
  localStorage.setItem("powerCount", powerCount);
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

function updateDisplay() {
  attendeeCountDisplay.textContent = count;

  const percent = Math.round((count / maxCount) * 100);
  progressBar.style.width = percent + "%";

  document.getElementById("waterCount").textContent = waterCount;
  document.getElementById("zeroCount").textContent = zeroCount;
  document.getElementById("powerCount").textContent = powerCount;

  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    attendeeList.innerHTML = "<li>No attendees checked in yet.</li>";
    return;
  }

  for (let i = 0; i < attendees.length; i++) {
    const item = document.createElement("li");
    item.textContent = attendees[i].name + " - " + attendees[i].teamName;
    attendeeList.appendChild(item);
  }
}

function showCelebration() {
  if (count >= maxCount) {
    let winningTeam = "";

    if (waterCount >= zeroCount && waterCount >= powerCount) {
      winningTeam = "Team Water Wise";
    } else if (zeroCount >= waterCount && zeroCount >= powerCount) {
      winningTeam = "Team Net Zero";
    } else {
      winningTeam = "Team Renewables";
    }

    celebrationMessage.textContent =
      "Goal reached! " + winningTeam + " has the highest turnout!";
    celebrationMessage.style.display = "block";
  } else {
    celebrationMessage.style.display = "none";
  }
}

updateDisplay();

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get values from form
  const name = nameInput.value.trim();
  const team = teamInput.value;
  const teamName = teamInput.selectedOptions[0].text;

  // Extra safety check
  if (name === "" || team === "") {
    greeting.textContent = "Please enter a name and select a team.";
    greeting.style.display = "block";
    return;
  }

  // Increment total count
  count++;

  if (team === "water") {
    waterCount++;
  } else if (team === "zero") {
    zeroCount++;
  } else if (team === "power") {
    powerCount++;
  }

  attendees.push({
    name: name,
    teamName: teamName,
  });

  saveProgress();
  updateDisplay();

  // Show welcome message
  greeting.textContent = `Welcome ${name} from ${teamName}!`;
  greeting.style.display = "block";
  greeting.className = "success-message";

  showCelebration();

  // Reset form
  form.reset();
});
