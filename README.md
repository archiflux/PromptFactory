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
prompt so you can see what each control does.

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
