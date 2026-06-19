/* =====================================================
   QUICKCHECK BUILDER
   Bearbeitet config.json clientseitig und exportiert sie
   ===================================================== */

let CONFIG = null;

window.addEventListener("DOMContentLoaded", initBuilder);

async function initBuilder() {
  CONFIG = await loadBuilderConfig();
  bindImport();
  renderAll();
}

async function loadBuilderConfig() {
  const local = localStorage.getItem("quickcheckConfigPreview");
  if (local) {
    try { return JSON.parse(local); } catch (e) { console.warn("Lokale Vorschau defekt."); }
  }
  const response = await fetch("config.json", { cache: "no-store" });
  return response.json();
}

function renderAll() {
  renderMeta();
  renderScoring();
  renderSections();
  renderRecommendations();
  updateJsonPreview();
  updateHeaderPlaceholders();
}

function readAll() {
  readMeta();
  readScoring();
  readSections();
  readRecommendations();
  updateJsonPreview();
  updateHeaderPlaceholders();
}

function renderMeta() {
  setValue("metaTitle", CONFIG.meta.title);
  setValue("metaSubtitle", CONFIG.meta.subtitle);
  setValue("metaLogoText", CONFIG.meta.logoText);
  setValue("metaPartnerText", CONFIG.meta.partnerText);
  setValue("metaPdfFileName", CONFIG.meta.pdfFileName);
  setValue("metaCsvFileName", CONFIG.meta.csvFileName);
  ["metaTitle","metaSubtitle","metaLogoText","metaPartnerText","metaPdfFileName","metaCsvFileName"].forEach(id => {
    document.getElementById(id).oninput = readAll;
  });
}

function readMeta() {
  CONFIG.meta.title = getValue("metaTitle");
  CONFIG.meta.subtitle = getValue("metaSubtitle");
  CONFIG.meta.logoText = getValue("metaLogoText");
  CONFIG.meta.partnerText = getValue("metaPartnerText");
  CONFIG.meta.pdfFileName = getValue("metaPdfFileName");
  CONFIG.meta.csvFileName = getValue("metaCsvFileName");
}

function renderScoring() {
  setValue("scoreAiUnlockThreshold", CONFIG.scoring.aiUnlockThreshold);
  setValue("scoreRedBelow", CONFIG.scoring.redBelow);
  setValue("scoreYellowBelow", CONFIG.scoring.yellowBelow);
  setValue("scoreShowResultsOnlyWhenComplete", String(CONFIG.scoring.showResultsOnlyWhenComplete));
  ["scoreAiUnlockThreshold","scoreRedBelow","scoreYellowBelow","scoreShowResultsOnlyWhenComplete"].forEach(id => {
    document.getElementById(id).oninput = readAll;
    document.getElementById(id).onchange = readAll;
  });
}

function readScoring() {
  CONFIG.scoring.aiUnlockThreshold = Number(getValue("scoreAiUnlockThreshold"));
  CONFIG.scoring.redBelow = Number(getValue("scoreRedBelow"));
  CONFIG.scoring.yellowBelow = Number(getValue("scoreYellowBelow"));
  CONFIG.scoring.showResultsOnlyWhenComplete = getValue("scoreShowResultsOnlyWhenComplete") === "true";
}

function renderSections() {
  const root = document.getElementById("sectionsEditor");
  root.innerHTML = "";

  CONFIG.sections.forEach((section, sectionIndex) => {
    const container = document.createElement("div");
    container.className = "builder-section";
    container.innerHTML = `
      <h3>Block ${escapeHTML(section.id)}</h3>
      <div class="builder-grid">
        <div><label>Block-ID</label><input data-section-field="id" data-section-index="${sectionIndex}" value="${escapeAttr(section.id)}"></div>
        <div><label>Titel</label><input data-section-field="title" data-section-index="${sectionIndex}" value="${escapeAttr(section.title)}"></div>
        <div><label>Radar-Label</label><input data-section-field="radarLabel" data-section-index="${sectionIndex}" value="${escapeAttr(section.radarLabel || section.id)}"></div>
        <div><label>Enthält KI-Fragen</label>
          <select data-section-field="hasAiQuestions" data-section-index="${sectionIndex}">
            <option value="true" ${section.hasAiQuestions ? "selected" : ""}>Ja</option>
            <option value="false" ${!section.hasAiQuestions ? "selected" : ""}>Nein</option>
          </select>
        </div>
      </div>
      <h3>Fragen</h3>
      <div data-question-list="${sectionIndex}"></div>
      <button type="button" onclick="addQuestion(${sectionIndex})" class="success-button">+ Frage hinzufügen</button>
      <button type="button" onclick="duplicateSection(${sectionIndex})" class="secondary-button">Block duplizieren</button>
      <button type="button" onclick="deleteSection(${sectionIndex})" class="danger-button">Block löschen</button>
    `;
    root.appendChild(container);

    const list = container.querySelector(`[data-question-list="${sectionIndex}"]`);
    section.questions.forEach((question, questionIndex) => {
      list.appendChild(renderQuestionEditor(sectionIndex, questionIndex, question));
    });
  });

  root.querySelectorAll("input, select, textarea").forEach(el => {
    el.addEventListener("input", readAll);
    el.addEventListener("change", readAll);
  });
}

