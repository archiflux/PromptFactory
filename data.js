/*
 * data.js — The prompt "library".
 *
 * Every dropdown option carries a `fragment`: a complete, natural-language
 * sentence that gets stitched into the final prompt. Editing these (or adding
 * new options) is how you grow the generator without touching app logic.
 */

const RENDER_DATA = {
  /*
   * Prompt Library presets. `base` is the framing instruction that protects the
   * source geometry. `defaults` pre-selects dropdowns so a preset feels complete
   * the moment you pick it.
   */
  templates: {
    "ReRender_Default.json": {
      label: "ReRender_Default.json",
      base:
        "You are an architectural rendering engine. I am providing an exported building view. " +
        "Preserve the exact geometry, spatial composition, camera angle, and perspective of this image. " +
        "Do not add, remove, or reposition any building elements. Do not change the proportions or layout of the structure. " +
        "Render the image with the following style instructions:",
      defaults: { theme: "urban-day", style: "photorealistic", lighting: "overcast", material: "brick-steel", background: "urban", entourage: "busy", weather: "as-is" },
    },
    "ExteriorHero.json": {
      label: "ExteriorHero.json",
      base:
        "You are an architectural rendering engine. I am providing an exported exterior view of a building. " +
        "Preserve the exact massing, facade articulation, camera angle, and perspective of this image. " +
        "Do not add, remove, or reposition any building elements, and do not alter the proportions of the structure. " +
        "Produce a polished hero exterior rendering using the following style instructions:",
      defaults: { theme: "urban-day", style: "photorealistic", lighting: "golden-hour", material: "glass-curtain", background: "urban", entourage: "moderate", weather: "clear" },
    },
    "InteriorSpace.json": {
      label: "InteriorSpace.json",
      base:
        "You are an architectural rendering engine. I am providing an exported interior view. " +
        "Preserve the exact room geometry, layout, ceiling height, camera angle, and perspective of this image. " +
        "Do not move walls, openings, or furniture, and do not change the proportions of the space. " +
        "Render a photorealistic interior using the following style instructions:",
      defaults: { theme: "interior", style: "photorealistic", lighting: "soft-diffused", material: "timber", background: "keep", entourage: "furnished", weather: "as-is" },
    },
    "ConceptMassing.json": {
      label: "ConceptMassing.json",
      base:
        "You are an architectural visualization engine. I am providing an exported massing/concept view. " +
        "Keep the overall form, footprint, height, camera angle, and perspective of this image intact. " +
        "You may refine surfaces and add context, but do not change the fundamental shape of the building. " +
        "Render an early-stage concept image using the following style instructions:",
      defaults: { theme: "urban-day", style: "arch-viz", lighting: "bright-midday", material: "white-model", background: "isolated", entourage: "quiet", weather: "clear" },
    },
    "AerialMasterplan.json": {
      label: "AerialMasterplan.json",
      base:
        "You are an architectural rendering engine. I am providing an exported aerial / site view. " +
        "Preserve the exact site layout, building positions, road network, camera angle, and bird's-eye perspective of this image. " +
        "Do not move or resize any buildings or site elements. " +
        "Render a contextual aerial visualization using the following style instructions:",
      defaults: { theme: "urban-day", style: "arch-viz", lighting: "bright-midday", material: "mixed-modern", background: "urban", entourage: "moderate", weather: "partly-cloudy" },
    },
    "FreeStyle.json": {
      label: "FreeStyle.json",
      base:
        "Render this exported architectural view as a high-quality image. " +
        "Keep the camera angle and overall composition, and apply the following style instructions:",
      defaults: { theme: "urban-day", style: "cinematic", lighting: "dramatic", material: "as-is-mat", background: "keep", entourage: "as-is-ent", weather: "as-is" },
    },
  },

  /*
   * Dropdown fields. Order here is the order they render and the order their
   * fragments appear in the prompt.
   */
  fields: {
    theme: {
      label: "Theme",
      full: true,
      options: [
        { value: "urban-day", label: "Urban day", fragment: "" },
        { value: "urban-night", label: "Urban night", fragment: "Set the scene at night in an illuminated urban environment with glowing windows and street lighting." },
        { value: "suburban", label: "Suburban", fragment: "Set the scene in a calm suburban neighborhood." },
        { value: "rural", label: "Rural / landscape", fragment: "Set the scene within an open rural landscape." },
        { value: "coastal", label: "Coastal", fragment: "Set the scene in a coastal waterfront environment." },
        { value: "interior", label: "Interior space", fragment: "Treat this as an interior scene with appropriate indoor ambiance." },
        { value: "aerial", label: "Aerial / masterplan", fragment: "Treat this as an aerial masterplan view showing the building in its wider site context." },
      ],
    },
    style: {
      label: "Style",
      options: [
        { value: "photorealistic", label: "Photorealistic", fragment: "Render as a photorealistic image with accurate materials, lighting, and reflections." },
        { value: "hyperreal", label: "Hyperrealistic", fragment: "Render as a hyperrealistic image with razor-sharp detail, physically accurate materials, and lifelike reflections." },
        { value: "arch-viz", label: "Architectural visualization", fragment: "Render as a clean, professional architectural visualization with crisp edges and balanced exposure." },
        { value: "cinematic", label: "Cinematic", fragment: "Render with a cinematic, film-still quality featuring dramatic depth of field and rich color grading." },
        { value: "watercolor", label: "Watercolor sketch", fragment: "Render as a loose architectural watercolor sketch with soft washes and visible paper texture." },
        { value: "line-sketch", label: "Pencil / line sketch", fragment: "Render as a hand-drawn pencil line sketch with light shading and a presentation-drawing feel." },
        { value: "diagram", label: "Conceptual diagram", fragment: "Render as a clean conceptual diagram with flat colors and simplified surfaces." },
        { value: "white-model", label: "Clay / white model", fragment: "Render as a monochrome white clay model with soft ambient occlusion and no applied materials." },
        { value: "minimalist", label: "Minimalist", fragment: "Render in a minimalist style with muted tones, clean surfaces, and uncluttered composition." },
      ],
    },
    lighting: {
      label: "Lighting",
      options: [
        { value: "overcast", label: "Overcast", fragment: "Use soft diffused overcast lighting with minimal shadows." },
        { value: "golden-hour", label: "Golden hour", fragment: "Use warm golden-hour sunlight with long soft shadows and a glowing horizon." },
        { value: "bright-midday", label: "Bright midday sun", fragment: "Use bright midday sunlight with clear, well-defined shadows." },
        { value: "blue-hour", label: "Blue hour / dusk", fragment: "Use cool blue-hour dusk lighting with a deep blue sky and warm interior glow." },
        { value: "night", label: "Night", fragment: "Use nighttime lighting with artificial illumination, lit windows, and street lights." },
        { value: "soft-diffused", label: "Soft diffused", fragment: "Use soft, evenly diffused lighting with gentle shadows." },
        { value: "dramatic", label: "Dramatic / studio", fragment: "Use dramatic high-contrast studio lighting with strong highlights and deep shadows." },
        { value: "sunrise", label: "Sunrise", fragment: "Use early sunrise lighting with soft pink and amber tones." },
        { value: "moody", label: "Moody", fragment: "Use moody, low-key lighting with atmospheric haze." },
      ],
    },
    material: {
      label: "Material",
      options: [
        { value: "brick-steel", label: "Brick and steel", fragment: "Apply red brick masonry with exposed steel structural elements." },
        { value: "glass-curtain", label: "Glass curtain wall", fragment: "Apply a glazed curtain-wall facade with reflective glass and slim mullions." },
        { value: "concrete", label: "Concrete / brutalist", fragment: "Apply board-formed exposed concrete with a brutalist character." },
        { value: "timber", label: "Timber / wood", fragment: "Apply warm timber cladding and natural wood finishes." },
        { value: "stone", label: "Natural stone", fragment: "Apply natural stone cladding with visible texture and variation." },
        { value: "mixed-modern", label: "Mixed modern", fragment: "Apply a mixed modern material palette of glass, metal panel, and stone." },
        { value: "white-render", label: "White render / stucco", fragment: "Apply smooth white rendered stucco walls." },
        { value: "metal-clad", label: "Metal cladding", fragment: "Apply standing-seam metal cladding with a matte finish." },
        { value: "as-is-mat", label: "Keep source materials", fragment: "Keep the materials implied by the source view, simply rendered realistically." },
      ],
    },
    background: {
      label: "Background",
      options: [
        { value: "urban", label: "Urban context", fragment: "Place the building in an urban streetscape with sidewalks, neighboring buildings, and street trees." },
        { value: "suburban", label: "Suburban neighborhood", fragment: "Place the building in a suburban neighborhood with low surrounding houses and landscaped yards." },
        { value: "park", label: "Park / greenery", fragment: "Place the building within a green park setting with lawns, mature trees, and pathways." },
        { value: "waterfront", label: "Waterfront", fragment: "Place the building on a waterfront with water, a promenade, and distant skyline." },
        { value: "mountains", label: "Mountains", fragment: "Place the building against a backdrop of mountains and natural terrain." },
        { value: "isolated", label: "Open sky / isolated", fragment: "Place the building against a clean, uncluttered open-sky background with no surrounding context." },
        { value: "desert", label: "Desert", fragment: "Place the building in an arid desert landscape with sparse vegetation." },
        { value: "forest", label: "Forest", fragment: "Place the building within a dense forest setting surrounded by tall trees." },
        { value: "keep", label: "Keep existing", fragment: "Keep the existing background and context from the source view." },
      ],
    },
    entourage: {
      label: "Entourage",
      options: [
        { value: "busy", label: "Busy and lively", fragment: "Populate the scene with pedestrians, small groups, and visible activity." },
        { value: "moderate", label: "Moderate activity", fragment: "Add a moderate amount of people and a few vehicles for a natural sense of scale." },
        { value: "quiet", label: "Quiet / empty", fragment: "Keep the scene quiet and largely unpopulated." },
        { value: "people", label: "People only", fragment: "Add scattered pedestrians for scale, but no vehicles." },
        { value: "vehicles", label: "Vehicles", fragment: "Add parked and moving vehicles appropriate to the setting." },
        { value: "furnished", label: "Furnished interior", fragment: "Furnish the interior with realistic furniture, decor, and a few occupants." },
        { value: "as-is-ent", label: "As is", fragment: "" },
      ],
    },
    weather: {
      label: "Weather",
      options: [
        { value: "as-is", label: "As is", fragment: "" },
        { value: "clear", label: "Clear sky", fragment: "Show a clear, bright sky." },
        { value: "partly-cloudy", label: "Partly cloudy", fragment: "Show a partly cloudy sky with scattered clouds." },
        { value: "overcast-w", label: "Overcast", fragment: "Show an overcast, grey sky." },
        { value: "rain", label: "Rain / wet", fragment: "Show wet, rainy conditions with reflective surfaces and puddles." },
        { value: "snow", label: "Snow", fragment: "Show a snowy scene with snow accumulation on surfaces." },
        { value: "fog", label: "Fog / mist", fragment: "Show a foggy, misty atmosphere with reduced background visibility." },
        { value: "dramatic-sky", label: "Dramatic clouds", fragment: "Show a dramatic sky with bold, expressive cloud formations." },
      ],
    },
  },

  /* Output settings — appended as a final constraints line. */
  output: {
    aspect: [
      { value: "keep", label: "Keep source", ratio: "" },
      { value: "16:9", label: "16:9 — Widescreen", ratio: "16:9" },
      { value: "3:2", label: "3:2 — Landscape", ratio: "3:2" },
      { value: "4:3", label: "4:3 — Standard", ratio: "4:3" },
      { value: "1:1", label: "1:1 — Square", ratio: "1:1" },
      { value: "9:16", label: "9:16 — Portrait", ratio: "9:16" },
    ],
    quality: [
      { value: "standard", label: "Standard", fragment: "" },
      { value: "high", label: "High detail", fragment: "Output at high resolution with fine detail." },
      { value: "ultra", label: "Ultra / 4K", fragment: "Output at ultra-high 4K resolution with maximum sharpness and fine detail." },
    ],
  },
};
