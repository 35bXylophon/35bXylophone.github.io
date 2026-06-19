/* =====================================================
   DIGI-CO QUICKCHECK
   Dynamische Version auf Basis von config.json
   ===================================================== */

let CONFIG = null;
let radarChart = null;
let barChart = null;

window.addEventListener("DOMContentLoaded", initQuickcheck);

async function initQuickcheck() {
  CONFIG = await loadConfig();
  applyMeta();
  renderQuestionnaire();
  initListeners();
  updateAiVisibility();
  updateDashboard();
}

async function loadConfig() {
  const localConfig = localStorage.getItem("quickcheckConfigPreview");
  if (localConfig) {
    try { return JSON.parse(localConfig); } catch (e) { console.warn("Lokale Vorschau-Konfiguration fehlerhaft."); }
  }

  const response = await fetch("config.json", { cache: "no-store" });
  if (!response.ok) throw new Error("config.json konnte nicht geladen werden.");
  return response.json();
}

function applyMeta() {
  document.title = CONFIG.meta.title || "Quickcheck";
  setText("appTitle", CONFIG.meta.title || "Quickcheck");
  setText("appSubtitle", CONFIG.meta.subtitle || "");
  setText("logoBox", CONFIG.meta.logoText || "Logo");
  setText("partnerBox", CONFIG.meta.partnerText || "Partner");
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.innerText = value;
}

function renderQuestionnaire() {
  const root = document.getElementById("questionnaire");
  root.innerHTML = "";

  CONFIG.sections.forEach(section => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.sectionCard = section.id;

    const title = document.createElement("h2");
    title.innerText = section.title;
    card.appendChild(title);

    const digitalQuestions = section.questions.filter(q => q.category !== "ai");
    const aiQuestions = section.questions.filter(q => q.category === "ai");

    digitalQuestions.forEach(question => {
      card.appendChild(renderQuestion(section, question));
    });

    if (aiQuestions.length > 0) {
      const aiContainer = document.createElement("div");
      aiContainer.id = getAiContainerId(section.id);
      aiContainer.className = "hidden ai-container";
      aiContainer.dataset.section = section.id;

      aiQuestions.forEach(question => {
        aiContainer.appendChild(renderQuestion(section, question));
      });

      card.appendChild(aiContainer);
    }

    root.appendChild(card);
  });
}

function renderQuestion(section, question) {
  const wrapper = document.createElement("div");
  wrapper.className = "question";
  wrapper.dataset.section = section.id;
  wrapper.dataset.questionId = question.id;
  wrapper.dataset.category = question.category || "digital";
  wrapper.dataset.type = question.type;

  if (question.category === "ai") wrapper.classList.add("ai-question");
  if (question.category === "digital") wrapper.classList.add("digital-question");

  const label = document.createElement("label");
  label.innerText = `${question.id} ${question.text}`;
  wrapper.appendChild(label);

  if (question.type === "scale") {
    const select = document.createElement("select");
    select.dataset.questionId = question.id;
    if (question.required) select.classList.add("required");

    const empty = document.createElement("option");
    empty.value = "";
    empty.innerText = "Bitte wählen";
    select.appendChild(empty);

    select.appendChild(option("1", "1 - gar nicht"));
    select.appendChild(option("2", "2 - kaum"));
    select.appendChild(option("3", "3 - teilweise"));
    select.appendChild(option("4", "4 - vollständig"));

    wrapper.appendChild(select);
  }

  if (question.type === "text") {
    const textarea = document.createElement("textarea");
    textarea.rows = 5;
    textarea.dataset.questionId = question.id;
    if (question.required) textarea.classList.add("required");
    wrapper.appendChild(textarea);
  }

  if (question.type === "checkbox") {
    const group = document.createElement("div");
    group.className = "checkbox-group";
    group.dataset.questionId = question.id;
    group.dataset.maxChoices = question.maxChoices || "";
    if (question.required) group.classList.add("required", "checkbox-required");

    (question.options || []).forEach(item => {
      const optionLabel = document.createElement("label");
      optionLabel.className = "checkbox-option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = question.id;
      input.value = item;

      optionLabel.appendChild(input);
      optionLabel.appendChild(document.createTextNode(item));
      group.appendChild(optionLabel);
    });

    if (question.allowOther) {
      const otherInput = document.createElement("input");
      otherInput.type = "text";
      otherInput.placeholder = "Sonstiges";
      otherInput.dataset.otherFor = question.id;
      group.appendChild(otherInput);
    }

    wrapper.appendChild(group);
  }

  return wrapper;
}

function option(value, label) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.innerText = label;
  return opt;
}

