// =====================================================
// DIGI-CO QUICKCHECK
// SCRIPT.JS
// =====================================================

// =====================================================
// GLOBALE VARIABLEN
// =====================================================

// Alle Select-Felder
const selects =
  document.querySelectorAll("select");

// Alle Pflichtfelder
const required =
  document.querySelectorAll(".required");

// Diagramm-Instanzen
let radarChart;
let barChart;

// =====================================================
// AMPELSYSTEM
// Bewertet Fragen farblich
// =====================================================

selects.forEach(select => {

  select.addEventListener("change", () => {

    // Zugehörige Frage bestimmen
    const question =
      select.closest(".question");

    // Vorherige Klassen entfernen
    question.classList.remove(
      "good",
      "medium",
      "bad"
    );

    // Bewertung setzen
    if(select.value === "4"){

      question.classList.add("good");

    } else if(select.value === "3"){

      question.classList.add("medium");

    } else if(
      select.value === "1" ||
      select.value === "2"
    ){

      question.classList.add("bad");
    }

    // Dashboard aktualisieren
    updateDashboard();

  });

});

// =====================================================
// KI-LOGIK
// Zeigt KI-Fragen nur bei ausreichender Digitalisierung
// =====================================================

document
  .querySelectorAll(".trigger-ai")
  .forEach(trigger => {

    trigger.addEventListener("change", () => {

      // Zielcontainer bestimmen
      const target =
        document.getElementById(
          trigger.dataset.target
        );

      // Gute Antworten
      if(
        trigger.value === "3" ||
        trigger.value === "4"
      ){

        target.classList.remove("hidden");

      } else {

        // KI-Fragen ausblenden
        target.classList.add("hidden");

        // Werte zurücksetzen
        target
          .querySelectorAll("select")
          .forEach(s => {

            s.value = "";

          });
      }

      // Dashboard aktualisieren
      updateDashboard();

    });

});

// =====================================================
// DASHBOARD AKTUALISIEREN
// =====================================================

function updateDashboard(){

  // Nur sichtbare Pflichtfelder
  const visibleRequired =
    [...required].filter(
      el => el.offsetParent !== null
    );

  // Beantwortete Fragen
  const answered =
    visibleRequired.filter(
      el => el.value !== ""
    ).length;

  // Gesamtanzahl
  const total =
    visibleRequired.length;

  // Fehlende Antworten
  const remaining =
    total - answered;

  // HTML aktualisieren
  document
    .getElementById("remaining")
    .innerText = remaining;

  // Prozentwert
  const progress =
    Math.round(
      (answered / total) * 100
    );

  // Fortschrittsbalken
  const progressBar =
    document.getElementById(
      "progressBar"
    );

  progressBar.style.width =
    progress + "%";

  progressBar.innerText =
    progress + "%";

  // Score berechnen
  calculateScore();
}

// =====================================================
// REIFEGRAD BERECHNEN
// =====================================================

function calculateScore(){

  // Sichtbare Selectwerte sammeln
  const values =
    [...document.querySelectorAll("select")]

      .filter(
        el => el.offsetParent !== null
      )

      .map(
        el => Number(el.value)
      )

      .filter(
        v => !isNaN(v)
      );

  // Keine Werte vorhanden
  if(values.length === 0) return;

  // Durchschnitt berechnen
  const avg =
    values.reduce(
      (a,b)=>a+b,
      0
    ) / values.length;

  // Score-Box
  const scoreBox =
    document.getElementById(
      "scoreBox"
    );

  // Bewertung
  if(avg < 2){

    scoreBox.className =
      "score-box red";

    scoreBox.innerText =
      "Reifegrad: Niedrig";

  } else if(avg < 3.5){

    scoreBox.className =
      "score-box yellow";

    scoreBox.innerText =
      "Reifegrad: Mittel";

  } else {

    scoreBox.className =
      "score-box green";

    scoreBox.innerText =
      "Reifegrad: Hoch";
  }

  // Diagramme aktualisieren
  updateCharts(avg);
}

// =====================================================
// DIAGRAMME AKTUALISIEREN
// =====================================================

