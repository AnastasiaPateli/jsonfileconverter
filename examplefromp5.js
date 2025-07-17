let flatData = [];
let agreementText = "";

function setup() {
  noCanvas(); // We won't use canvas for this part

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
        displayJSON(json, select("#json-viewer"));
      } catch (err) {
        console.error("Invalid JSON:", err);
      }
    };

    reader.readAsText(file);
  }
}

function setup() {
  noCanvas(); // We won't use canvas for this part

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
        displayJSON(json, select("#json-viewer"));
      } catch (err) {
        console.error("Invalid JSON:", err);
      }
    };

    reader.readAsText(file);
  }
}

function handleFile() {
  let file = this.elt.files[0];

  if (file && file.type === "application/json") {
    let reader = new FileReader();

    reader.onload = function (e) {
      let content = e.target.result;

      try {
        let json = JSON.parse(content);

        // 1. Flatten and display the JSON
        flatData = [];
        flattenJSON(json);
        redrawCanvas();

        // 2. Generate the agreement text
        agreementText = generateAgreement(json);

        // 3. Display the agreement in the browser
        createP(agreementText)
          .style("white-space", "pre-wrap")
          .style("margin", "20px")
          .style("font-family", "Georgia, serif")
          .style("font-size", "16px");
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
        value.forEach((item, index) => {
          flattenJSON(item, `${newKey}[${index}]`);
        });
      } else {
        flattenJSON(value, newKey);
      }
    } else {
      flatData.push({ key: newKey, value: value !== null ? value : "null" });
    }
  }
}

function generateAgreement(data) {
  const fullName = `${data.applicant_detail.first_name} ${data.applicant_detail.last_name}`;
  const fatherName = data.applicant_detail.father_name;
  const address = `${data.applicant_detail.street || ""} ${data.applicant_detail.street_number || ""}, ${data.applicant_detail.post_code}`;
  const tin = data.tin;
  const taxOffice = data.applicant_detail.tax_office_code;

  return `
ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΑΓΡΟΜΙΣΘΩΣΗΣ

Σήμερα την 1η Νοεμβρίου 2024 στο Δημοτικό οι υπογράφοντες το συμφωνητικό αυτό
εκμισθωτής ο/η _______ του ______ κάτοικος _______
Α.Φ.Μ _______  Δ.Ο.Υ _______ 
και αφεντέρου ο/η ${fullName}  του ${fatherName} επαγγέλματος αγρότης
κάτοικος ${address} οδός _______ αρ. _______
Α.Φ.Μ ${tin} Δ.Ο.Υ ${taxOffice}έδρα _______

[...συνέχεια του συμφωνητικού...]

Το παρόν συμφωνητικό διαβάστηκε και έγινε αποδεκτό από τους συμβαλλόμενους, υπογράφηκε από αυτούς και ο καθένας έλαβε αντίγραφο.
`;
}

