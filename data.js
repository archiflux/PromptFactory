/*
 * data.js — the prompt "library".
 *
 * Each dropdown option carries a `fragment`: a complete sentence stitched into
 * the final prompt. A `preset` bundles a framing instruction (`base`) with a
 * full set of field selections, so one pick configures the whole look.
 */

/* Framing instructions — these protect the source geometry. */
const BASES = {
  exterior:
    "You are an architectural rendering engine. I am providing an exported building view. " +
    "Preserve the exact geometry, spatial composition, camera angle, and perspective of this image. " +
    "Do not add, remove, or reposition any building elements. Do not change the proportions or layout of the structure. " +
    "Render the image with the following style instructions:",
  hero:
    "You are an architectural rendering engine. I am providing an exported exterior view of a building. " +
    "Preserve the exact massing, facade articulation, camera angle, and perspective of this image. " +
    "Do not add, remove, or reposition any building elements, and do not alter the proportions of the structure. " +
    "Produce a polished hero exterior rendering using the following style instructions:",
  interior:
    "You are an architectural rendering engine. I am providing an exported interior view. " +
    "Preserve the exact room geometry, layout, ceiling height, camera angle, and perspective of this image. " +
    "Do not move walls, openings, or furniture, and do not change the proportions of the space. " +
    "Render a photorealistic interior using the following style instructions:",
  concept:
    "You are an architectural visualization engine. I am providing an exported massing/concept view. " +
    "Keep the overall form, footprint, height, camera angle, and perspective of this image intact. " +
    "You may refine surfaces and add context, but do not change the fundamental shape of the building. " +
    "Render an early-stage concept image using the following style instructions:",
  aerial:
    "You are an architectural rendering engine. I am providing an exported aerial / site view. " +
    "Preserve the exact site layout, building positions, road network, camera angle, and bird's-eye perspective of this image. " +
    "Do not move or resize any buildings or site elements. " +
    "Render a contextual aerial visualization using the following style instructions:",
  free:
    "Render this exported architectural view as a high-quality image. " +
    "Keep the camera angle and overall composition, and apply the following style instructions:",
};

