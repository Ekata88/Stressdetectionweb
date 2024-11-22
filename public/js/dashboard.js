// Modal Handling Logic
// Get the modal element
var modal = document.getElementById("inputModal");

// Get the button that opens the modal
var btn = document.getElementById("open-form-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Capture form inputs and update dashboard metrics
document.getElementById('user-input-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const snoringRate = document.getElementById('snoring-rate-input').value;
  const respirationRate = document.getElementById('respiration-rate-input').value;
  const bodyTemp = document.getElementById('body-temp-input').value;
  const limbMovement = document.getElementById('limb-movement-input').value;
  const bodyOxygen = document.getElementById('body-oxygen-input').value;
  const sleepingHrs = document.getElementById('sleeping-hrs-input').value;
  const heartRate = document.getElementById('heart-rate-input').value;

  // Update dashboard with user input
  document.getElementById("snoring-rate").querySelector("p").innerText = snoringRate + " dB";
  document.getElementById("respiration-rate").querySelector("p").innerText = respirationRate + " BPM";
  document.getElementById("body-temp").querySelector("p").innerText = bodyTemp + "°C";
  document.getElementById("limb-movement").querySelector("p").innerText = limbMovement + " movements/min";
  document.getElementById("body-oxygen").querySelector("p").innerText = bodyOxygen + "%";
  document.getElementById("sleeping-hrs").querySelector("p").innerText = sleepingHrs + " hrs";
  document.getElementById("heart-rate").querySelector("p").innerText = heartRate + " BPM";

  // Close the modal after submission
  modal.style.display = "none";
});

// Pass stress level to the next page
document.getElementById('user-input-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const stressLevel = (Math.random() * 10).toFixed(1); // Assuming stress level between 1-10
  document.getElementById("stress-level-value").innerText = stressLevel;

  // Pass stress level as URL parameter
  const managementTipsLink = document.getElementById('get-management-tips');
  const stressLevelParam = Math.round(stressLevel);
  managementTipsLink.href = `stress-management.html?stressLevel=${stressLevelParam}`;
});
