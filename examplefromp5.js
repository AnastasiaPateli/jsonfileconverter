let agreementText = "";

function setup() { 
  noCanvas(); 
// We don't need canvas for this viewer 
// Set up file input listener 
let fileInput = select("#upload"); 
  fileInput.changed(handleFile); 
  // Set up download button listener 
  select("#downloadBtn").mousePressed(() => { if (agreementText) { 
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF(); 
    // Split long text into lines for better formatting 
    const lines = doc.splitTextToSize(agreementText, 180); 
    doc.text(lines, 10, 20); doc.save("agreement.pdf"); 
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

        // Clear previous content
        select("#json-viewer").html("");
        select("#agreement-preview").html("");

        // Display collapsible JSON viewer in left panel
        displayJSON(json, select("#json-viewer"));

        // Generate multiple agreements
        const agreementList = generateAgreement(json);

        // Reset global agreementText for PDF
        agreementText = "";

        // Display each agreement in right panel and build combined text
        agreementList.forEach((text, index) => {
          agreementText += `Συμφωνητικό #${index + 1}\n\n${text}\n\n`;

          select("#agreement-preview").child(
            createP(`Συμφωνητικό #${index + 1}\n\n${text}`)
              .style("white-space", "pre-wrap")
              .style("margin-bottom", "30px")
              .style("font-family", "Georgia, serif")
              .style("font-size", "16px")
          );
        });
      } catch (err) {
        console.error("Invalid JSON:", err);
        alert("Το αρχείο JSON δεν είναι έγκυρο.");
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

function generateAgreement(data) {
  const fieldList =
    data.field_list &&
    Array.isArray(data.field_list) &&
    data.field_list[0] &&
    Array.isArray(data.field_list[0].field_property_list)
      ? data.field_list[0].field_property_list
      : [];

  const fullName = `${data.applicant_detail.first_name} ${data.applicant_detail.last_name}`;
  const fatherName = data.applicant_detail.father_name;
  const address = `${data.applicant_detail.street || ""} ${data.applicant_detail.street_number || ""}, ${data.applicant_detail.post_code}`;
  const tin = data.tin;
  const taxOffice = data.applicant_detail.tax_office_code;

  let agreements = [];

  for (let i = 0; i < fieldList.length; i++) {
    const field = fieldList[i];

    const agreement = `
ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΑΓΡΟΜΙΣΘΩΣΗΣ

Αριθμός συμφωνητικού: ${i + 1}

Σήμερα την 1η Νοεμβρίου 2024 στο Δημοτικό οι υπογράφοντες το συμφωνητικό αυτό
εκμισθωτής ο/η _______ του _______ κάτοικος _______
Α.Φ.Μ _______ Δ.Ο.Υ _______
και αφεντέρου ο/η ${fullName} του ${fatherName} επαγγέλματος αγρότης
κάτοικος ${address} οδός _______ αρ. _______
Α.Φ.Μ ${tin} Δ.Ο.Υ ${taxOffice} έδρα _______


Το παρόν συμφωνητικό διαβάστηκε και έγινε αποδεκτό από τους συμβαλλόμενους, υπογράφηκε από αυτούς και ο καθένας έλαβε αντίγραφο.
`;

    agreements.push(agreement);
  }

  return agreements;
}



