/*
 * data.js — the prompt "library".
 *
 * Each dropdown option carries a `fragment`: a complete, descriptive sentence
 * stitched into the final prompt. A `preset` bundles a framing instruction
 * (`base`) with a full set of field selections, so one pick configures the look.
 *
 * Fragment wording follows architectural-render prompting best practice:
 * specific materials, named lighting, reflections + realism cues, human
 * activity, and photographic / editorial quality tags.
 */

/* Framing instructions — these protect the source geometry. */
const BASES = {
  exterior:
    "You are an architectural rendering engine. I am providing an exported building view. " +
    "Preserve the exact geometry, spatial composition, camera angle, and perspective of this image. " +
    "Do not add, remove, or reposition any building elements. Do not change the proportions or layout of the structure. " +
    "Render the image at the quality of professional architectural photography, with the following style instructions:",
  hero:
    "You are an architectural rendering engine. I am providing an exported exterior view of a building. " +
    "Preserve the exact massing, facade articulation, camera angle, and perspective of this image. " +
    "Do not add, remove, or reposition any building elements, and do not alter the proportions of the structure. " +
    "Produce a polished, magazine-quality hero exterior rendering using the following style instructions:",
  interior:
    "You are an architectural rendering engine. I am providing an exported interior view. " +
    "Preserve the exact room geometry, layout, ceiling height, camera angle, and perspective of this image. " +
    "Do not move walls, openings, or furniture, and do not change the proportions of the space. " +
    "Render a photorealistic, professionally lit interior using the following style instructions:",
  concept:
    "You are an architectural visualization engine. I am providing an exported massing/concept view. " +
    "Keep the overall form, footprint, height, camera angle, and perspective of this image intact. " +
    "You may refine surfaces and add context, but do not change the fundamental shape of the building. " +
    "Render a clean, early-stage concept image using the following style instructions:",
  aerial:
    "You are an architectural rendering engine. I am providing an exported aerial / site view. " +
    "Preserve the exact site layout, building positions, road network, camera angle, and bird's-eye perspective of this image. " +
    "Do not move or resize any buildings or site elements. " +
    "Render a contextual, high-fidelity aerial visualization using the following style instructions:",
  free:
    "Render this exported architectural view as a high-quality, professional image. " +
    "Keep the camera angle and overall composition, and apply the following style instructions:",
};

