/*
 * app.js — wires the UI to RENDER_DATA and assembles the prompt live.
 */
(function () {
  "use strict";

  const D = RENDER_DATA;
  const $ = (sel) => document.querySelector(sel);

  // Order in which field fragments appear in the prompt.
  const FIELD_ORDER = ["style", "lighting", "material", "background", "entourage", "weather"];

  /* ---------- Build a <select> from a list of {value,label} ---------- */
  function fillSelect(select, options) {
    select.innerHTML = "";
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    }
  }

  /* ---------- Render the dropdown fields from RENDER_DATA.fields ---------- */
  function buildFields() {
    for (const key of Object.keys(D.fields)) {
      const field = D.fields[key];
      const host = document.getElementById("field-" + key);
      if (!host) continue;

      const label = document.createElement("label");
      label.className = "field-label";
      label.setAttribute("for", "sel-" + key);
      label.textContent = field.label;

      const select = document.createElement("select");
      select.id = "sel-" + key;
      select.dataset.field = key;
      fillSelect(select, field.options);

      host.appendChild(label);
      host.appendChild(select);
      select.addEventListener("change", render);
    }
  }

  /* ---------- Populate the static selects (model, template, output) ---------- */
  function buildStatic() {
    fillSelect($("#model"), D.models);

    const tmplSelect = $("#template");
    fillSelect(
      tmplSelect,
      Object.keys(D.templates).map((k) => ({ value: k, label: D.templates[k].label }))
    );

    fillSelect($("#aspect"), D.output.aspect);
    fillSelect($("#quality"), D.output.quality);

    $("#model").addEventListener("change", render);
    $("#aspect").addEventListener("change", render);
    $("#quality").addEventListener("change", render);
    $("#custom").addEventListener("input", render);
    tmplSelect.addEventListener("change", () => {
      applyTemplateDefaults(tmplSelect.value);
      render();
    });
  }

  /* ---------- Apply a preset's default selections ---------- */
  function applyTemplateDefaults(key) {
    const tmpl = D.templates[key];
    if (!tmpl || !tmpl.defaults) return;
    for (const field of Object.keys(tmpl.defaults)) {
      const sel = document.getElementById("sel-" + field);
      if (sel) sel.value = tmpl.defaults[field];
    }
  }

  /* ---------- Look up the fragment for a field's current value ---------- */
  function fragmentFor(fieldKey) {
    const sel = document.getElementById("sel-" + fieldKey);
    if (!sel) return "";
    const opt = D.fields[fieldKey].options.find((o) => o.value === sel.value);
    return opt && opt.fragment ? opt.fragment.trim() : "";
  }

  /* ---------- Assemble the full prompt ---------- */
  function buildPrompt() {
    const tmpl = D.templates[$("#template").value];
    const parts = [];

    // 1. Framing / base instruction.
    parts.push(tmpl.base.trim());

    // 2. Style fragments, in defined order.
    const styleSentences = [];
    // Theme leads the scene description.
    const themeFrag = fragmentFor("theme");
    if (themeFrag) styleSentences.push(themeFrag);
    for (const key of FIELD_ORDER) {
      const frag = fragmentFor(key);
      if (frag) styleSentences.push(frag);
    }

    // 3. Quality.
    const qualityOpt = D.output.quality.find((q) => q.value === $("#quality").value);
    if (qualityOpt && qualityOpt.fragment) styleSentences.push(qualityOpt.fragment);

    // 4. Aspect ratio.
    const aspectOpt = D.output.aspect.find((a) => a.value === $("#aspect").value);
    if (aspectOpt && aspectOpt.ratio) {
      styleSentences.push("Compose the image in a " + aspectOpt.ratio + " aspect ratio.");
    }

    let body = parts.join(" ") + " " + styleSentences.join(" ");

    // 5. Custom directions.
    const custom = $("#custom").value.trim();
    if (custom) {
      body += " Additional directions: " + custom + (/[.!?]$/.test(custom) ? "" : ".");
    }

    // 6. Model-specific tail.
    const model = $("#model").value;
    const hint = D.modelHints[model];
    if (hint) {
      const ar = aspectOpt && aspectOpt.ratio ? aspectOpt.ratio : "16:9";
      body += "\n\n" + hint.replace("{ar}", ar);
    }

    return body;
  }

  /* ---------- Render preview ---------- */
  function render() {
    const text = buildPrompt();
    $("#output").textContent = text;
    $("#charCount").textContent = text.length + " characters · " + text.split(/\s+/).filter(Boolean).length + " words";
    $("#copied").hidden = true;
  }

  /* ---------- Copy ---------- */
  async function copyPrompt() {
    const text = $("#output").textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Fallback for non-secure contexts / older browsers.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    const c = $("#copied");
    c.hidden = false;
    clearTimeout(copyPrompt._t);
    copyPrompt._t = setTimeout(() => (c.hidden = true), 2000);
  }

  /* ---------- Collapsible sections ---------- */
  function wireSections() {
    document.querySelectorAll("[data-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        const body = btn.nextElementSibling;
        body.classList.toggle("collapsed", expanded);
      });
    });
  }

  /* ---------- Reference image (local preview only) ---------- */
  function wireDropzone() {
    const dz = $("#dropzone");
    const input = $("#fileInput");
    const thumb = $("#thumb");
    const inner = $("#dzInner");

    function show(file) {
      if (!file || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      thumb.src = url;
      thumb.hidden = false;
      inner.hidden = true;
    }

    input.addEventListener("change", () => show(input.files[0]));
    ["dragenter", "dragover"].forEach((ev) =>
      dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("drag"); })
    );
    ["dragleave", "drop"].forEach((ev) =>
      dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("drag"); })
    );
    dz.addEventListener("drop", (e) => {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      show(file);
    });
  }

  /* ---------- Reset ---------- */
  function wireReset() {
    $("#resetBtn").addEventListener("click", () => {
      $("#template").value = Object.keys(D.templates)[0];
      applyTemplateDefaults($("#template").value);
      $("#custom").value = "";
      $("#aspect").value = D.output.aspect[0].value;
      $("#quality").value = D.output.quality[0].value;
      render();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    buildStatic();
    buildFields();
    wireSections();
    wireDropzone();
    wireReset();
    $("#copyBtn").addEventListener("click", copyPrompt);

    // Start on the default template.
    $("#template").value = Object.keys(D.templates)[0];
    applyTemplateDefaults($("#template").value);
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