function initListeners() {
  document.querySelectorAll("select, textarea, input").forEach(element => {
    element.addEventListener("change", () => {
      if (element.tagName === "SELECT") updateQuestionColor(element);
      enforceCheckboxLimit(element);
      updateAiVisibility();
      updateDashboard();
    });

    element.addEventListener("input", () => {
      updateAiVisibility();
      updateDashboard();
    });
  });
}

function updateQuestionColor(select) {
  const question = select.closest(".question");
  if (!question) return;

  question.classList.remove("good", "medium", "bad");

  const value = Number(select.value);
  if (value === 4) question.classList.add("good");
  else if (value === 3) question.classList.add("medium");
  else if (value === 1 || value === 2) question.classList.add("bad");
}

function enforceCheckboxLimit(element) {
  if (element.type !== "checkbox") return;

  const group = element.closest(".checkbox-group");
  if (!group) return;

  const max = Number(group.dataset.maxChoices);
  if (!max) return;

  const checked = [...group.querySelectorAll("input[type='checkbox']:checked")];
  if (checked.length > max) {
    element.checked = false;
    alert(`Bitte maximal ${max} Optionen auswählen.`);
  }
}

function updateAiVisibility() {
  CONFIG.sections.forEach(section => {
    const aiContainer = document.getElementById(getAiContainerId(section.id));
    if (!aiContainer) return;

    const digitalSelects = [...document.querySelectorAll(`.digital-question[data-section="${section.id}"] select`)];

    const unlock = digitalSelects.length > 0 &&
      digitalSelects.every(select => Number(select.value) >= CONFIG.scoring.aiUnlockThreshold);

    if (unlock) {
      aiContainer.classList.remove("hidden");
    } else {
      aiContainer.classList.add("hidden");
      resetFieldsInside(aiContainer);
    }
  });
}

function getAiContainerId(sectionId) {
  return `ai-${sectionId}`;
}

function updateDashboard() {
  updateProgress();

  const allVisibleAnswered = areAllVisibleRequiredAnswered();
  const aiReady = allVisibleAnswered && allVisibleAiQuestionsAnswered();

  updateAiScoreVisibility(aiReady);

  if (CONFIG.scoring.showResultsOnlyWhenComplete && !allVisibleAnswered) {
    hideResultsUntilComplete();
    updateAiScoreVisibility(false);
    return;
  }

  const overallPercent = calculateOverallScore();
  const digitalPercent = calculateDigitalScore();
  const aiPercent = aiReady ? calculateAiScore() : null;

  updateScoreBox("scoreBox", overallPercent, "Gesamt-Reifegrad");
  updateScoreBox("digitalScoreBox", digitalPercent, "Digitalisierungsgrad");

  if (aiReady) updateScoreBox("aiScoreBox", aiPercent, "KI-Reifegrad");

  updateCharts(overallPercent, digitalPercent, aiPercent);
  updateRecommendations(overallPercent, digitalPercent, aiPercent);
}

function updateProgress() {
  const visibleRequired = getVisibleRequiredFields();
  const answered = visibleRequired.filter(isFieldAnswered).length;
  const total = visibleRequired.length;
  const remaining = total - answered;
  const progress = total === 0 ? 0 : Math.round((answered / total) * 100);

  setText("remaining", remaining);

  const bar = document.getElementById("progressBar");
  if (bar) {
    bar.style.width = progress + "%";
    bar.innerText = progress + "%";
  }
}

function getVisibleRequiredFields() {
  return [...document.querySelectorAll(".required")].filter(isVisible);
}

function areAllVisibleRequiredAnswered() {
  const fields = getVisibleRequiredFields();
  return fields.length > 0 && fields.every(isFieldAnswered);
}

function isFieldAnswered(field) {
  if (field.classList.contains("checkbox-group")) {
    return field.querySelectorAll("input[type='checkbox']:checked").length > 0;
  }
  if (field.type === "checkbox" || field.type === "radio") return field.checked;
  return field.value !== "";
}

function allVisibleAiQuestionsAnswered() {
  const visibleAiSelects = [...document.querySelectorAll(".ai-question select")].filter(isVisible);
  return visibleAiSelects.length > 0 && visibleAiSelects.every(select => select.value !== "");
}

function updateAiScoreVisibility(show) {
  const card = document.getElementById("aiScoreCard");
  if (!card) return;
  card.classList.toggle("hidden", show !== true);
}

function hideResultsUntilComplete() {
  updateScorePlaceholder("scoreBox");
  updateScorePlaceholder("digitalScoreBox");
  updateAiScoreVisibility(false);
  hideRecommendations();
  destroyCharts();
}