function renderQuestionEditor(sectionIndex, questionIndex, question) {
  const div = document.createElement("div");
  div.className = "question-editor";
  div.innerHTML = `
    <div class="builder-grid">
      <div><label>Frage-ID</label><input data-question-field="id" data-section-index="${sectionIndex}" data-question-index="${questionIndex}" value="${escapeAttr(question.id)}"></div>
      <div><label>Typ</label>
        <select data-question-field="type" data-section-index="${sectionIndex}" data-question-index="${questionIndex}">
          <option value="scale" ${question.type === "scale" ? "selected" : ""}>Skala 1–4</option>
          <option value="text" ${question.type === "text" ? "selected" : ""}>Freitext</option>
          <option value="checkbox" ${question.type === "checkbox" ? "selected" : ""}>Checkbox</option>
        </select>
      </div>
      <div><label>Kategorie</label>
        <select data-question-field="category" data-section-index="${sectionIndex}" data-question-index="${questionIndex}">
          <option value="digital" ${question.category === "digital" ? "selected" : ""}>Digitalisierung</option>
          <option value="ai" ${question.category === "ai" ? "selected" : ""}>KI</option>
          <option value="info" ${question.category === "info" ? "selected" : ""}>Info / nicht bewertet</option>
        </select>
      </div>
      <div><label>Pflichtfrage</label>
        <select data-question-field="required" data-section-index="${sectionIndex}" data-question-index="${questionIndex}">
          <option value="true" ${question.required ? "selected" : ""}>Ja</option>
          <option value="false" ${!question.required ? "selected" : ""}>Nein</option>
        </select>
      </div>
    </div>
    <label>Fragetext</label>
    <textarea rows="3" data-question-field="text" data-section-index="${sectionIndex}" data-question-index="${questionIndex}">${escapeHTML(question.text)}</textarea>
    <div class="builder-grid">
      <div><label>Invertiertes Scoring</label>
        <select data-question-field="invertScore" data-section-index="${sectionIndex}" data-question-index="${questionIndex}">
          <option value="false" ${!question.invertScore ? "selected" : ""}>Nein</option>
          <option value="true" ${question.invertScore ? "selected" : ""}>Ja</option>
        </select>
      </div>
      <div><label>Max. Checkbox-Auswahl</label><input type="number" data-question-field="maxChoices" data-section-index="${sectionIndex}" data-question-index="${questionIndex}" value="${question.maxChoices || ""}"></div>
      <div><label>Sonstiges erlauben</label>
        <select data-question-field="allowOther" data-section-index="${sectionIndex}" data-question-index="${questionIndex}">
          <option value="false" ${!question.allowOther ? "selected" : ""}>Nein</option>
          <option value="true" ${question.allowOther ? "selected" : ""}>Ja</option>
        </select>
      </div>
      <div><label>Checkbox-Optionen, kommagetrennt</label><input data-question-field="options" data-section-index="${sectionIndex}" data-question-index="${questionIndex}" value="${escapeAttr((question.options || []).join(", "))}"></div>
    </div>
    <button type="button" onclick="duplicateQuestion(${sectionIndex}, ${questionIndex})" class="secondary-button">Frage duplizieren</button>
    <button type="button" onclick="deleteQuestion(${sectionIndex}, ${questionIndex})" class="danger-button">Frage löschen</button>
  `;
  return div;
}

function readSections() {
  document.querySelectorAll("[data-section-field]").forEach(input => {
    const index = Number(input.dataset.sectionIndex);
    const field = input.dataset.sectionField;
    let value = input.value;
    if (field === "hasAiQuestions") value = value === "true";
    CONFIG.sections[index][field] = value;
  });

  document.querySelectorAll("[data-question-field]").forEach(input => {
    const sectionIndex = Number(input.dataset.sectionIndex);
    const questionIndex = Number(input.dataset.questionIndex);
    const field = input.dataset.questionField;
    let value = input.value;

    if (field === "required" || field === "invertScore" || field === "allowOther") value = value === "true";
    if (field === "maxChoices") value = value === "" ? undefined : Number(value);
    if (field === "options") value = value.split(",").map(v => v.trim()).filter(Boolean);

    CONFIG.sections[sectionIndex].questions[questionIndex][field] = value;
  });
}

function addSection() {
  readAll();
  CONFIG.sections.push({ id:"X", title:"Neuer Fragenblock", radarLabel:"Neu", hasAiQuestions:false, questions:[] });
  renderAll();
}

