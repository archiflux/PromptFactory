/*
 * app.js — wires the UI to RENDER_DATA, assembles the prompt as labelled
 * segments, and pulses the segments that change between renders.
 */
(function () {
  "use strict";

  const D = RENDER_DATA;
  const $ = (sel) => document.querySelector(sel);

  // Order in which field fragments appear in the prompt.
  const FIELD_ORDER = ["style", "lighting", "material", "background", "entourage", "weather"];

  // Snapshot of the last render, keyed by segment id, for change detection.
  let prevSegments = null;

  /* ---------- helpers ---------- */
  function fillSelect(select, options) {
    select.innerHTML = "";
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    }
  }

  function selVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  function fragmentFor(fieldKey) {
    const sel = document.getElementById("sel-" + fieldKey);
    if (!sel) return "";
    const opt = D.fields[fieldKey].options.find((o) => o.value === sel.value);
    return opt && opt.fragment ? opt.fragment.trim() : "";
  }

  /* ---------- build the field dropdowns ---------- */
  function buildFields() {
    for (const key of Object.keys(D.fields)) {
      const field = D.fields[key];
      const host = document.getElementById("field-" + key);
      if (!host) continue;

      const label = document.createElement("label");
      label.className = "lbl";
      label.setAttribute("for", "sel-" + key);
      label.textContent = field.label;

      const select = document.createElement("select");
      select.id = "sel-" + key;
      fillSelect(select, field.options);

      host.appendChild(label);
      host.appendChild(select);
      select.addEventListener("change", render);
    }
  }

  /* ---------- static selects ---------- */
  function buildStatic() {
    fillSelect($("#preset"), D.presets);
    fillSelect($("#aspect"), D.output.aspect);
    fillSelect($("#quality"), D.output.quality);

    $("#aspect").addEventListener("change", render);
    $("#quality").addEventListener("change", render);
    $("#custom").addEventListener("input", render);
    $("#preset").addEventListener("change", () => {
      applyPreset($("#preset").value);
      render();
    });
  }

  function currentPreset() {
    return D.presets.find((p) => p.value === selVal("preset")) || D.presets[0];
  }

  function applyPreset(value) {
    const preset = D.presets.find((p) => p.value === value);
    if (!preset) return;
    for (const field of Object.keys(preset.set)) {
      const sel = document.getElementById("sel-" + field);
      if (sel) sel.value = preset.set[field];
    }
  }

  /* ---------- assemble the prompt as labelled segments ---------- */
  function buildSegments() {
    const segs = [];
    const preset = currentPreset();

    segs.push({ id: "base", text: preset.base.trim() });

    for (const key of FIELD_ORDER) {
      const frag = fragmentFor(key);
      if (frag) segs.push({ id: key, text: frag });
    }

    const qualityOpt = D.output.quality.find((q) => q.value === selVal("quality"));
    if (qualityOpt && qualityOpt.fragment) segs.push({ id: "quality", text: qualityOpt.fragment });

    const aspectOpt = D.output.aspect.find((a) => a.value === selVal("aspect"));
    if (aspectOpt && aspectOpt.ratio) {
      segs.push({ id: "aspect", text: "Compose the image in a " + aspectOpt.ratio + " aspect ratio." });
    }

    const custom = $("#custom").value.trim();
    if (custom) {
      segs.push({ id: "custom", text: "Additional directions: " + custom + (/[.!?]$/.test(custom) ? "" : ".") });
    }

    return segs;
  }

  /* ---------- render + pulse changed segments ---------- */
  function render() {
    const segs = buildSegments();
    const out = $("#output");
    out.innerHTML = "";

    segs.forEach((seg, i) => {
      const span = document.createElement("span");
      span.className = "seg";
      span.dataset.id = seg.id;
      span.textContent = seg.text;

      // Pulse if this segment is new or its text changed (skip first paint).
      if (prevSegments && prevSegments.get(seg.id) !== seg.text) {
        span.classList.add("pulse");
      }
      out.appendChild(span);
      if (i < segs.length - 1) out.appendChild(document.createTextNode(" "));
    });

    // Update snapshot.
    prevSegments = new Map(segs.map((s) => [s.id, s.text]));

    const full = segs.map((s) => s.text).join(" ");
    $("#charCount").textContent =
      full.length + " characters · " + full.split(/\s+/).filter(Boolean).length + " words";
    $("#copied").hidden = true;
  }

  /* ---------- copy ---------- */
  async function copyPrompt() {
    const text = $("#output").textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
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

  /* ---------- reset ---------- */
  function wireReset() {
    $("#resetBtn").addEventListener("click", () => {
      $("#preset").value = D.presets[0].value;
      applyPreset(D.presets[0].value);
      $("#custom").value = "";
      $("#aspect").value = D.output.aspect[0].value;
      $("#quality").value = D.output.quality[0].value;
      render();
    });
  }

  /* ---------- init ---------- */
  function init() {
    buildStatic();
    buildFields();
    wireReset();
    $("#copyBtn").addEventListener("click", copyPrompt);

    $("#preset").value = D.presets[0].value;
    applyPreset(D.presets[0].value);
    render(); // first paint: no pulses
  }

  document.addEventListener("DOMContentLoaded", init);
})();
