
var modal = document.getElementById("inputModal");
var btn = document.getElementById("open-form-btn");
var span = document.getElementsByClassName("close")[0];

//open
btn.onclick = function() {
  modal.style.display = "block";
}

//close <x>
span.onclick = function() {
  modal.style.display = "none";
}

// close onclick outside modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// input and update
document.getElementById('user-input-form').addEventListener('submit', function(e) {
  e.preventDefault();

  //input
  const snoringRate = document.getElementById('snoring-rate-input').value;
  const respirationRate = document.getElementById('respiration-rate-input').value;
  const bodyTemp = document.getElementById('body-temp-input').value;
  const limbMovement = document.getElementById('limb-movement-input').value;
  const bodyOxygen = document.getElementById('body-oxygen-input').value;
  const sleepingHrs = document.getElementById('sleeping-hrs-input').value;
  const heartRate = document.getElementById('heart-rate-input').value;

  // update
  document.getElementById("snoring-rate").querySelector("p").innerText = snoringRate + " dB";
  document.getElementById("respiration-rate").querySelector("p").innerText = respirationRate + " BPM";
  document.getElementById("body-temp").querySelector("p").innerText = bodyTemp + "°C";
  document.getElementById("limb-movement").querySelector("p").innerText = limbMovement + " movements/min";
  document.getElementById("body-oxygen").querySelector("p").innerText = bodyOxygen + "%";
  document.getElementById("sleeping-hrs").querySelector("p").innerText = sleepingHrs + " hrs";
  document.getElementById("heart-rate").querySelector("p").innerText = heartRate + " BPM";

  // on submit
  modal.style.display = "none";
});

// pass stress level from modal to dash
document.getElementById('user-input-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const stressLevel = (Math.random() * 10).toFixed(0); // assign ran num for now 1-10
  document.getElementById("stress-level-value").innerText = stressLevel;

  // pass stress level to tips pags
  const managementTipsLink = document.getElementById('get-management-tips');
  const stressLevelParam = Math.round(stressLevel);
  managementTipsLink.href = `stress-management.html?stressLevel=${stressLevelParam}`;
});