function duplicateSection(index) {
  readAll();
  const copy = JSON.parse(JSON.stringify(CONFIG.sections[index]));
  copy.id = copy.id + "_Kopie";
  copy.title = copy.title + " Kopie";
  CONFIG.sections.splice(index + 1, 0, copy);
  renderAll();
}

function deleteSection(index) {
  if (!confirm("Block wirklich löschen?")) return;
  readAll();
  CONFIG.sections.splice(index, 1);
  renderAll();
}

function addQuestion(sectionIndex) {
  readAll();
  CONFIG.sections[sectionIndex].questions.push({ id:"Neue Frage", text:"Neue Frage", type:"scale", category:"digital", required:true });
  renderAll();
}

function duplicateQuestion(sectionIndex, questionIndex) {
  readAll();
  const copy = JSON.parse(JSON.stringify(CONFIG.sections[sectionIndex].questions[questionIndex]));
  copy.id = copy.id + "_Kopie";
  CONFIG.sections[sectionIndex].questions.splice(questionIndex + 1, 0, copy);
  renderAll();
}

function deleteQuestion(sectionIndex, questionIndex) {
  if (!confirm("Frage wirklich löschen?")) return;
  readAll();
  CONFIG.sections[sectionIndex].questions.splice(questionIndex, 1);
  renderAll();
}

function renderRecommendations() {
  const root = document.getElementById("recommendationsEditor");
  root.innerHTML = "";

  (CONFIG.recommendations || []).forEach((rec, index) => {
    const div = document.createElement("div");
    div.className = "question-editor";
    div.innerHTML = `
      <div class="builder-grid">
        <div><label>Scope</label><input data-rec-field="scope" data-rec-index="${index}" value="${escapeAttr(rec.scope)}"></div>
        <div><label>Wenn unter (%)</label><input type="number" data-rec-field="below" data-rec-index="${index}" value="${rec.below}"></div>
      </div>
      <label>Empfehlungstext</label>
      <textarea rows="3" data-rec-field="text" data-rec-index="${index}">${escapeHTML(rec.text)}</textarea>
      <button type="button" onclick="deleteRecommendation(${index})" class="danger-button">Empfehlung löschen</button>
    `;
    root.appendChild(div);
  });

  root.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("input", readAll);
  });
}

function readRecommendations() {
  if (!CONFIG.recommendations) CONFIG.recommendations = [];
  document.querySelectorAll("[data-rec-field]").forEach(input => {
    const index = Number(input.dataset.recIndex);
    const field = input.dataset.recField;
    let value = input.value;
    if (field === "below") value = Number(value);
    CONFIG.recommendations[index][field] = value;
  });
}

function addRecommendation() {
  readAll();
  if (!CONFIG.recommendations) CONFIG.recommendations = [];
  CONFIG.recommendations.push({ scope:"overall", below:50, text:"Neue Empfehlung" });
  renderAll();
}

function deleteRecommendation(index) {
  if (!confirm("Empfehlung wirklich löschen?")) return;
  readAll();
  CONFIG.recommendations.splice(index, 1);
  renderAll();
}

function updateJsonPreview() {
  document.getElementById("jsonPreview").value = JSON.stringify(CONFIG, null, 2);
}

function applyJsonPreview() {
  try {
    CONFIG = JSON.parse(document.getElementById("jsonPreview").value);
    renderAll();
  } catch (e) {
    alert("JSON ist ungültig: " + e.message);
  }
}

function downloadConfig() {
  readAll();
  const blob = new Blob([JSON.stringify(CONFIG, null, 2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "config.json";
  link.click();
  URL.revokeObjectURL(url);
}

function previewConfig() {
  readAll();
  localStorage.setItem("quickcheckConfigPreview", JSON.stringify(CONFIG));
  alert("Vorschau gespeichert. Öffne jetzt index.html, um die Änderungen zu testen.");
}

function clearPreview() {
  localStorage.removeItem("quickcheckConfigPreview");
  alert("Lokale Vorschau zurückgesetzt. Danach wird wieder config.json geladen.");
}

function bindImport() {
  document.getElementById("importFile").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      CONFIG = JSON.parse(text);
      renderAll();
    } catch (e) {
      alert("Import fehlgeschlagen: " + e.message);
    }
  });
}

function updateHeaderPlaceholders() {
  document.getElementById("adminLogoBox").innerText = CONFIG.meta.logoText || "Logo";
  document.getElementById("adminPartnerBox").innerText = CONFIG.meta.partnerText || "Partner";
}

function getValue(id) { return document.getElementById(id).value; }
function setValue(id, value) { document.getElementById(id).value = value ?? ""; }
function escapeAttr(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("\"", "&quot;"); }
function escapeHTML(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
