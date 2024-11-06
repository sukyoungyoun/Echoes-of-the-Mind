let ribbonPoints = []; // Store points of the ribbon
let ribbonLength = 150; // Number of points to track for the ribbon
let prevMouseX, prevMouseY; // Store the previous mouse position for smooth movement
let time = 0; // For dynamic color shifts and movement
let noiseOffset = 0; // For introducing organic noise

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  smooth();
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  background(0); // Black background for contrast
}

function draw() {
  time += 0.05; // Increment time for dynamic effects
  noiseOffset += 0.02; // Slowly change the noise for continuous randomness

  // Capture the current mouse position
  let mousePos = createVector(mouseX, mouseY);

  // Calculate the velocity (speed) of the mouse movement
  let mouseVelocity = dist(mouseX, mouseY, prevMouseX, prevMouseY);
  
  // Add a new point to the ribbon (following the mouse cursor)
  ribbonPoints.push(mousePos);

  // Keep the ribbon smooth by only tracking a limited number of points
  if (ribbonPoints.length > ribbonLength) {
    ribbonPoints.splice(0, 1); // Remove the oldest point when the ribbon exceeds the length
  }

  // Draw the flowing ribbon by connecting the points
  drawRibbon(ribbonPoints, mouseVelocity);

  // Store current mouse position for the next frame
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

// Function to draw the ribbon using the points
function drawRibbon(points, velocity) {
  beginShape();
  
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    
    // Use Perlin noise to add organic movement and variation to the points
    let noiseFactor = noise(i * 0.1, noiseOffset) * 30;
    p.x += sin(noiseFactor) * 2; // Slight variation on x
    p.y += cos(noiseFactor) * 2; // Slight variation on y

    // Size oscillates with both time and the mouse velocity for a dynamic feel
    let size = map(i, 0, points.length, 15, 5);
    size += sin(time + i * 0.1) * 4 + velocity * 0.3;
    
    // Color shift based on the index and time
    let colorShift = map(i, 0, points.length, 0, 1);
    let ribbonColor = color(255 * noise(i * 0.05, time * 0.2), 
                            255 * colorShift, 
                            255 * (1 - colorShift));
    
    // Add alpha transparency based on velocity for smoother fading
    let alpha = map(velocity, 0, 20, 50, 150);
    ribbonColor.setAlpha(alpha);
    
    fill(ribbonColor);

    // Create a glowing effect by drawing slightly larger circles behind the current one
    ellipse(p.x, p.y, size, size);
  }
  
  endShape();
}

// Adjust the canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0); // Reset background when resized
}