function updateCharts(avg){

  // Bereichswerte berechnen
  const data = [

    getAverageBySection("A"),

    getAverageBySection("B"),

    getAverageBySection("C")

  ];

  // Vorheriges Radar löschen
  if(radarChart){

    radarChart.destroy();
  }

  // Radar Chart
  radarChart = new Chart(

    document.getElementById(
      "radarChart"
    ),

    {

      type:"radar",

      data:{

        labels:[
          "Lieferanten",
          "Interne Systeme",
          "Kunden"
        ],

        datasets:[{

          label:"Digitalisierungsgrad",

          data:data

        }]
      }
    }
  );

  // Vorheriges Balkendiagramm löschen
  if(barChart){

    barChart.destroy();
  }

  // Balkendiagramm
  barChart = new Chart(

    document.getElementById(
      "barChart"
    ),

    {

      type:"bar",

      data:{

        labels:[
          "Gesamt-Reifegrad"
        ],

        datasets:[{

          label:"Score",

          data:[avg]

        }]
      },

      options:{

        scales:{

          y:{

            min:0,

            max:4
          }
        }
      }
    }
  );
}

// =====================================================
// DURCHSCHNITT PRO BEREICH
// =====================================================

function getAverageBySection(letter){

  // Alle Labels sammeln
  const labels =
    [...document.querySelectorAll("label")];

  // Zugehörige Fragen filtern
  const related =
    labels.filter(l =>
      l.innerText.startsWith(letter)
    );

  let values = [];

  related.forEach(label => {

    const select =
      label.parentElement
        .querySelector("select");

    if(select && select.value){

      values.push(
        Number(select.value)
      );
    }

  });

  // Keine Werte
  if(values.length === 0){

    return 0;
  }

  // Durchschnitt
  return values.reduce(
    (a,b)=>a+b,
    0
  ) / values.length;
}

// =====================================================
// PDF EXPORT
// =====================================================

async function downloadPDF(){

  // jsPDF laden
  const { jsPDF } =
    window.jspdf;

  const doc =
    new jsPDF();

  let y = 20;

  // Titel
  doc.setFontSize(18);

  doc.text(
    "DIGI-CO Quickcheck",
    20,
    y
  );

  y += 20;

  // Alle Fragen durchlaufen
  document
    .querySelectorAll(".question")
    .forEach(q => {

      // Versteckte Fragen ignorieren
      if(q.offsetParent === null) return;

      const label =
        q.querySelector("label")
          ?.innerText || "";

      const select =
        q.querySelector("select");

      const textarea =
        q.querySelector("textarea");

      let value = "";

      // Selectwert lesen
      if(select){

        value =
          select.options[
            select.selectedIndex
          ].text;
      }

      // Textfeld lesen
      if(textarea){

        value = textarea.value;
      }

      // Text erzeugen
      const text =
        label + ": " + value;

      // Zeilen umbrechen
      const lines =
        doc.splitTextToSize(
          text,
          170
        );

      // In PDF schreiben
      doc.text(
        lines,
        20,
        y
      );

      // Position erhöhen
      y += lines.length * 8 + 5;

      // Seitenumbruch
      if(y > 270){

        doc.addPage();

        y = 20;
      }

    });

  // Datei speichern
  doc.save(
    "DIGICO_Quickcheck.pdf"
  );
}

// =====================================================
// CSV EXPORT
// =====================================================

function downloadCSV(){

  // CSV Header
  let csv =
    "Frage;Antwort\n";

  // Fragen sammeln
  document
    .querySelectorAll(".question")
    .forEach(q => {

      // Unsichtbare Fragen ignorieren
      if(q.offsetParent === null) return;

      const label =
        q.querySelector("label")
          ?.innerText || "";

      const select =
        q.querySelector("select");

      const textarea =
        q.querySelector("textarea");

      let value = "";

      // Selectwert lesen
      if(select){

        value =
          select.options[
            select.selectedIndex
          ].text;
      }

      // Textfeld lesen
      if(textarea){

        value = textarea.value;
      }

      // CSV Zeile ergänzen
      csv +=
        `"${label}";"${value}"\n`;

    });

  // Datei erzeugen
  const blob =
    new Blob(
      [csv],
      { type: "text/csv" }
    );

  const url =
    URL.createObjectURL(blob);

  // Downloadlink erzeugen
  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "DIGICO_Quickcheck.csv";

  a.click();

  // Speicher freigeben
  URL.revokeObjectURL(url);
}

// =====================================================
// INITIALISIERUNG
// =====================================================

// Dashboard initial laden
updateDashboard();