function updateScorePlaceholder(id) {
  const box = document.getElementById(id);
  if (!box) return;
  box.className = "score-box neutral";
  box.innerText = "Auswertung nach vollständiger Beantwortung";
}

function calculateOverallScore() {
  const scaleQuestions = getAllScaleQuestionsFromConfig();
  return calculateScoreAgainstAllQuestions(scaleQuestions);
}

function calculateDigitalScore() {
  const digitalQuestions = getAllScaleQuestionsFromConfig(q => q.category === "digital");
  return calculateScoreAgainstAllQuestions(digitalQuestions);
}

function calculateAiScore() {
  const aiQuestions = getAllScaleQuestionsFromConfig(q => q.category === "ai");
  return calculateScoreAgainstAllQuestions(aiQuestions);
}

function calculateSectionScore(sectionId) {
  const section = CONFIG.sections.find(s => s.id === sectionId);
  if (!section) return 0;
  const scaleQuestions = section.questions.filter(q => q.type === "scale");
  return calculateScoreAgainstAllQuestions(scaleQuestions);
}

function calculateScoreAgainstAllQuestions(questions) {
  if (!questions || questions.length === 0) return 0;

  let achieved = 0;
  const max = questions.length * CONFIG.scoring.scaleMax;

  questions.forEach(question => {
    const select = document.querySelector(`[data-question-id="${cssEscape(question.id)}"]`);
    if (select && select.value !== "") {
      let value = Number(select.value);
      if (question.invertScore) value = CONFIG.scoring.scaleMax + CONFIG.scoring.scaleMin - value;
      achieved += value;
    }
  });

  return Math.round((achieved / max) * 100);
}

function getAllScaleQuestionsFromConfig(filterFn = null) {
  const result = [];
  CONFIG.sections.forEach(section => {
    section.questions.forEach(question => {
      if (question.type === "scale" && (!filterFn || filterFn(question, section))) {
        result.push(question);
      }
    });
  });
  return result;
}

function updateScoreBox(id, percent, label) {
  const box = document.getElementById(id);
  if (!box) return;

  box.classList.remove("red", "yellow", "green", "neutral");

  if (percent < CONFIG.scoring.redBelow) box.classList.add("red");
  else if (percent < CONFIG.scoring.yellowBelow) box.classList.add("yellow");
  else box.classList.add("green");

  box.innerText = `${label}: ${percent} %`;
}

function updateCharts(overallPercent, digitalPercent, aiPercent) {
  updateRadarChart();
  updateBarChart(overallPercent, digitalPercent, aiPercent);
}

function updateRadarChart() {
  const element = document.getElementById("radarChart");
  if (!element || typeof Chart === "undefined") return;

  if (radarChart) radarChart.destroy();

  radarChart = new Chart(element, {
    type: "radar",
    data: {
      labels: CONFIG.sections.map(s => s.radarLabel || s.id),
      datasets: [{
        label: "Reifegrad je Fragenblock (%)",
        data: CONFIG.sections.map(s => calculateSectionScore(s.id))
      }]
    },
    options: {
      responsive: true,
      scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } }
    }
  });
}

function updateBarChart(overallPercent, digitalPercent, aiPercent) {
  const element = document.getElementById("barChart");
  if (!element || typeof Chart === "undefined") return;

  if (barChart) barChart.destroy();

  const labels = ["Gesamt", "Digitalisierung"];
  const values = [overallPercent, digitalPercent];

  if (aiPercent !== null) {
    labels.push("KI");
    values.push(aiPercent);
  }

  barChart = new Chart(element, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Reifegrad (%)", data: values }]
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 100, ticks: { stepSize: 20 } } }
    }
  });
}

function destroyCharts() {
  if (radarChart) { radarChart.destroy(); radarChart = null; }
  if (barChart) { barChart.destroy(); barChart = null; }
}

function updateRecommendations(overallPercent, digitalPercent, aiPercent) {
  const card = document.getElementById("recommendationCard");
  const list = document.getElementById("recommendations");
  if (!card || !list) return;

  const recommendations = [];

  (CONFIG.recommendations || []).forEach(rule => {
    let value = null;
    if (rule.scope === "overall") value = overallPercent;
    if (rule.scope === "digital") value = digitalPercent;
    if (rule.scope === "ai") value = aiPercent;
    if (rule.scope && rule.scope.startsWith("section:")) {
      value = calculateSectionScore(rule.scope.split(":")[1]);
    }

    if (value !== null && value < rule.below) recommendations.push(rule.text);
  });

  list.innerHTML = recommendations.map(text => `<li>${escapeHTML(text)}</li>`).join("");
  card.classList.toggle("hidden", recommendations.length === 0);
}