const RENDER_DATA = {
  /*
   * Combined preset dropdown (formerly "Prompt Library" + "Theme").
   * `set` pre-selects every field so a preset feels complete instantly.
   */
  presets: [
    { value: "urban-day", label: "Urban Day — Street Level", base: BASES.exterior,
      set: { style: "photorealistic", lighting: "overcast", material: "brick-steel", background: "urban", entourage: "busy", weather: "as-is" } },
    { value: "golden-hero", label: "Golden Hour Hero", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "glass-curtain", background: "urban", entourage: "moderate", weather: "clear" } },
    { value: "urban-night", label: "Urban Night", base: BASES.hero,
      set: { style: "cinematic", lighting: "night", material: "glass-curtain", background: "rooftop-skyline", entourage: "nightlife", weather: "clear" } },
    { value: "blue-hour", label: "Blue Hour Dusk", base: BASES.hero,
      set: { style: "photorealistic", lighting: "blue-hour", material: "glass-curtain", background: "urban", entourage: "moderate", weather: "partly-cloudy" } },
    { value: "interior-day", label: "Interior — Daylight", base: BASES.interior,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "timber", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "interior-evening", label: "Interior — Evening", base: BASES.interior,
      set: { style: "cinematic", lighting: "warm-interior", material: "timber", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "concept-massing", label: "Concept Massing", base: BASES.concept,
      set: { style: "white-model", lighting: "bright-midday", material: "white-render", background: "isolated", entourage: "quiet", weather: "clear" } },
    { value: "aerial-masterplan", label: "Aerial Masterplan", base: BASES.aerial,
      set: { style: "arch-viz", lighting: "bright-midday", material: "mixed-modern", background: "urban", entourage: "moderate", weather: "partly-cloudy" } },
    { value: "suburban-day", label: "Suburban Daylight", base: BASES.exterior,
      set: { style: "photorealistic", lighting: "bright-midday", material: "white-render", background: "suburban", entourage: "families", weather: "clear" } },
    { value: "waterfront-dusk", label: "Waterfront Dusk", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "glass-curtain", background: "waterfront", entourage: "moderate", weather: "dramatic-sky" } },
    { value: "forest-retreat", label: "Forest Retreat", base: BASES.hero,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "timber", background: "forest", entourage: "quiet", weather: "partly-cloudy" } },
    { value: "desert-modern", label: "Desert Modern", base: BASES.hero,
      set: { style: "photorealistic", lighting: "harsh-noon", material: "concrete", background: "desert", entourage: "quiet", weather: "clear" } },
    { value: "mountain-lodge", label: "Mountain Lodge", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "stone", background: "mountains", entourage: "moderate", weather: "clear" } },
    { value: "rainy-moody", label: "Rainy & Moody", base: BASES.hero,
      set: { style: "cinematic", lighting: "moody", material: "concrete", background: "urban", entourage: "quiet", weather: "rain" } },
    { value: "snowy-scene", label: "Snowy Scene", base: BASES.hero,
      set: { style: "photorealistic", lighting: "overcast", material: "stone", background: "snowfield", entourage: "quiet", weather: "snow" } },
    { value: "cinematic-night", label: "Cinematic Night", base: BASES.hero,
      set: { style: "cinematic", lighting: "neon", material: "dark-brick", background: "urban", entourage: "nightlife", weather: "fog" } },
    { value: "watercolor", label: "Watercolor Presentation", base: BASES.free,
      set: { style: "watercolor", lighting: "soft-diffused", material: "as-is-mat", background: "park", entourage: "people", weather: "partly-cloudy" } },
    { value: "pencil-sketch", label: "Pencil Line Sketch", base: BASES.free,
      set: { style: "line-sketch", lighting: "soft-diffused", material: "as-is-mat", background: "isolated", entourage: "people", weather: "as-is" } },
    { value: "blueprint", label: "Blueprint Concept", base: BASES.free,
      set: { style: "blueprint", lighting: "soft-diffused", material: "as-is-mat", background: "isolated", entourage: "quiet", weather: "as-is" } },
    { value: "free-style", label: "Free Style (minimal)", base: BASES.free,
      set: { style: "cinematic", lighting: "dramatic", material: "as-is-mat", background: "keep", entourage: "as-is-ent", weather: "as-is" } },
  ],

  /* Dropdown fields, in the order their fragments appear in the prompt. */
  fields: {
    style: {
      label: "Style",
      options: [
        { value: "photorealistic", label: "Photorealistic", fragment: "Render as a photorealistic image with accurate materials, lighting, and reflections." },
        { value: "hyperreal", label: "Hyperrealistic", fragment: "Render as a hyperrealistic image with razor-sharp detail, physically accurate materials, and lifelike reflections." },
        { value: "arch-viz", label: "Architectural visualization", fragment: "Render as a clean, professional architectural visualization with crisp edges and balanced exposure." },
        { value: "cinematic", label: "Cinematic", fragment: "Render with a cinematic, film-still quality featuring dramatic depth of field and rich color grading." },
        { value: "vintage-film", label: "Vintage film", fragment: "Render with a vintage film look, warm grain, and gently faded tones." },
        { value: "watercolor", label: "Watercolor sketch", fragment: "Render as a loose architectural watercolor sketch with soft washes and visible paper texture." },
        { value: "line-sketch", label: "Pencil / line sketch", fragment: "Render as a hand-drawn pencil line sketch with light shading and a presentation-drawing feel." },
        { value: "ink-marker", label: "Ink & marker", fragment: "Render as an ink-and-marker presentation sketch with confident outlines and marker shading." },
        { value: "blueprint", label: "Blueprint", fragment: "Render as a blue-toned architectural blueprint with crisp white line work." },
        { value: "diagram", label: "Conceptual diagram", fragment: "Render as a clean conceptual diagram with flat colors and simplified surfaces." },
        { value: "isometric", label: "Isometric illustration", fragment: "Render as a clean isometric illustration with flat, even lighting." },
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
        { value: "harsh-noon", label: "Harsh noon", fragment: "Use harsh overhead noon sunlight with short, hard-edged shadows." },
        { value: "blue-hour", label: "Blue hour / dusk", fragment: "Use cool blue-hour dusk lighting with a deep blue sky and warm interior glow." },
        { value: "twilight", label: "Twilight", fragment: "Use soft twilight lighting just after sunset, with gentle gradients in the sky." },
        { value: "night", label: "Night", fragment: "Use nighttime lighting with artificial illumination, lit windows, and street lights." },
        { value: "neon", label: "Neon", fragment: "Use vivid neon accent lighting against a dark scene." },
        { value: "warm-interior", label: "Warm interior", fragment: "Use warm interior lighting with glowing lamps and a cosy ambiance." },
        { value: "soft-diffused", label: "Soft diffused", fragment: "Use soft, evenly diffused lighting with gentle shadows." },
        { value: "studio", label: "Studio softbox", fragment: "Use clean studio softbox lighting with smooth, even falloff." },
        { value: "dramatic", label: "Dramatic / high-contrast", fragment: "Use dramatic high-contrast lighting with strong highlights and deep shadows." },
        { value: "backlit", label: "Backlit", fragment: "Backlight the building so the light source sits behind it for a glowing silhouette." },
        { value: "sunrise", label: "Sunrise", fragment: "Use early sunrise lighting with soft pink and amber tones." },
        { value: "moody", label: "Moody", fragment: "Use moody, low-key lighting with atmospheric haze." },
      ],
    },
    material: {
      label: "Material",
      options: [
        { value: "brick-steel", label: "Brick and steel", fragment: "Apply red brick masonry with exposed steel structural elements." },
        { value: "dark-brick", label: "Dark brick", fragment: "Apply dark charcoal brickwork with deep mortar joints." },
        { value: "glass-curtain", label: "Glass curtain wall", fragment: "Apply a glazed curtain-wall facade with reflective glass and slim mullions." },
        { value: "concrete", label: "Concrete / brutalist", fragment: "Apply board-formed exposed concrete with a brutalist character." },
        { value: "timber", label: "Timber / wood", fragment: "Apply warm timber cladding and natural wood finishes." },
        { value: "stone", label: "Natural stone", fragment: "Apply natural stone cladding with visible texture and variation." },
        { value: "marble", label: "Marble", fragment: "Apply polished marble surfaces with subtle veining." },
        { value: "corten", label: "Corten / weathering steel", fragment: "Apply weathering Corten steel with a rich rust-orange patina." },
        { value: "terracotta", label: "Terracotta", fragment: "Apply terracotta and warm clay-toned cladding." },
        { value: "metal-clad", label: "Metal cladding", fragment: "Apply standing-seam metal cladding with a matte finish." },
        { value: "mixed-modern", label: "Mixed modern", fragment: "Apply a mixed modern material palette of glass, metal panel, and stone." },
        { value: "white-render", label: "White render / stucco", fragment: "Apply smooth white rendered stucco walls." },
        { value: "polished-plaster", label: "Polished plaster", fragment: "Apply smooth polished plaster surfaces." },
        { value: "as-is-mat", label: "Keep source materials", fragment: "Keep the materials implied by the source view, simply rendered realistically." },
      ],
    },
    background: {
      label: "Background",
      options: [
        { value: "urban", label: "Urban context", fragment: "Place the building in an urban streetscape with sidewalks, neighboring buildings, and street trees." },
        { value: "rooftop-skyline", label: "Rooftop skyline", fragment: "Place the building among a rooftop skyline with a city panorama behind it." },
        { value: "plaza", label: "Public plaza", fragment: "Place the building facing an open public plaza with paving and seating." },
        { value: "courtyard", label: "Courtyard", fragment: "Arrange the building around a landscaped internal courtyard." },
        { value: "suburban", label: "Suburban neighborhood", fragment: "Place the building in a suburban neighborhood with low surrounding houses and landscaped yards." },
        { value: "park", label: "Park / greenery", fragment: "Place the building within a green park setting with lawns, mature trees, and pathways." },
        { value: "waterfront", label: "Waterfront", fragment: "Place the building on a waterfront with water, a promenade, and distant skyline." },
        { value: "mountains", label: "Mountains", fragment: "Place the building against a backdrop of mountains and natural terrain." },
        { value: "countryside", label: "Countryside", fragment: "Place the building in rolling countryside with fields and hedgerows." },
        { value: "desert", label: "Desert", fragment: "Place the building in an arid desert landscape with sparse vegetation." },
        { value: "forest", label: "Forest", fragment: "Place the building within a dense forest setting surrounded by tall trees." },
        { value: "snowfield", label: "Snowfield", fragment: "Place the building in an open, snow-covered landscape." },
        { value: "isolated", label: "Open sky / isolated", fragment: "Place the building against a clean, uncluttered open-sky background with no surrounding context." },
        { value: "keep", label: "Keep existing", fragment: "Keep the existing background and context from the source view." },
      ],
    },
    entourage: {
      label: "Entourage",
      options: [
        { value: "busy", label: "Busy and lively", fragment: "Populate the scene with pedestrians, small groups, and visible activity." },
        { value: "moderate", label: "Moderate activity", fragment: "Add a moderate amount of people and a few vehicles for a natural sense of scale." },
        { value: "families", label: "Families", fragment: "Add families and children for a friendly, residential feel." },
        { value: "cyclists", label: "Cyclists", fragment: "Add cyclists and pedestrians for an active streetscape." },
        { value: "market-stalls", label: "Market stalls", fragment: "Add market stalls and street vendors for a vibrant atmosphere." },
        { value: "nightlife", label: "Nightlife", fragment: "Populate the scene with evening nightlife — lit signage and people out at night." },
        { value: "people", label: "People only", fragment: "Add scattered pedestrians for scale, but no vehicles." },
        { value: "vehicles", label: "Vehicles", fragment: "Add parked and moving vehicles appropriate to the setting." },
        { value: "furnished", label: "Furnished interior", fragment: "Furnish the interior with realistic furniture, decor, and a few occupants." },
        { value: "quiet", label: "Quiet / empty", fragment: "Keep the scene quiet and largely unpopulated." },
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
        { value: "dramatic-sky", label: "Dramatic clouds", fragment: "Show a dramatic sky with bold, expressive cloud formations." },
        { value: "golden-haze", label: "Golden haze", fragment: "Show a warm golden atmospheric haze." },
        { value: "rain", label: "Rain / wet", fragment: "Show wet, rainy conditions with reflective surfaces and puddles." },
        { value: "storm", label: "Storm", fragment: "Show stormy conditions with heavy dark clouds and dramatic light." },
        { value: "snow", label: "Snow", fragment: "Show a snowy scene with snow accumulation on surfaces." },
        { value: "fog", label: "Fog / mist", fragment: "Show a foggy, misty atmosphere with reduced background visibility." },
      ],
    },
  },

  /* Output settings — appended as final lines. */
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
