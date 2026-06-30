# Prompt Factory — Rendering Prompt Generator

A small, dependency-free webapp that turns an **unrendered Revit / CAD / SketchUp
view** into a crafted, copy-paste prompt for any AI image generator
(Gemini Pro Image, Imagen, DALL·E, Midjourney, FLUX, SDXL, …).

Pick a rendering style from dropdowns and the app assembles a prompt that
**preserves the source geometry** and re-renders it in the look you want, then
you copy the prompt and paste it alongside your exported image.

## Use it

No build step, no install. Just open the file:

```
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

…or serve the folder with any static server, e.g. `python3 -m http.server`.

### Workflow

1. Export your unrendered view (Revit, Rhino, SketchUp, etc.) as an image.
2. Pick a **Preset** — it sets the framing and every style dropdown at once —
   then tune **Style, Lighting, Material, Background, Entourage, Weather**,
   aspect ratio, quality, and any **Custom directions**.
3. Click **Copy prompt**.
4. Paste the prompt into your AI image tool and attach the exported image.

As you change dropdowns, the exact sentence(s) that changed briefly pulse in the
prompt so you can see what each control does. Picking a **Preset** opens a serif
menu and dims the rest of the page; once you tweak any dropdown away from that
preset's defaults, the heading shows a **(Customised)** flag.

Fragment wording follows architectural-render prompting best practice —
specific materials, named lighting, reflections and realism cues, human
activity, and photographic / editorial quality tags.

## Deploy to Vercel

This is a static site (no build step), so Vercel serves it as-is.

**Dashboard (recommended):** at [vercel.com/new](https://vercel.com/new), import
the `archiflux/PromptFactory` repo. Leave Framework Preset as **Other**, Build
Command empty, and Output Directory empty (root). Deploy. Every push then
redeploys automatically.

**CLI:** `npm i -g vercel`, then `vercel` (preview) or `vercel --prod` from the
repo root.

The included [`vercel.json`](vercel.json) enables clean URLs; no other config is
needed.

### Web Analytics

`index.html` already includes the Vercel Web Analytics script
(`/_vercel/insights/script.js`), which Vercel serves automatically for the
deployment — no npm package or build step is required for this static site. Just
enable it once in the Vercel dashboard: **Project → Analytics → Enable Web
Analytics**. Data appears after the next page views (it stays at 0 until the
script is live on the deployed site and someone visits).

## How it works

Every dropdown option in [`data.js`](data.js) carries a `fragment`: a complete
sentence. A **preset** bundles a framing instruction (`base`) with a full set of
field selections. The generator stitches the chosen fragments onto the framing
instruction (which locks the building's geometry) and appends your custom
directions. Each fragment is rendered as its own segment, which is how the app
highlights only the parts that change.

### Extending it

Add a new look by adding an option to the relevant field in `data.js`:

```js
lighting: {
  label: "Lighting",
  options: [
    { value: "neon", label: "Neon", fragment: "Use vivid neon accent lighting against a dark scene." },
    // …
  ],
}
```

Add a whole new preset to the `presets` array — give it a `base` framing string
(reuse one from `BASES`) and a `set` of field selections. No changes to `app.js`
are required.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Layout & panels |
| `styles.css` | Modern dark theme |
| `app.js` | Dropdown wiring + prompt assembly |
| `data.js` | The prompt library (all options & presets) |
