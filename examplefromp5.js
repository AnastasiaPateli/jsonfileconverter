let flatData = [];
let agreementText = "";


function setup() {
  noCanvas(); // We don't need canvas for this viewer

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
        displayJSON(json, select("#json-viewer"));
      } catch (err) {
        console.error("Invalid JSON:", err);
        alert("The uploaded file is not valid JSON.");
      }
    };

    reader.readAsText(file);
  }
}

function displayJSON(obj, container) {
  container.html(""); // Clear previous content

  const createSection = (key, value) => {
    let section = createDiv().style("margin", "10px 0");

    let header = createElement("button", key)
      .style("display", "block")
      .style("width", "100%")
      .style("text-align", "left")
      .style("background", "#eee")
      .style("border", "none")
      .style("padding", "10px")
      .style("font-weight", "bold")
      .style("cursor", "pointer");

    let content = createDiv().style("margin-left", "20px").hide();

    header.mousePressed(() => {
      content.style("display", content.style("display") === "none" ? "block" : "none");
    });

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          content.child(createSection(`[${index}]`, item));
        });
      } else {
        for (let subKey in value) {
          let subValue = value[subKey];
          content.child(createSection(subKey, subValue));
        }
      }
    } else {
      content.child(createP(`${value}`));
    }

    section.child(header);
    section.child(content);
    return section;
  };

  for (let key in obj) {
    container.child(createSection(key, obj[key]));
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

