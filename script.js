/* =====================================================
   DIGI-CO QUICKCHECK
   script.js
   ===================================================== */

/* =====================================================
   GLOBALE VARIABLEN
   ===================================================== */

const required = document.querySelectorAll(".required");

let radarChart = null;
let barChart = null;

const SECTIONS = ["0", "A", "B", "C", "D", "E", "F"];

const SECTION_LABELS = {
  "0": "Digitalisierungslogik",
  "A": "Lieferanten",
  "B": "Interne Systeme",
  "C": "Kunden & Markt",
  "D": "Wissensmanagement",
  "E": "Rahmenbedingungen",
  "F": "Strategie"
};

/* =====================================================
   INITIALISIERUNG
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initAnswerListeners();
  initAiLogic();
  updateDashboard();
});

/* =====================================================
   EVENT LISTENER FÜR ANTWORTEN
   ===================================================== */

function initAnswerListeners() {

  document
    .querySelectorAll("select, textarea, input")
    .forEach(element => {

      element.addEventListener("change", () => {

        if (element.tagName === "SELECT") {
          updateQuestionColor(element);
        }

        updateAiVisibility();
        updateDashboard();

      });

      element.addEventListener("input", () => {

        updateAiVisibility();
        updateDashboard();

      });

    });
}

/* =====================================================
   AMPELSYSTEM PRO FRAGE
   ===================================================== */

function updateQuestionColor(select) {
  const question = select.closest(".question");

  if (!question) return;

  question.classList.remove("good", "medium", "bad");

  const value = Number(select.value);

  if (value === 4) {
    question.classList.add("good");
  } else if (value === 3) {
    question.classList.add("medium");
  } else if (value === 1 || value === 2) {
    question.classList.add("bad");
  }
}

/* =====================================================
   KI-FRAGEN-LOGIK
   KI-Fragen werden sichtbar, wenn Triggerfrage >= 3 ist
   ===================================================== */

function initAiLogic() {
      updateAiVisibility();
      updateDashboard();
}

function updateAiVisibility() {

  const sectionsWithAi = ["A", "B", "C", "D"];

  sectionsWithAi.forEach(section => {

    const aiContainer =
      document.getElementById(section.toLowerCase() + "-ai");

    if (!aiContainer) return;

    const digitalQuestions = [
      ...document.querySelectorAll(
        `.digital-question[data-section="${section}"] select`
      )
    ].filter(isVisible);

    const allDigitalQuestionsGood =
      digitalQuestions.length > 0 &&
      digitalQuestions.every(select => {

        const value = Number(select.value);

        return value === 3 || value === 4;

      });

    if (allDigitalQuestionsGood) {

      aiContainer.classList.remove("hidden");

    } else {

      aiContainer.classList.add("hidden");

      aiContainer
        .querySelectorAll("select, textarea, input")
        .forEach(field => {

          if (field.type === "checkbox" || field.type === "radio") {
            field.checked = false;
          } else {
            field.value = "";
          }

          const question = field.closest(".question");

          if (question) {
            question.classList.remove("good", "medium", "bad");
          }

        });

    }

  });

}
/* =====================================================
   DASHBOARD AKTUALISIEREN
   ===================================================== */

function updateDashboard() {

  updateProgress();

  const visibleRequired = [...required].filter(isVisible);

  const allVisibleAnswered =
    visibleRequired.length > 0 &&
    visibleRequired.every(field => {

      if (field.type === "checkbox" || field.type === "radio") {
        return field.checked;
      }

      return field.value !== "";

    });

  if (!allVisibleAnswered) {

    hideResultsUntilComplete();

    return;

  }

  const overallPercent = calculateOverallScore();
const digitalPercent = calculateDigitalScore();

const aiScoreCard = document.getElementById("aiScoreCard");

let aiPercent = 0;

if (hasAnsweredAiQuestions()) {

  aiPercent = calculateAiScore();

  if (aiScoreCard) {
    aiScoreCard.classList.remove("hidden");
  }

  updateScoreBox("aiScoreBox", aiPercent, "KI-Reifegrad");

} else {

  if (aiScoreCard) {
    aiScoreCard.classList.add("hidden");
  }

}

updateScoreBox("scoreBox", overallPercent, "Gesamt-Reifegrad");
updateScoreBox("digitalScoreBox", digitalPercent, "Digitalisierungsgrad");

updateCharts(overallPercent, digitalPercent, aiPercent);
}

/* =====================================================
   ERGEBNISSE ERST ANZEIGEN WENN ALLE SICHTBAREN FRAGEN BEANTWORTET SIND
   ===================================================== */

