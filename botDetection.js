
// Array to store the mouse movement data
let mouseMovements = [];

// Function to handle mouse movement
function handleMouseMove(event) {
  const movementData = {
    x: event.clientX, // X position relative to viewport
    y: event.clientY, // Y position relative to viewport
    timestamp: Date.now(), // Capture the timestamp
  };

  // Add the movement data to the array
  mouseMovements.push(movementData);

// Add event listener for mouse movement
window.addEventListener("mousemove", handleMouseMove);

// Optional: Save to localStorage every 5 seconds (for client-side persistence)
setInterval(() => {
  localStorage.setItem("mouseMovements", JSON.stringify(mouseMovements));
}, 5000);

}


// Wait for the page to fully load
// Wait for the page to fully load


let lastX = 0, lastY = 0;
let movements = [];

document.addEventListener("mousemove", (event) => {
    let { clientX, clientY } = event;

    // Calculate movement distance
    let dx = Math.abs(clientX - lastX);
    let dy = Math.abs(clientY - lastY);
    
    // Store movement data
    movements.push({ dx, dy });

    // Keep only the last 50 movements
    if (movements.length > 50) movements.shift();

    // Analyze bot-like patterns
    detectBotMovement();

    lastX = clientX;
    lastY = clientY;
});

function detectBotMovement() {
    if (movements.length < 20) return;

    let totalDx = 0, totalDy = 0;
    let samePattern = true;

    for (let i = 1; i < movements.length; i++) {
        totalDx += movements[i].dx;
        totalDy += movements[i].dy;

        if (movements[i].dx !== movements[i - 1].dx || movements[i].dy !== movements[i - 1].dy) {
            samePattern = false;
        }
    }

    // If movement is perfectly linear or repetitive, trigger alert
    if (samePattern || totalDx === 0 || totalDy === 0) {
         location.reload();
        document.removeEventListener("mousemove", detectBotMovement); // Stop further detection
    }
}




let lastKey = null;
let lastTime = 0;
const minTimeThreshold = 30; // Increased sensitivity to detect bots (in milliseconds)
const maxKeyDistance = 8; // Distance threshold between key codes to identify unnatural typing

document.addEventListener("keydown", (event) => {
    let currentTime = performance.now();
    let currentKey = event.key.toUpperCase();
    let currentKeyCode = event.code.charCodeAt(0);
    
    if (lastKey) {
        let timeDiff = currentTime - lastTime;
        let keyDistance = Math.abs(currentKeyCode - lastKey.charCodeAt(0));
        
        if (timeDiff < minTimeThreshold && keyDistance >= maxKeyDistance) {
           location.reload();
        }
    }
    
    lastKey = currentKey;
    lastTime = currentTime;
});


let lastKeyTime = performance.now();
document.addEventListener("keydown", () => {
    let currentTime = performance.now();
    if (currentTime - lastKeyTime < 30) {
      location.reload();
    }
    lastKeyTime = currentTime;
});


if (navigator.webdriver || !window.chrome) {
    location.reload();
    console.warn("Headless browser or bot detected!");
}


let lastClickTime = 0;
let clickCount = 0;
const clickThreshold = 3; // Number of rapid clicks before triggering an alert
const timeThreshold = 300; // Time in milliseconds to consider rapid clicking
let lastClickPosition = { x: 0, y: 0 };

document.addEventListener("click", (event) => {
    let currentTime = performance.now();
    let timeDiff = currentTime - lastClickTime;
    let clickPosition = { x: event.clientX, y: event.clientY };
    
    // Check if clicks are rapid and at the same position
    if (timeDiff < timeThreshold && Math.abs(clickPosition.x - lastClickPosition.x) < 5 && Math.abs(clickPosition.y - lastClickPosition.y) < 5) {
        clickCount++;
    } else {
        clickCount = 1; // Reset if time gap or position is different
    }

    if (clickCount >= clickThreshold) {
        location.reload();
        clickCount = 0; // Reset counter after detection
    }

    lastClickTime = currentTime;
    lastClickPosition = clickPosition;
});


if (!window.DeviceMotionEvent || !window.DeviceOrientationEvent) {
    location.reload();
}





async function checkSuspiciousIP() {
    try {
        let response = await fetch("https://ipinfo.io/json?token=5b9b80b2f93b82"); 
        let data = await response.json();

        let ip = data.ip;
        let org = data.org || "Unknown";
        let country = data.country;
        let isVPN = (org.includes("VPN") || org.includes("Proxy") || org.includes("Hosting"));

        console.log(`IP: ${ip}, ISP: ${org}, Country: ${country}`);

        // Flag suspicious network activity
        if (isVPN) {
           location.reload();
        }

    } catch (error) {
        console.error("Error fetching IP details:", error);
    }
}

// Call function on page load
checkSuspiciousIP();
