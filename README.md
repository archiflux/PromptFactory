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
2. Pick a **Prompt Library** preset, then tune **Style, Lighting, Material,
   Background, Entourage, Weather**, and add any **Custom Directions**.
3. Set **Output Settings** (aspect ratio, quality).
4. Click **Copy**.
5. Paste the prompt into your AI image tool and attach the exported image.

## How it works

Every dropdown option in [`data.js`](data.js) carries a `fragment`: a complete
sentence. The generator stitches the chosen fragments onto a framing instruction
(from the selected preset) that locks the building's geometry, then appends your
custom directions and any model-specific tail.

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

Add a whole new preset under `templates` with its own `base` framing text and
`defaults`. No changes to `app.js` are required.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Layout & panels |
| `styles.css` | Modern dark theme |
| `app.js` | Dropdown wiring + prompt assembly |
| `data.js` | The prompt library (all options & presets) |
