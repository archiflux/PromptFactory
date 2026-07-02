/*
 * app.js — wires the UI to RENDER_DATA, assembles the prompt as labelled
 * segments, pulses segments that change, and drives the custom preset dropdown.
 */
(function () {
  "use strict";

  const D = RENDER_DATA;
  const $ = (sel) => document.querySelector(sel);

  // Fields the prompt is built from, in order. These six are also what a
  // preset configures, so they drive the "(Customised)" indicator.
  const FIELD_ORDER = ["style", "lighting", "material", "interior", "background", "entourage", "weather"];

  const state = { preset: D.presets[0].value };
  let prevSegments = null; // snapshot of last render for change detection

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
  const selVal = (id) => (document.getElementById(id) || {}).value || "";

  // When `artistic`, prefer an option's abstract/expressionist `art` wording so
  // no fragment tells a hand-crafted image to look "realistic".
  function fragmentFor(fieldKey, artistic) {
    const sel = document.getElementById("sel-" + fieldKey);
    if (!sel) return "";
    const opt = D.fields[fieldKey].options.find((o) => o.value === sel.value);
    if (!opt) return "";
    const frag = artistic && opt.art ? opt.art : opt.fragment;
    return frag ? frag.trim() : "";
  }
  const currentPreset = () => D.presets.find((p) => p.value === state.preset) || D.presets[0];

  /* ---------- build field dropdowns ---------- */
  function buildFields() {
    for (const key of Object.keys(D.fields)) {
      const host = document.getElementById("field-" + key);
      if (!host) continue;
      const label = document.createElement("label");
      label.className = "lbl";
      label.setAttribute("for", "sel-" + key);
      label.textContent = D.fields[key].label;
      const select = document.createElement("select");
      select.id = "sel-" + key;
      fillSelect(select, D.fields[key].options);
      host.append(label, select);
      select.addEventListener("change", () => render(true));
    }
  }

  /* ---------- static selects ---------- */
  function buildStatic() {
    fillSelect($("#aspect"), D.output.aspect);
    fillSelect($("#quality"), D.output.quality);
    $("#aspect").addEventListener("change", () => render(true));
    $("#quality").addEventListener("change", () => render(true));
    // Typing custom directions updates the prompt WITHOUT pulsing, so the
    // animation is never interrupted/restarted on each keystroke (incl. space).
    $("#custom").addEventListener("input", () => render(false));
  }

  /* ---------- custom preset dropdown ---------- */
  function buildPresetMenu() {
    const pop = $("#presetPop");
    pop.innerHTML = "";
    D.presets.forEach((p) => {
      const li = document.createElement("li");
      li.className = "preset-item" + (p.value === state.preset ? " sel" : "");
      li.setAttribute("role", "option");
      li.dataset.value = p.value;
      li.setAttribute("aria-selected", p.value === state.preset ? "true" : "false");
      li.textContent = p.label;
      li.addEventListener("click", () => {
        selectPreset(p.value);
        closePreset();
        $("#presetBtn").focus();
      });
      pop.appendChild(li);
    });
  }

  function openPreset() {
    buildPresetMenu();
    $("#presetPop").hidden = false;
    $("#presetRow").classList.add("open");
    $("#presetBtn").setAttribute("aria-expanded", "true");
    $("#scrim").classList.add("show");
    // bring the selected item into view
    const sel = $("#presetPop .sel");
    if (sel) sel.scrollIntoView({ block: "nearest" });
  }
  function closePreset() {
    $("#presetPop").hidden = true;
    $("#presetRow").classList.remove("open");
    $("#presetBtn").setAttribute("aria-expanded", "false");
    $("#scrim").classList.remove("show");
  }
  const presetOpen = () => !$("#presetPop").hidden;

  function selectPreset(value) {
    state.preset = value;
    const preset = currentPreset();
    for (const field of Object.keys(preset.set)) {
      const sel = document.getElementById("sel-" + field);
      if (sel) sel.value = preset.set[field];
    }
    render(true);
  }

  function wirePreset() {
    $("#presetBtn").addEventListener("click", () => (presetOpen() ? closePreset() : openPreset()));
    $("#scrim").addEventListener("click", closePreset);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && presetOpen()) { closePreset(); $("#presetBtn").focus(); }
    });
    document.addEventListener("click", (e) => {
      if (presetOpen() && !$("#presetRow").contains(e.target)) closePreset();
    });
  }

  /* Is any field different from the active preset's defaults? */
  function isCustomised() {
    const set = currentPreset().set;
    return FIELD_ORDER.some((k) => selVal("sel-" + k) !== set[k]);
  }

  function updatePresetButton() {
    const text = $("#presetText");
    text.textContent = currentPreset().label;
    if (isCustomised()) {
      const tag = document.createElement("span");
      tag.className = "preset-tag";
      tag.textContent = "(Customised)";
      text.appendChild(tag);
    }
  }

  /* ---------- assemble the prompt as labelled segments ---------- */
  function buildSegments() {
    const segs = [{ id: "base", text: currentPreset().base.trim() }];

    // Render directive by style category: flat hand-crafted art, photo-based
    // atmospheric, or photographic. `flatArt` also drives skipping lighting and
    // using the abstract `art` fragment variants.
    const styleVal = selVal("sel-style");
    const flatArt = FLAT_ART_STYLES.indexOf(styleVal) !== -1;
    const atmo = ATMO_STYLES.indexOf(styleVal) !== -1;
    segs.push({ id: "directive", text: flatArt ? DIRECTIVES.artistic : atmo ? DIRECTIVES.atmospheric : DIRECTIVES.photoreal });

    for (const key of FIELD_ORDER) {
      // Artistic styles interpret light through the medium — skip the realistic
      // lighting instruction so it doesn't push photographic lighting.
      if (flatArt && key === "lighting") continue;
      const frag = fragmentFor(key, flatArt);
      if (frag) segs.push({ id: key, text: frag });
    }

    const q = D.output.quality.find((o) => o.value === selVal("quality"));
    if (q) {
      const qFrag = flatArt && q.art ? q.art : q.fragment;
      if (qFrag) segs.push({ id: "quality", text: qFrag });
    }

    const a = D.output.aspect.find((o) => o.value === selVal("aspect"));
    if (a && a.ratio) segs.push({ id: "aspect", text: "Compose the image in a " + a.ratio + " aspect ratio." });

    const custom = $("#custom").value.trim();
    if (custom) segs.push({ id: "custom", text: "Additional directions: " + custom + (/[.!?]$/.test(custom) ? "" : ".") });

    return segs;
  }

  /* ---------- render (+ optionally pulse changed segments) ---------- */
  function render(allowPulse) {
    const segs = buildSegments();
    const out = $("#output");
    out.innerHTML = "";

    segs.forEach((seg, i) => {
      const span = document.createElement("span");
      span.className = "seg";
      span.dataset.id = seg.id;
      span.textContent = seg.text;
      if (allowPulse && prevSegments && prevSegments.get(seg.id) !== seg.text) {
        span.classList.add("pulse");
      }
      out.appendChild(span);
      if (i < segs.length - 1) out.appendChild(document.createTextNode(" "));
    });

    prevSegments = new Map(segs.map((s) => [s.id, s.text]));

    const full = segs.map((s) => s.text).join(" ");
    $("#charCount").textContent =
      full.length + " characters · " + full.split(/\s+/).filter(Boolean).length + " words";
    $("#copied").hidden = true;
    updatePresetButton();
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
      $("#custom").value = "";
      $("#aspect").value = D.output.aspect[0].value;
      $("#quality").value = D.output.quality[0].value;
      selectPreset(D.presets[0].value);
    });
  }

  /* ---------- init ---------- */
  function init() {
    buildStatic();
    buildFields();
    wirePreset();
    wireReset();
    $("#copyBtn").addEventListener("click", copyPrompt);

    selectPreset(D.presets[0].value); // sets fields + first render (no prev → no pulse)
  }

  document.addEventListener("DOMContentLoaded", init);
})();
