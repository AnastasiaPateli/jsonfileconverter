let flatData = [];

function setup() {
  let canvas = createCanvas(800, 1000);
  canvas.parent("canvas-container");
  background(255);
  textSize(14);
  fill(0);

  // Set up file input listener
  let fileInput = select("#upload");
  fileInput.changed(handleFile);
}

function handleFile() {
  let file = this.elt.files[0];
  if (file && file.type === "application/json") {
    let reader = new FileReader();
    reader.onload = function (e) {
      let content = e.target.result;
      try {
        let json = JSON.parse(content);
        flatData = [];
        flattenJSON(json);
        redrawCanvas();
      } catch (err) {
        console.error("Invalid JSON:", err);
      }
    };
    reader.readAsText(file);
  }
}

function redrawCanvas() {
  background(255);
  let y = 30;
  for (let i = 0; i < flatData.length; i++) {
    let item = flatData[i];
    text(item.key, 50, y);
    text(String(item.value), 400, y);
    y += 20;
  }
}
function flattenJSON(obj, prefix = "") {
  for (let key in obj) {
    let value = obj[key];
    let newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        // Handle arrays by indexing each item
        value.forEach((item, index) => {
          flattenJSON(item, `${newKey}[${index}]`);
        });
      } else {
        flattenJSON(value, newKey); // Recursively flatten objects
      }
    } else {
      // Include null, undefined, and other primitive values
      flatData.push({ key: newKey, value: value !== null ? value : "null" });
    }
  }
}


