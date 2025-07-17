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

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      flattenJSON(value, newKey);
    } else {
      flatData.push({ key: newKey, value: value });
    }
  }
}