const RENDER_DATA = {
  /*
   * Combined preset dropdown. `set` pre-selects every field so a preset feels
   * complete instantly. The six keys in `set` are also what the UI compares
   * against to show the "(Customised)" flag.
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
    { value: "editorial-hero", label: "Editorial Magazine", base: BASES.hero,
      set: { style: "editorial", lighting: "soft-diffused", material: "mixed-modern", background: "isolated", entourage: "people", weather: "partly-cloudy" } },
    { value: "concept-massing", label: "Concept Massing", base: BASES.concept,
      set: { style: "white-model", lighting: "bright-midday", material: "white-render", background: "isolated", entourage: "quiet", weather: "clear" } },
    { value: "scale-model", label: "Tilt-Shift Scale Model", base: BASES.concept,
      set: { style: "scale-model", lighting: "studio", material: "mixed-modern", background: "isolated", entourage: "people", weather: "as-is" } },
    { value: "aerial-masterplan", label: "Aerial Masterplan", base: BASES.aerial,
      set: { style: "arch-viz", lighting: "bright-midday", material: "mixed-modern", background: "urban", entourage: "moderate", weather: "partly-cloudy" } },
    { value: "suburban-day", label: "Suburban Daylight", base: BASES.exterior,
      set: { style: "photorealistic", lighting: "bright-midday", material: "white-render", background: "suburban", entourage: "families", weather: "clear" } },
    { value: "waterfront-dusk", label: "Waterfront Dusk", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "glass-curtain", background: "waterfront", entourage: "moderate", weather: "dramatic-sky" } },
    { value: "forest-retreat", label: "Forest Retreat", base: BASES.hero,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "blackened-timber", background: "forest", entourage: "quiet", weather: "partly-cloudy" } },
    { value: "desert-modern", label: "Desert Modern", base: BASES.hero,
      set: { style: "photorealistic", lighting: "harsh-noon", material: "rammed-earth", background: "desert", entourage: "quiet", weather: "clear" } },
    { value: "mountain-lodge", label: "Mountain Lodge", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "stone", background: "mountains", entourage: "moderate", weather: "clear" } },
    { value: "zen-pavilion", label: "Zen Garden Pavilion", base: BASES.hero,
      set: { style: "minimalist", lighting: "soft-diffused", material: "timber", background: "japanese-garden", entourage: "quiet", weather: "mist-morning" } },
    { value: "rainy-moody", label: "Rainy & Moody", base: BASES.hero,
      set: { style: "cinematic", lighting: "moody", material: "concrete", background: "urban", entourage: "quiet", weather: "rain" } },
    { value: "snowy-scene", label: "Snowy Scene", base: BASES.hero,
      set: { style: "photorealistic", lighting: "overcast", material: "stone", background: "snowfield", entourage: "quiet", weather: "snow" } },
    { value: "cinematic-night", label: "Cinematic Neon Night", base: BASES.hero,
      set: { style: "cinematic", lighting: "neon", material: "dark-brick", background: "urban", entourage: "nightlife", weather: "rain" } },
    { value: "monochrome", label: "Black & White Fine Art", base: BASES.hero,
      set: { style: "monochrome", lighting: "dramatic", material: "concrete", background: "isolated", entourage: "people", weather: "dramatic-sky" } },
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
        { value: "photorealistic", label: "Photorealistic", fragment: "Render as a photorealistic, professional architectural photograph: physically based materials, true-to-life reflections and refractions, soft ambient occlusion, accurate global illumination, and a natural, filmic depth of field." },
        { value: "hyperreal", label: "Hyperrealistic", fragment: "Render in hyperrealistic ultra-high detail with crisp micro-textures, true-to-life material response, pin-sharp reflections, and immaculate clarity across the frame, in the style of award-winning architectural visualization." },
        { value: "arch-viz", label: "Architectural visualization", fragment: "Render as a clean, professional architectural visualization with crisp edges, balanced exposure, neutral white balance, and a polished CGI finish suitable for a client presentation." },
        { value: "cinematic", label: "Cinematic", fragment: "Render with a cinematic, film-still quality: dramatic depth of field, rich filmic colour grading, gentle lens bloom, and a strong, evocative sense of mood and atmosphere." },
        { value: "editorial", label: "Editorial magazine", fragment: "Render as a polished editorial architectural photograph with magazine-quality composition, refined tonal balance, and elegant negative space, as if shot for a leading design publication." },
        { value: "vintage-film", label: "Vintage film", fragment: "Render with a vintage analogue film look: a warm colour cast, soft organic grain, subtle halation around highlights, and gently faded tones reminiscent of 35mm photography." },
        { value: "monochrome", label: "Black & white", fragment: "Render as a dramatic fine-art black-and-white photograph with deep contrast, rich tonal gradation, and a sculptural play of light and shadow across the forms." },
        { value: "watercolor", label: "Watercolor sketch", fragment: "Render as a loose architectural watercolour: translucent washes, soft bleeding edges, delicate linework, and visible cold-press paper texture, with an airy hand-painted feel." },
        { value: "line-sketch", label: "Pencil / line sketch", fragment: "Render as a hand-drawn graphite line sketch with confident contour lines, light cross-hatched shading, and a refined presentation-drawing character." },
        { value: "ink-marker", label: "Ink & marker", fragment: "Render as an ink-and-marker concept sketch with bold confident outlines, layered marker shading, and a lively, designerly hand." },
        { value: "blueprint", label: "Blueprint", fragment: "Render as a classic blueprint: precise white technical line work on a deep cyan-blue ground, with annotation-style clarity and clean edges." },
        { value: "diagram", label: "Conceptual diagram", fragment: "Render as a clean conceptual diagram with flat colour fills, simplified surfaces, clear visual hierarchy, and an analytical, explanatory feel." },
        { value: "isometric", label: "Isometric illustration", fragment: "Render as a precise isometric illustration with flat, even lighting, clean geometry, and a crafted, illustrative quality." },
        { value: "scale-model", label: "Tilt-shift scale model", fragment: "Render as a tilt-shift photograph of a finely crafted physical scale model, with shallow miniature depth of field, tactile model-making materials, and a charming miniature realism." },
        { value: "white-model", label: "Clay / white model", fragment: "Render as a monochrome white clay model: untextured matte-white surfaces, soft ambient occlusion, and clean studio light that reads pure form and massing." },
        { value: "minimalist", label: "Minimalist", fragment: "Render in a restrained minimalist style with a muted palette, clean uncluttered surfaces, generous negative space, and calm, understated lighting." },
      ],
    },
    lighting: {
      label: "Lighting",
      options: [
        { value: "overcast", label: "Overcast", fragment: "Light the scene with soft, diffused overcast daylight that wraps gently around every surface, yielding minimal shadows, even exposure, and rich, readable material detail." },
        { value: "golden-hour", label: "Golden hour", fragment: "Light the scene with warm golden-hour sun: low-angled amber light, long soft shadows, gentle volumetric glow, and a luminous, glowing horizon." },
        { value: "bright-midday", label: "Bright midday sun", fragment: "Light the scene with bright, clear midday sun under a vivid sky, producing crisp, well-defined shadows and punchy, saturated contrast." },
        { value: "harsh-noon", label: "Harsh noon", fragment: "Light the scene with harsh overhead noon sun, casting short, hard-edged shadows and strong highlights that emphasise texture and surface relief." },
        { value: "blue-hour", label: "Blue hour / dusk", fragment: "Light the scene at blue hour: a deep cobalt twilight sky balanced against warm, glowing interior light spilling softly from the windows." },
        { value: "twilight", label: "Twilight", fragment: "Light the scene at soft twilight just after sunset, with smooth gradients of violet and amber across the sky and gentle ambient illumination." },
        { value: "night", label: "Night", fragment: "Light the scene at night with layered artificial illumination — glowing interiors, warm window light, accent facade lighting, and pools of light cast by street lamps." },
        { value: "neon", label: "Neon", fragment: "Light the scene with vivid neon and signage glow against a dark backdrop, with saturated colour reflections shimmering across wet, glossy surfaces." },
        { value: "warm-interior", label: "Warm interior", fragment: "Light the interior with warm, inviting artificial light from lamps, pendants, and concealed sources, building a cosy, layered ambiance." },
        { value: "soft-diffused", label: "Soft diffused", fragment: "Light the scene with soft, evenly diffused light that gently models the forms with smooth, gradual shadow transitions." },
        { value: "studio", label: "Studio softbox", fragment: "Light the scene with clean studio softbox lighting: smooth even falloff, controlled highlights, and a crisp, product-like clarity." },
        { value: "high-key", label: "High-key bright", fragment: "Light the scene high-key with bright, airy, low-contrast illumination and luminous, almost shadowless surfaces." },
        { value: "volumetric", label: "Volumetric rays", fragment: "Fill the scene with atmospheric volumetric light — visible sun rays and soft god-rays cutting through a faint haze." },
        { value: "dramatic", label: "Dramatic / high-contrast", fragment: "Light the scene dramatically with strong directional light, bold high-contrast highlights, and deep, sculptural shadows." },
        { value: "backlit", label: "Backlit", fragment: "Backlight the building so the sun sits behind it, creating a luminous rim of light, a glowing silhouette, and long shadows reaching toward the viewer." },
        { value: "rim-light", label: "Rim light", fragment: "Add crisp rim lighting that traces the building's edges with a bright outline, separating it cleanly from the background." },
        { value: "sunrise", label: "Sunrise", fragment: "Light the scene at early sunrise with soft cool-to-warm pink and amber tones, low-lying mist, and a tranquil dawn calm." },
        { value: "moody", label: "Moody", fragment: "Light the scene moodily and low-key, with subdued tones, atmospheric haze, and pockets of focused light for a contemplative mood." },
      ],
    },
    material: {
      label: "Material",
      options: [
        { value: "brick-steel", label: "Brick and steel", fragment: "Clad the building in warm red brick masonry with crisp mortar joints and exposed structural steel, showing realistic surface texture, subtle weathering, and natural tonal variation." },
        { value: "dark-brick", label: "Dark brick", fragment: "Clad the building in dark charcoal brickwork with deep raked mortar joints, a matte surface, and rich, moody tonal depth." },
        { value: "glass-curtain", label: "Glass curtain wall", fragment: "Wrap the building in a sleek floor-to-ceiling glazed curtain wall with slim mullions, crystal-clear and subtly reflective glass, and crisp sky-and-context reflections." },
        { value: "concrete", label: "Concrete / brutalist", fragment: "Finish the building in board-formed exposed concrete with a visible timber-grain imprint, fine surface porosity, and a refined brutalist character." },
        { value: "timber", label: "Timber / wood", fragment: "Clad the building in warm natural timber with visible grain, expressed board joints, and a soft satin finish that lends tactile warmth." },
        { value: "blackened-timber", label: "Blackened timber (shou sugi ban)", fragment: "Clad the building in blackened charred timber (shou sugi ban) with a deep matte-black, textured surface and subtle silver highlights catching the grain." },
        { value: "stone", label: "Natural stone", fragment: "Clad the building in natural stone with rich texture, varied coursing, and authentic tonal variation from block to block." },
        { value: "marble", label: "Marble", fragment: "Finish key surfaces in polished marble with elegant veining, soft translucency, and a luxurious reflective sheen." },
        { value: "corten", label: "Corten / weathering steel", fragment: "Clad the building in weathering Corten steel with a rich rust-orange patina, subtle streaking, and a warm matte metallic surface." },
        { value: "terracotta", label: "Terracotta", fragment: "Clad the building in warm terracotta tiles or fired-clay baguettes, with an earthy matte finish and gentle colour variation." },
        { value: "zinc", label: "Standing-seam zinc", fragment: "Roof and clad the building in standing-seam zinc with crisp seams, a soft grey-blue sheen, and a refined contemporary finish." },
        { value: "metal-clad", label: "Metal cladding", fragment: "Clad the building in matte standing-seam or perforated metal panels with clean reveals and a precise, contemporary finish." },
        { value: "mixed-modern", label: "Mixed modern", fragment: "Combine a modern material palette of clear glass, fine metal panel, warm timber accents, and natural stone, balanced into a cohesive contemporary composition." },
        { value: "white-render", label: "White render / stucco", fragment: "Finish the building in smooth white rendered stucco with clean crisp edges, soft self-shadowing, and a bright, minimal surface." },
        { value: "rammed-earth", label: "Rammed earth", fragment: "Build the walls in rammed earth with horizontal sediment striations, an earthy natural palette, and a warm, tactile surface." },
        { value: "polished-plaster", label: "Polished plaster", fragment: "Finish surfaces in smooth polished Venetian-style plaster with a soft satin sheen and gentle tonal movement." },
        { value: "as-is-mat", label: "Keep source materials", fragment: "Keep the materials implied by the source view, simply rendered realistically with believable texture, reflectance, and subtle weathering." },
      ],
    },
    background: {
      label: "Background",
      options: [
        { value: "urban", label: "Urban context", fragment: "Ground the building in a believable urban streetscape: paved sidewalks and kerbs, neighbouring buildings of varied height and age, street furniture, signage, and mature street trees." },
        { value: "rooftop-skyline", label: "Rooftop skyline", fragment: "Set the building against a layered city skyline seen from rooftop level, with atmospheric depth as distant towers recede toward the horizon." },
        { value: "plaza", label: "Public plaza", fragment: "Place the building facing a generous public plaza with patterned paving, benches, planters, and people moving across the open space." },
        { value: "courtyard", label: "Courtyard", fragment: "Arrange the scene around a landscaped internal courtyard with greenery, paving, and sheltered seating that draws the eye inward." },
        { value: "suburban", label: "Suburban neighborhood", fragment: "Place the building in a leafy suburban neighbourhood with low surrounding houses, landscaped front gardens, driveways, and quiet tree-lined streets." },
        { value: "park", label: "Park / greenery", fragment: "Nestle the building within a verdant park: manicured lawns, mature trees, winding pathways, and soft natural planting all around." },
        { value: "waterfront", label: "Waterfront", fragment: "Place the building on a vibrant waterfront with rippling water, a promenade, moored boats, and a distant skyline across the water." },
        { value: "mountains", label: "Mountains", fragment: "Set the building against a dramatic backdrop of layered mountains, rugged natural terrain, and crisp alpine air." },
        { value: "countryside", label: "Countryside", fragment: "Place the building in rolling open countryside with patchwork fields, hedgerows, scattered trees, and a soft natural horizon." },
        { value: "desert", label: "Desert", fragment: "Place the building in an arid desert landscape with sculpted sand, sparse hardy vegetation, distant mesas, and a vast clear sky." },
        { value: "forest", label: "Forest", fragment: "Embed the building within a dense forest of tall trees, dappled light, layered undergrowth, and a deep green canopy." },
        { value: "japanese-garden", label: "Japanese garden", fragment: "Surround the building with a serene Japanese garden of raked gravel, moss, stepping stones, maples, and a still reflecting pond." },
        { value: "industrial", label: "Industrial district", fragment: "Set the building within a converted industrial district of brick warehouses, exposed infrastructure, and gritty urban texture." },
        { value: "snowfield", label: "Snowfield", fragment: "Place the building in a pristine, snow-blanketed landscape with soft drifts, frosted trees, and a cool, quiet stillness." },
        { value: "isolated", label: "Open sky / isolated", fragment: "Place the building against a clean, uncluttered open-sky backdrop with no surrounding context, so the architecture reads as the sole subject." },
        { value: "keep", label: "Keep existing", fragment: "Keep the existing background and surrounding context from the source view, simply rendered realistically." },
      ],
    },
    entourage: {
      label: "Entourage",
      options: [
        { value: "busy", label: "Busy and lively", fragment: "Populate the scene with lively human activity — pedestrians walking in small groups, people pausing to talk, a few cyclists — for a natural sense of everyday life that gives the architecture scale and warmth." },
        { value: "moderate", label: "Moderate activity", fragment: "Add a moderate, natural amount of life: a scattering of pedestrians and a few parked and passing vehicles for an authentic sense of scale." },
        { value: "families", label: "Families", fragment: "Add families and children at relaxed play, with a warm, friendly, residential atmosphere." },
        { value: "cyclists", label: "Cyclists", fragment: "Add cyclists and pedestrians in gentle motion for an active, healthy streetscape with a sense of movement." },
        { value: "market-stalls", label: "Market stalls", fragment: "Animate the scene with a lively street market — stalls, awnings, produce, and browsing crowds — for a vibrant, bustling atmosphere." },
        { value: "outdoor-cafe", label: "Outdoor café", fragment: "Add outdoor café seating with parasols, relaxed diners, and waiters, lending a sociable, animated street life." },
        { value: "nightlife", label: "Nightlife", fragment: "Populate the scene with evening nightlife — glowing signage, softly lit windows, and well-dressed people out enjoying the night." },
        { value: "people", label: "People only", fragment: "Add a light scattering of pedestrians for a believable sense of scale, with no vehicles." },
        { value: "vehicles", label: "Vehicles", fragment: "Add parked and slowly moving vehicles appropriate to the setting, with subtle motion blur on those in motion." },
        { value: "furnished", label: "Furnished interior", fragment: "Furnish the interior fully and realistically: considered furniture, layered textiles, plants, and artwork, plus a few lived-in touches such as an open book and a coffee cup that suggest the space is loved and used." },
        { value: "quiet", label: "Quiet / empty", fragment: "Keep the scene calm and largely unpopulated, with at most one or two distant figures, for a serene, contemplative mood." },
        { value: "as-is-ent", label: "As is", fragment: "" },
      ],
    },
    weather: {
      label: "Weather",
      options: [
        { value: "as-is", label: "As is", fragment: "" },
        { value: "clear", label: "Clear sky", fragment: "Set a clear, bright sky of deep blue with excellent visibility and clean, crisp light." },
        { value: "partly-cloudy", label: "Partly cloudy", fragment: "Set a partly cloudy sky with soft, scattered cumulus drifting across the blue, casting gentle moving shadows." },
        { value: "overcast-w", label: "Overcast", fragment: "Set an even, overcast grey sky that diffuses the light softly across the whole scene." },
        { value: "dramatic-sky", label: "Dramatic clouds", fragment: "Set a dramatic, expressive sky with bold, sculptural cloud formations and shafts of breaking light." },
        { value: "golden-haze", label: "Golden haze", fragment: "Fill the air with a warm golden atmospheric haze that softens the distance and bathes the scene in glow." },
        { value: "rain", label: "Rain / wet", fragment: "Set wet, rainy conditions with glistening reflective surfaces, puddles mirroring the building, and a fresh, washed atmosphere." },
        { value: "storm", label: "Storm", fragment: "Set brooding stormy conditions with heavy dark clouds, dramatic breaking light, and a charged, atmospheric mood." },
        { value: "snow", label: "Snow", fragment: "Set a gentle snowfall with a soft blanket of snow on surfaces, drifting flakes, and a hushed, wintry calm." },
        { value: "fog", label: "Fog / mist", fragment: "Wrap the scene in soft fog and mist that fades the background into atmospheric depth and lends a quiet, moody air." },
        { value: "mist-morning", label: "Morning mist", fragment: "Set a fresh early-morning mist hanging low across the scene, softening the distance with a tranquil dawn haze." },
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
      { value: "high", label: "High detail", fragment: "Output at high resolution with fine, sharp detail throughout." },
      { value: "ultra", label: "Ultra / 4K", fragment: "Output at ultra-high 4K resolution with maximum sharpness, fine micro-detail, and a gallery-quality finish." },
    ],
  },
};
