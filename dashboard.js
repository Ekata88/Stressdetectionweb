function updateMetrics() {
    document.getElementById("snoring-rate").querySelector("p").innerText = (Math.random() * 10).toFixed(1) + " dB";
    document.getElementById("respiration-rate").querySelector("p").innerText = (Math.random() * 30).toFixed(1) + " BPM";
    document.getElementById("body-temp").querySelector("p").innerText = (36 + Math.random()).toFixed(1) + "°C";
    document.getElementById("limb-movement").querySelector("p").innerText = (Math.random() * 10).toFixed(1) + " movements/min";
    document.getElementById("body-oxygen").querySelector("p").innerText = (90 + Math.random() * 10).toFixed(1) + "%";
    document.getElementById("sleeping-hrs").querySelector("p").innerText = (Math.random() * 8).toFixed(1) + " hrs";
    document.getElementById("heart-rate").querySelector("p").innerText = (Math.random() * 100).toFixed(1) + " BPM";
    document.getElementById("steps-taken").querySelector("p").innerText = Math.floor(Math.random() * 10000) + " steps";
    document.getElementById("stress-level").querySelector("p").innerText = (Math.random() * 100).toFixed(1) + "%";
  }
  
  // Update every 5 seconds for now
  setInterval(updateMetrics, 5000);
  
  // Initial update
  updateMetrics();
  