function hideResultsUntilComplete() {

  const scoreBoxes = [
    "scoreBox",
    "digitalScoreBox",
    "aiScoreBox"
  ];

  scoreBoxes.forEach(id => {

    const box = document.getElementById(id);

    if (!box) return;

    box.classList.remove("red", "yellow", "green");

    box.innerText =
      "Auswertung nach vollständiger Beantwortung";

  });

  if (radarChart) {
    radarChart.destroy();
    radarChart = null;
  }

  if (barChart) {
    barChart.destroy();
    barChart = null;
  }

}
/* =====================================================
   FORTSCHRITT
   ===================================================== */

function updateProgress() {
  const visibleRequired = [...required].filter(isVisible);

  const answered = visibleRequired.filter(field => {
    if (field.type === "checkbox" || field.type === "radio") {
      return field.checked;
    }

    return field.value !== "";
  }).length;

  const total = visibleRequired.length;
  const remaining = total - answered;

  const progress = total === 0
    ? 0
    : Math.round((answered / total) * 100);

  const remainingElement = document.getElementById("remaining");
  const progressBar = document.getElementById("progressBar");

  if (remainingElement) {
    remainingElement.innerText = remaining;
  }

  if (progressBar) {
    progressBar.style.width = progress + "%";
    progressBar.innerText = progress + "%";
  }
}

/* =====================================================
   GESAMT-REIFEGRAD
   Alle sichtbaren Skalenfragen
   ===================================================== */

function calculateOverallScore() {
  const values = getVisibleSelectValues("select");

  if (values.length === 0) return 0;

  const avg = average(values);

  return normalizeScore(avg);
}

/* =====================================================
   DIGITALISIERUNGSGRAD
   Nur Fragen mit .digital-question
   ===================================================== */

function calculateDigitalScore() {
  const values = getVisibleSelectValues(".digital-question select");

  if (values.length === 0) return 0;

  const avg = average(values);

  return normalizeScore(avg);
}

/* =====================================================
   KI-REIFEGRAD
   Nur Fragen mit .ai-question
   ===================================================== */

function calculateAiScore() {
  const values = getVisibleSelectValues(".ai-question select");

  if (values.length === 0) return 0;

  const avg = average(values);

  return normalizeScore(avg);
}

function hasAnsweredAiQuestions() {

  const aiValues = [
    ...document.querySelectorAll(".ai-question select")
  ]
    .filter(isVisible)
    .map(select => select.value)
    .filter(value => value !== "");

  return aiValues.length > 0;
}

/* =====================================================
   SICHTBARE SELECT-WERTE AUSLESEN
   ===================================================== */

function getVisibleSelectValues(selector) {
  return [...document.querySelectorAll(selector)]
    .filter(isVisible)
    .map(select => Number(select.value))
    .filter(value => !isNaN(value) && value >= 1 && value <= 4);
}

/* =====================================================
   DURCHSCHNITT PRO FRAGENBLOCK
   Für Radar: 0, A, B, C, D, E, F
   ===================================================== */

function getAverageBySection(section) {
  const values = [...document.querySelectorAll(`[data-section="${section}"] select`)]
    .filter(isVisible)
    .map(select => Number(select.value))
    .filter(value => !isNaN(value) && value >= 1 && value <= 4);

  if (values.length === 0) return 0;

  return average(values);
}

/* =====================================================
   HILFSFUNKTIONEN
   ===================================================== */

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeScore(score) {
  if (!score || score <= 0) return 0;

  return Math.round(((score - 1) / 3) * 100);
}

function isVisible(element) {
  return element.offsetParent !== null;
}

/* =====================================================
   SCORE-BOXEN AKTUALISIEREN
   ===================================================== */

function updateScoreBox(elementId, percent, label) {
  const box = document.getElementById(elementId);

  if (!box) return;

  box.classList.remove("red", "yellow", "green");

  if (percent < 50) {
    box.classList.add("red");
  } else if (percent < 75) {
    box.classList.add("yellow");
  } else {
    box.classList.add("green");
  }

  box.innerText = `${label}: ${percent} %`;
}

/* =====================================================
   DIAGRAMME
   Radar = 7-Eck nach Fragenblöcken
   Balken = Gesamt, Digitalisierung, KI
   ===================================================== */

function updateCharts(overallPercent, digitalPercent, aiPercent) {
  updateRadarChart();
  updateBarChart(overallPercent, digitalPercent, aiPercent);
}

/* =====================================================
   RADAR-CHART
   ===================================================== */

