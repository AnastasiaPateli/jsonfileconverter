let flatData = [];
let agreementText = "";

function setup() {
  let canvas = createCanvas(800, 1000);
  canvas.parent("canvas-container");
  background(255);
  textSize(14);
  fill(0);

  // Set up file input listener
  let fileInput = select("#upload");
  fileInput.changed(handleFile);

  // Set up download button listener
  select("#downloadBtn").mousePressed(() => {
    if (agreementText) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Split long text into lines for better formatting
      const lines = doc.splitTextToSize(agreementText, 180);
      doc.text(lines, 10, 20);

      doc.save("agreement.pdf");
    } else {
      alert("Please upload a JSON file first.");
    }
  });
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
εκμισθωτής ο/η ${fullName} του ${fatherName} κάτοικος ${address}
Α.Φ.Μ ${tin} Δ.Ο.Υ ${taxOffice}
και αφεντέρου ο/η _______ του _______ επαγγέλματος αγρότης
κάτοικος _______ οδός _______ αρ. _______
Α.Φ.Μ _______ Δ.Ο.Υ _______ έδρα _______

[...συνέχεια του συμφωνητικού...]

Το παρόν συμφωνητικό διαβάστηκε και έγινε αποδεκτό από τους συμβαλλόμενους, υπογράφηκε από αυτούς και ο καθένας έλαβε αντίγραφο.
`;
}

