let data;
let months;
let negRadius = 75;
let zeroRadius = 150;
let oneRadius = 200;
let outerRadius = 250;
let nullVal = '';
let currentRow = 1;
let currentMonth = 0;
let previousAnom = 0;
let alpha_ = 255;
let level = 10;
let setupColor = "#C7DCA7";
let currentYear = 0;
let blue_ = "#5858E1";
let red_ = "#FF6432";
let yearColor = "";

// Array to store country names
let countries = ["United States of America", "India", "Bangladesh"];
let currentCountry = 0; // Index of the current country

function preload() {
  // Dynamically load data for the selected country
  data = loadTable('parsed_India.csv', "csv", "header", () => {
    // This function is a callback that will be executed after the data is loaded
    months = data.columns.slice(2);
  });
}

// Descriptive information
function drawDescription() {
  textAlign(LEFT, TOP);
  textSize(16);
  fill(255);
  noStroke();
  textSize(30);
  fill(setupColor);
  text("Climate Spiral for India", -width / 2 + 20, -height / 2 + 20);
  fill(255);
  textSize(14);
  text(
    "This visualization represents climate anomalies over time for India. The spiral\n"
    + "displays temperature variations, with",
    -width / 2 + 20,
    -height / 2 + 60
  );
  
  // Blue text for cooler anomalies
  fill(100, 100, 255);
  text("blue indicating cooler anomalies,", -width / 2 + 250, -height / 2 + 78);

  // Red text for warmer anomalies
  fill(255, 100, 50);
  text("red for warmer anomalies,", -width / 2 + 20, -height / 2 + 100);

  // White text for normal temperatures
  fill(255);
  text("and white for normal temperatures.", -width / 2 + 185, -height / 2 + 100);
}


function setup() {
  createCanvas(600, 700);
}

function draw() {
  background(0);
  translate(width/2, height/2);
  
  drawDescription()
  
  translate(0, 50);
  
  textAlign(CENTER, CENTER);
  textSize(20);

  // Check if data is loaded
  if (months) {
    // Draw the components that rely on the loaded data

    // Draw month labels
    for (let i = 0; i < months.length; i++) {
      noStroke();
      fill(setupColor);
      let angle = map(i, 0, months.length, 0, TWO_PI) - PI/3;
      push();
      let x = (outerRadius + 10) * cos(angle);
      let y = (outerRadius + 10) * sin(angle);
      translate(x, y);
      rotate(angle + PI/2);
      text(months[i], 0, 0);
      pop();
    }

    // Draw other components that rely on the loaded data
    
    // Draw dial-like line indicating the month
    if (currentYear){
      let dialRadius = outerRadius + 10;
      let dialAngle = map(currentMonth, 0, months.length, 0, TWO_PI) - PI/3;
      stroke(150, 150, 150, currentYear > 1960?100:50); // Gray color with transparency
      strokeWeight(10);
      line(0, 0, dialRadius * cos(dialAngle), dialRadius * sin(dialAngle));
    }
  
    strokeWeight(2)
    // Example: Draw lines based on the data
    let firstValue = true;
    for (let j = 0; j < currentRow; j++) {
      let row_ = data.getRow(j);
      let totalMonths = months.length;
      if (j == currentRow - 1) {
        totalMonths = currentMonth;
      }

      beginShape();
      noFill();
      stroke(255);
      for (let i = 0; i < totalMonths; i++) {
        let anom = row_.getString(months[i]);
        if (anom !== nullVal) {
          anom = Number(anom);
          let angle = map(i, 0, months.length, 0, TWO_PI) - PI/3;
          let pr = map(previousAnom, 0, 1, zeroRadius, oneRadius);
          let r = map(anom, 0, 1, zeroRadius, oneRadius);
          let x1 = r * cos(angle);
          let y1 = r * sin(angle);
          let x2 = pr * cos(angle - PI/6);
          let y2 = pr * sin(angle - PI/6);
          if (!firstValue) {
            let avg = (anom + previousAnom) / 2;
            let cold = color(0, 0, 255, 190);
            let warm = color(255, 0, 0, 200);
            let norm_ = color(255, 255, 255, 150);
            let lineColor = norm_;
            if (avg < 0) {
              lineColor = lerpColor(norm_, cold, abs(avg));
            } else {
              lineColor = lerpColor(norm_, warm, abs(avg));
            }
            stroke(lineColor);
            line(x1, y1, x2, y2);
            yearColor = lineColor;
          }
          firstValue = false;
          previousAnom = anom;
        }
      }
      endShape(CLOSE);
      
    // Example: Draw the year
    let year = data.getRow(currentRow).get("Year");
    textSize(32);
    //fill(199, 220, 167, alpha_);
    fill(yearColor);
    text(year, 0, 0);
    currentYear = year;
    }

    // Increment currentMonth, update alpha_, and check if the animation should stop
    currentMonth = currentMonth + (currentYear < 1950?0.5: currentYear < 1960? 0.5: currentYear < 1980? 0.5: currentYear < 2000? 0.5: 0.5);
    if (currentMonth == months.length) {
      currentMonth = 0;
      currentRow++;
      if (currentRow == data.getRowCount()) {
        noLoop();
      }
    }
    alpha_ = alpha_ * 0.999991;
  }
  
  // Draw other components that don't rely on the loaded data
  textAlign(CENTER, CENTER);
  textSize(20);
  stroke(setupColor);
  strokeWeight(4);
  noFill();
  circle(0, 0, negRadius * 2);
  stroke(255);
  fill(199, 220, 167, 255);
  noStroke();
  text("-1°", negRadius + 17, 0);

  stroke(currentYear > 1900? setupColor:setupColor);
  strokeWeight(4);
  noFill();
  circle(0, 0, zeroRadius * 2);
  stroke(255);
  fill(199, 220, 167, 255);
  noStroke();
  text("0°", zeroRadius + 12, 0);

  stroke(setupColor);
  strokeWeight(4);
  noFill();
  circle(0, 0, oneRadius * 2);
  stroke(255);
  fill(199, 220, 167, 255);
  noStroke();
  text("1°", oneRadius + 12, 0);

  stroke(setupColor);
  strokeWeight(2);
  noFill();
  circle(0, 0, 500);
  fill(255);
  noStroke();
  frameRate(60);
}