function updateRadarChart() {
  const radarElement = document.getElementById("radarChart");

  if (!radarElement || typeof Chart === "undefined") return;

  const radarData = SECTIONS.map(section => {
    return normalizeScore(getAverageBySection(section));
  });

  if (radarChart) {
    radarChart.destroy();
  }

  radarChart = new Chart(radarElement, {
    type: "radar",

    data: {
      labels: SECTIONS.map(section => SECTION_LABELS[section]),

      datasets: [{
        label: "Reifegrad je Fragenblock (%)",
        data: radarData
      }]
    },

    options: {
      responsive: true,

      scales: {
        r: {
          min: 0,
          max: 100,

          ticks: {
            stepSize: 20
          }
        }
      }
    }
  });
}

/* =====================================================
   BALKENDIAGRAMM
   ===================================================== */

function updateBarChart(overallPercent, digitalPercent, aiPercent) {
  const barElement = document.getElementById("barChart");

  if (!barElement || typeof Chart === "undefined") return;

  if (barChart) {
    barChart.destroy();
  }

  const labels = [
    "Gesamt",
    "Digitalisierung"
  ];

  const values = [
    overallPercent,
    digitalPercent
  ];

  if (hasAnsweredAiQuestions()) {
    labels.push("KI");
    values.push(aiPercent);
  }

  barChart = new Chart(barElement, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [{
        label: "Reifegrad (%)",
        data: values
      }]
    },

    options: {
      responsive: true,

      scales: {
        y: {
          min: 0,
          max: 100,

          ticks: {
            stepSize: 20
          }
        }
      }
    }
  });
}
/* =====================================================
   PDF EXPORT
   ===================================================== */

async function downloadPDF() {
  if (!window.jspdf) {
    alert("PDF-Bibliothek jsPDF wurde nicht geladen.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text("DIGI-CO Quickcheck Ergebnisse", 20, y);

  y += 15;

  doc.setFontSize(11);
  doc.text(`Gesamt-Reifegrad: ${calculateOverallScore()} %`, 20, y);
  y += 8;
  doc.text(`Digitalisierungsgrad: ${calculateDigitalScore()} %`, 20, y);
  y += 8;
  doc.text(`KI-Reifegrad: ${calculateAiScore()} %`, 20, y);
  y += 15;

  document.querySelectorAll(".question").forEach(question => {
    if (!isVisible(question)) return;

    const label = question.querySelector("label")?.innerText || "";
    const value = getQuestionValue(question);

    const text = `${label}: ${value}`;
    const lines = doc.splitTextToSize(text, 170);

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(lines, 20, y);
    y += lines.length * 7 + 5;
  });

  doc.save("DIGICO_Quickcheck.pdf");
}

/* =====================================================
   CSV EXPORT
   ===================================================== */

function downloadCSV() {
  let csv = "Frage;Antwort\n";

  document.querySelectorAll(".question").forEach(question => {
    if (!isVisible(question)) return;

    const label = question.querySelector("label")?.innerText || "";
    const value = getQuestionValue(question);

    csv += `"${escapeCSV(label)}";"${escapeCSV(value)}"\n`;
  });

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "DIGICO_Quickcheck.csv";
  link.click();

  URL.revokeObjectURL(url);
}

/* =====================================================
   EXPORT-HILFSFUNKTIONEN
   ===================================================== */

function getQuestionValue(question) {

  // 1. Alle angehakten Checkboxen innerhalb der Frage sammeln
  const checkedBoxes = [
    ...question.querySelectorAll("input[type='checkbox']:checked")
  ].map(box => box.value);

  // 2. Sonstiges-Feld auslesen, falls vorhanden
  const inputText = question.querySelector("input[type='text']");

  const otherValue =
    inputText && inputText.value.trim() !== ""
      ? "Sonstiges: " + inputText.value.trim()
      : "";

  // 3. Wenn Checkboxen oder Sonstiges vorhanden sind, gemeinsam zurückgeben
  if (checkedBoxes.length > 0 || otherValue !== "") {

    const values = [...checkedBoxes];

    if (otherValue !== "") {
      values.push(otherValue);
    }

    return values.join(", ");
  }

  // 4. Normale Select-Fragen auslesen
  const select = question.querySelector("select");

  if (select) {
    return select.value
      ? select.options[select.selectedIndex].text
      : "";
  }

  // 5. Offene Textantworten auslesen
  const textarea = question.querySelector("textarea");

  if (textarea) {
    return textarea.value;
  }

  // 6. Normale Textfelder auslesen
  if (inputText) {
    return inputText.value;
  }

  return "";
}