function hideRecommendations() {
  const card = document.getElementById("recommendationCard");
  const list = document.getElementById("recommendations");
  if (card) card.classList.add("hidden");
  if (list) list.innerHTML = "";
}

function downloadPDF() {
  if (!window.jspdf) { alert("jsPDF wurde nicht geladen."); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text(CONFIG.meta.title || "Quickcheck", 20, y);
  y += 15;

  doc.setFontSize(11);
  if (areAllVisibleRequiredAnswered()) {
    doc.text(`Gesamt-Reifegrad: ${calculateOverallScore()} %`, 20, y); y += 8;
    doc.text(`Digitalisierungsgrad: ${calculateDigitalScore()} %`, 20, y); y += 8;
    if (allVisibleAiQuestionsAnswered()) { doc.text(`KI-Reifegrad: ${calculateAiScore()} %`, 20, y); y += 8; }
  } else {
    doc.text("Auswertung: noch nicht vollständig beantwortet", 20, y); y += 8;
  }
  y += 8;

  CONFIG.sections.forEach(section => {
    const sectionTitle = section.title;
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.text(sectionTitle, 20, y);
    y += 8;
    doc.setFontSize(10);

    section.questions.forEach(question => {
      const element = document.querySelector(`[data-question-id="${cssEscape(question.id)}"]`);
      const questionWrapper = document.querySelector(`[data-question-id="${cssEscape(question.id)}"]`)?.closest(".question");
      if (questionWrapper && !isVisible(questionWrapper)) return;

      const value = getQuestionValue(question);
      const lines = doc.splitTextToSize(`${question.id} ${question.text}: ${value}`, 170);
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(lines, 20, y);
      y += lines.length * 6 + 5;
    });
  });

  doc.save(CONFIG.meta.pdfFileName || "Quickcheck.pdf");
}

function downloadCSV() {
  let csv = "Block;Frage;Antwort\n";

  CONFIG.sections.forEach(section => {
    section.questions.forEach(question => {
      const wrapper = document.querySelector(`[data-question-id="${cssEscape(question.id)}"]`)?.closest(".question");
      if (wrapper && !isVisible(wrapper)) return;
      csv += `"${escapeCSV(section.title)}";"${escapeCSV(question.id + " " + question.text)}";"${escapeCSV(getQuestionValue(question))}"\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = CONFIG.meta.csvFileName || "Quickcheck.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function getQuestionValue(question) {
  if (question.type === "scale") {
    const select = document.querySelector(`[data-question-id="${cssEscape(question.id)}"]`);
    return select && select.value ? select.options[select.selectedIndex].text : "";
  }

  if (question.type === "text") {
    const textarea = document.querySelector(`[data-question-id="${cssEscape(question.id)}"]`);
    return textarea ? textarea.value : "";
  }

  if (question.type === "checkbox") {
    const group = document.querySelector(`.checkbox-group[data-question-id="${cssEscape(question.id)}"]`);
    if (!group) return "";
    const checked = [...group.querySelectorAll("input[type='checkbox']:checked")].map(i => i.value);
    const other = group.querySelector("input[type='text']")?.value.trim();
    if (other) checked.push("Sonstiges: " + other);
    return checked.join(", ");
  }

  return "";
}

function resetQuestionnaire() {
  if (!confirm("Möchten Sie wirklich alle Antworten zurücksetzen?")) return;
  document.querySelectorAll("select").forEach(el => el.value = "");
  document.querySelectorAll("textarea, input[type='text']").forEach(el => el.value = "");
  document.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach(el => el.checked = false);
  document.querySelectorAll(".question").forEach(q => q.classList.remove("good", "medium", "bad"));
  document.querySelectorAll(".ai-container").forEach(c => c.classList.add("hidden"));
  updateAiScoreVisibility(false);
  hideRecommendations();
  destroyCharts();
  updateDashboard();
  window.scrollTo({ top:0, behavior:"smooth" });
}

function resetFieldsInside(container) {
  container.querySelectorAll("select").forEach(el => el.value = "");
  container.querySelectorAll("textarea, input[type='text']").forEach(el => el.value = "");
  container.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach(el => el.checked = false);
  container.querySelectorAll(".question").forEach(q => q.classList.remove("good", "medium", "bad"));
}

function isVisible(element) {
  return element && element.offsetParent !== null;
}

function cssEscape(value) {
  if (window.CSS && CSS.escape) return CSS.escape(value);
  return String(value).replace(/"/g, '\\"');
}

function escapeCSV(value) {
  return String(value ?? "").replaceAll('"', '""');
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
