/*
 * data.js — the prompt "library".
 *
 * Each dropdown option carries a `fragment`: the default (photographic)
 * sentence stitched into the prompt. Options that would otherwise sound
 * realistic also carry an `art` variant — an abstract/expressionist wording
 * used whenever an artistic style is selected, so nothing tells a hand-crafted
 * image to look "realistic". A `preset` bundles a framing instruction (`base`)
 * with a full set of field selections; every preset sets every field.
 */

/*
 * Framing instructions — these protect the source geometry only. They no longer
 * assert photorealism; the "render directive" (below) decides realistic vs.
 * artistic, so hand-crafted styles are never told to look photographic.
 */
const BASES = {
  exterior:
    "You are an architectural rendering engine. I am providing an exported building view. " +
    "Preserve the exact geometry, spatial composition, camera angle, and perspective of this image. " +
    "Do not add, remove, or reposition any building elements, and do not change the proportions or layout of the structure.",
  hero:
    "You are an architectural rendering engine. I am providing an exported exterior view of a building. " +
    "Preserve the exact massing, facade articulation, camera angle, and perspective of this image. " +
    "Do not add, remove, or reposition any building elements, and do not alter the proportions of the structure.",
  interior:
    "You are an architectural rendering engine. I am providing an exported interior view. " +
    "Preserve the exact room geometry, layout, ceiling height, camera angle, and perspective of this image. " +
    "Do not move walls, openings, or furniture, and do not change the proportions of the space.",
  concept:
    "You are an architectural visualization engine. I am providing an exported massing/concept view. " +
    "Keep the overall form, footprint, height, camera angle, and perspective of this image intact. " +
    "You may refine surfaces and add context, but do not change the fundamental shape of the building.",
  aerial:
    "You are an architectural rendering engine. I am providing an exported aerial / site view. " +
    "Preserve the exact site layout, building positions, road network, camera angle, and bird's-eye perspective of this image. " +
    "Do not move or resize any buildings or site elements.",
  free:
    "I am providing an exported architectural view. " +
    "Keep the camera angle, composition, and overall geometry of this image.",
};

/*
 * Render directive — inserted right after the framing. Chosen by whether the
 * selected style is photographic or hand-crafted/artistic. Artistic styles are
 * explicitly told NOT to be photorealistic and to embrace abstraction.
 */
const DIRECTIVES = {
  photoreal:
    "Render it at the quality of professional architectural photography, with accurate materials, lighting, and reflections, following the style instructions below:",
  artistic:
    "Do not render this photorealistically. Instead, reinterpret the view as a stylised, hand-crafted artwork — embracing abstraction and looser, expressive interpretation, and suggesting materials and light through the medium rather than realism — following the style instructions below:",
};

/* Styles that use the artistic (non-photorealistic) directive and the `art` fragment variants. */
const ARTISTIC_STYLES = [
  "collage", "gouache", "oil-painting", "watercolor", "line-sketch",
  "charcoal", "ink-marker", "pen-wash", "risograph", "blueprint",
  "diagram", "isometric",
];

const RENDER_DATA = {
  /*
   * Combined preset dropdown. `set` pre-selects every field. The keys in `set`
   * are also what the UI compares against to show the "(Customised)" flag, so
   * every preset lists all seven fields.
   */
  presets: [
    // — Exterior —
    { value: "urban-day", label: "Urban Day — Street Level", base: BASES.exterior,
      set: { style: "photorealistic", lighting: "overcast", material: "brick-steel", interior: "none", background: "urban", entourage: "busy", weather: "as-is" } },
    { value: "golden-hero", label: "Golden Hour Hero", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "glass-curtain", interior: "none", background: "urban", entourage: "moderate", weather: "clear" } },
    { value: "urban-night", label: "Urban Night", base: BASES.hero,
      set: { style: "cinematic", lighting: "night", material: "glass-curtain", interior: "none", background: "rooftop-skyline", entourage: "nightlife", weather: "clear" } },
    { value: "blue-hour", label: "Blue Hour Dusk", base: BASES.hero,
      set: { style: "photorealistic", lighting: "blue-hour", material: "glass-curtain", interior: "none", background: "urban", entourage: "moderate", weather: "partly-cloudy" } },
    { value: "suburban-day", label: "Suburban Daylight", base: BASES.exterior,
      set: { style: "photorealistic", lighting: "bright-midday", material: "white-render", interior: "none", background: "suburban", entourage: "families", weather: "clear" } },
    { value: "waterfront-dusk", label: "Waterfront Dusk", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "glass-curtain", interior: "none", background: "waterfront", entourage: "moderate", weather: "dramatic-sky" } },
    { value: "forest-retreat", label: "Forest Retreat", base: BASES.hero,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "blackened-timber", interior: "none", background: "forest", entourage: "quiet", weather: "partly-cloudy" } },
    { value: "desert-modern", label: "Desert Modern", base: BASES.hero,
      set: { style: "photorealistic", lighting: "harsh-noon", material: "rammed-earth", interior: "none", background: "desert", entourage: "quiet", weather: "clear" } },
    { value: "mountain-lodge", label: "Mountain Lodge", base: BASES.hero,
      set: { style: "photorealistic", lighting: "golden-hour", material: "stone", interior: "none", background: "mountains", entourage: "moderate", weather: "clear" } },
    { value: "zen-pavilion", label: "Zen Garden Pavilion", base: BASES.hero,
      set: { style: "minimalist", lighting: "soft-diffused", material: "timber", interior: "none", background: "japanese-garden", entourage: "quiet", weather: "mist-morning" } },
    { value: "rainy-moody", label: "Rainy & Moody", base: BASES.hero,
      set: { style: "cinematic", lighting: "moody", material: "concrete", interior: "none", background: "urban", entourage: "quiet", weather: "rain" } },
    { value: "snowy-scene", label: "Snowy Scene", base: BASES.hero,
      set: { style: "photorealistic", lighting: "overcast", material: "stone", interior: "none", background: "snowfield", entourage: "quiet", weather: "snow" } },
    { value: "cinematic-night", label: "Cinematic Neon Night", base: BASES.hero,
      set: { style: "cinematic", lighting: "neon", material: "dark-brick", interior: "none", background: "urban", entourage: "nightlife", weather: "rain" } },

    // — Interiors —
    { value: "interior-day", label: "Interior — Daylight", base: BASES.interior,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "timber", interior: "scandinavian", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "interior-evening", label: "Interior — Evening", base: BASES.interior,
      set: { style: "cinematic", lighting: "warm-interior", material: "timber", interior: "mid-century", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "scandi-interior", label: "Scandinavian Interior", base: BASES.interior,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "warm-oak", interior: "scandinavian", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "japandi-interior", label: "Japandi Interior", base: BASES.interior,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "timber", interior: "japandi", background: "keep", entourage: "styled-empty", weather: "as-is" } },
    { value: "warm-minimal-interior", label: "Warm Minimalist Interior", base: BASES.interior,
      set: { style: "photorealistic", lighting: "soft-diffused", material: "microcement", interior: "warm-minimal", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "midcentury-living", label: "Mid-Century Living Room", base: BASES.interior,
      set: { style: "photorealistic", lighting: "warm-interior", material: "warm-oak", interior: "mid-century", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "industrial-loft", label: "Industrial Loft", base: BASES.interior,
      set: { style: "photorealistic", lighting: "warm-interior", material: "dark-brick", interior: "industrial", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "corporate-office", label: "Corporate Office", base: BASES.interior,
      set: { style: "arch-viz", lighting: "studio", material: "glass-curtain", interior: "corporate", background: "keep", entourage: "office-workers", weather: "as-is" } },
    { value: "hotel-lobby", label: "Luxury Hotel Lobby", base: BASES.interior,
      set: { style: "cinematic", lighting: "warm-interior", material: "marble", interior: "luxury", background: "keep", entourage: "diners", weather: "as-is" } },
    { value: "traditional-interior", label: "Traditional Interior", base: BASES.interior,
      set: { style: "photorealistic", lighting: "warm-interior", material: "warm-oak", interior: "traditional", background: "keep", entourage: "furnished", weather: "as-is" } },
    { value: "biophilic-atrium", label: "Biophilic Atrium", base: BASES.interior,
      set: { style: "photorealistic", lighting: "volumetric", material: "timber", interior: "biophilic", background: "keep", entourage: "moderate", weather: "as-is" } },

    // — Concept / massing —
    { value: "editorial-hero", label: "Editorial Magazine", base: BASES.hero,
      set: { style: "editorial", lighting: "soft-diffused", material: "mixed-modern", interior: "none", background: "isolated", entourage: "people", weather: "partly-cloudy" } },
    { value: "concept-massing", label: "Concept Massing", base: BASES.concept,
      set: { style: "white-model", lighting: "bright-midday", material: "white-render", interior: "none", background: "isolated", entourage: "quiet", weather: "clear" } },
    { value: "scale-model", label: "Tilt-Shift Scale Model", base: BASES.concept,
      set: { style: "scale-model", lighting: "studio", material: "mixed-modern", interior: "none", background: "isolated", entourage: "people", weather: "as-is" } },
    { value: "aerial-masterplan", label: "Aerial Masterplan", base: BASES.aerial,
      set: { style: "arch-viz", lighting: "bright-midday", material: "mixed-modern", interior: "none", background: "urban", entourage: "moderate", weather: "partly-cloudy" } },

    // — Artistic / hand-crafted —
    { value: "collage-concept", label: "Collage Concept (digital)", base: BASES.free,
      set: { style: "collage", lighting: "soft-diffused", material: "as-is-mat", interior: "none", background: "park", entourage: "people", weather: "partly-cloudy" } },
    { value: "collage-interior", label: "Collage Interior", base: BASES.interior,
      set: { style: "collage", lighting: "warm-interior", material: "as-is-mat", interior: "bohemian", background: "keep", entourage: "people", weather: "as-is" } },
    { value: "gouache-concept", label: "Gouache Concept", base: BASES.free,
      set: { style: "gouache", lighting: "soft-diffused", material: "as-is-mat", interior: "none", background: "urban", entourage: "people", weather: "as-is" } },
    { value: "monochrome", label: "Black & White Fine Art", base: BASES.hero,
      set: { style: "monochrome", lighting: "dramatic", material: "concrete", interior: "none", background: "isolated", entourage: "people", weather: "dramatic-sky" } },
    { value: "watercolor", label: "Watercolor Presentation", base: BASES.free,
      set: { style: "watercolor", lighting: "soft-diffused", material: "as-is-mat", interior: "none", background: "park", entourage: "people", weather: "partly-cloudy" } },
    { value: "pencil-sketch", label: "Pencil Line Sketch", base: BASES.free,
      set: { style: "line-sketch", lighting: "soft-diffused", material: "as-is-mat", interior: "none", background: "isolated", entourage: "people", weather: "as-is" } },
    { value: "blueprint", label: "Blueprint Concept", base: BASES.free,
      set: { style: "blueprint", lighting: "soft-diffused", material: "as-is-mat", interior: "none", background: "isolated", entourage: "quiet", weather: "as-is" } },
    { value: "free-style", label: "Free Style (minimal)", base: BASES.free,
      set: { style: "cinematic", lighting: "dramatic", material: "as-is-mat", interior: "none", background: "keep", entourage: "as-is-ent", weather: "as-is" } },
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

        // — Artistic / hand-crafted —
        { value: "collage", label: "Collage (digital)", fragment: "Render as a flat digital collage: fill each wall, floor, ceiling, and surface with a single bold patch of texture — scanned brushstrokes, painterly marks, marbled and patterned fills, and flat blocks of solid colour — composited cleanly side by side as flat planes. Keep the perspective and geometry of the space, but give every plane a distinct graphic texture or colour so material contrast comes from the juxtaposition of patches rather than any realistic rendering. Do not use three-dimensional relief, torn-paper edges, drop shadows, or photorealistic shading; keep everything flat and graphic. Render figures and fittings simply and almost silhouetted with minimal detail. The result should read as a tactile, slightly abstracted, hand-composed digital collage in the manner of contemporary architectural collage painting and mood-board visualisation." },
        { value: "gouache", label: "Gouache painting", fragment: "Render as a gouache painting with matte, opaque colour, soft confident brushwork, gentle tonal blending, and a warm hand-painted illustrative quality." },
        { value: "oil-painting", label: "Oil painting", fragment: "Render as a textured oil painting with visible impasto brushstrokes, richly blended colour, and an atmospheric fine-art quality." },
        { value: "watercolor", label: "Watercolor sketch", fragment: "Render as a loose architectural watercolour: translucent washes, soft bleeding edges, delicate linework, and visible cold-press paper texture, with an airy hand-painted feel." },
        { value: "line-sketch", label: "Pencil / line sketch", fragment: "Render as a hand-drawn graphite line sketch with confident contour lines, light cross-hatched shading, and a refined presentation-drawing character." },
        { value: "charcoal", label: "Charcoal drawing", fragment: "Render as an expressive charcoal drawing with smudged tonal shading, bold gestural strokes, and a moody monochrome character." },
        { value: "ink-marker", label: "Ink & marker", fragment: "Render as an ink-and-marker concept sketch with bold confident outlines, layered marker shading, and a lively, designerly hand." },
        { value: "pen-wash", label: "Pen & wash", fragment: "Render as a pen-and-ink line drawing with a loose watercolour wash, crisp confident linework, and a fresh architectural-sketch feel." },
        { value: "risograph", label: "Risograph / screen-print", fragment: "Render as a risograph / screen-print with a limited palette of two or three flat spot colours, slight mis-registration, grainy ink texture, and a bold graphic poster feel." },
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
        { value: "brick-steel", label: "Brick and steel", fragment: "Clad the building in warm red brick masonry with crisp mortar joints and exposed structural steel, showing realistic surface texture, subtle weathering, and natural tonal variation.", art: "Evoke warm red brick and dark steel as bold blocks of warm red and charcoal, with brick suggested by a simple grid pattern." },
        { value: "dark-brick", label: "Dark brick", fragment: "Clad the building in dark charcoal brickwork with deep raked mortar joints, a matte surface, and rich, moody tonal depth.", art: "Evoke dark charcoal brickwork as deep near-black blocks with a subtle grid pattern." },
        { value: "glass-curtain", label: "Glass curtain wall", fragment: "Wrap the building in a sleek floor-to-ceiling glazed curtain wall with slim mullions, crystal-clear and subtly reflective glass, and crisp sky-and-context reflections.", art: "Evoke the glazed facade as flat panes of pale blue-grey and white, divided by a clean grid of lines." },
        { value: "concrete", label: "Concrete / brutalist", fragment: "Finish the building in board-formed exposed concrete with a visible timber-grain imprint, fine surface porosity, and a refined brutalist character.", art: "Evoke concrete as flat, muted grey planes with a lightly mottled texture." },
        { value: "microcement", label: "Microcement / polished concrete", fragment: "Finish surfaces in seamless microcement and polished concrete with a smooth, matte, tactile surface and gentle tonal movement.", art: "Evoke microcement as smooth, flat planes of soft warm grey." },
        { value: "timber", label: "Timber / wood", fragment: "Clad the building in warm natural timber with visible grain, expressed board joints, and a soft satin finish that lends tactile warmth.", art: "Evoke timber as warm tan and honey planes with simple linear wood-grain marks." },
        { value: "warm-oak", label: "Warm oak joinery", fragment: "Line the space in warm oak joinery and timber flooring with visible grain, seamless detailing, and a soft satin finish.", art: "Evoke oak joinery as warm honey-toned planes with light linear grain marks." },
        { value: "blackened-timber", label: "Blackened timber (shou sugi ban)", fragment: "Clad the building in blackened charred timber (shou sugi ban) with a deep matte-black, textured surface and subtle silver highlights catching the grain.", art: "Evoke charred timber as flat near-black planes with fine vertical striations." },
        { value: "stone", label: "Natural stone", fragment: "Clad the building in natural stone with rich texture, varied coursing, and authentic tonal variation from block to block.", art: "Evoke stone as mottled grey and beige patches with simple coursing lines." },
        { value: "marble", label: "Marble", fragment: "Finish key surfaces in polished marble with elegant veining, soft translucency, and a luxurious reflective sheen.", art: "Evoke marble as pale planes with a few bold, sweeping veining marks." },
        { value: "terrazzo", label: "Terrazzo", fragment: "Finish surfaces in terrazzo with speckled aggregate chips set in a polished matrix, in a soft contemporary palette.", art: "Evoke terrazzo as a pale plane flecked with scattered coloured speckles." },
        { value: "brushed-brass", label: "Brushed brass accents", fragment: "Introduce brushed brass and warm metal accents with a soft satin lustre set against darker surfaces.", art: "Evoke brass accents as flat, warm-gold shapes." },
        { value: "corten", label: "Corten / weathering steel", fragment: "Clad the building in weathering Corten steel with a rich rust-orange patina, subtle streaking, and a warm matte metallic surface.", art: "Evoke Corten steel as flat rust-orange and brown patches." },
        { value: "terracotta", label: "Terracotta", fragment: "Clad the building in warm terracotta tiles or fired-clay baguettes, with an earthy matte finish and gentle colour variation.", art: "Evoke terracotta as warm burnt-orange and clay-toned blocks." },
        { value: "zinc", label: "Standing-seam zinc", fragment: "Roof and clad the building in standing-seam zinc with crisp seams, a soft grey-blue sheen, and a refined contemporary finish.", art: "Evoke zinc as flat, cool grey-blue planes with fine seam lines." },
        { value: "metal-clad", label: "Metal cladding", fragment: "Clad the building in matte standing-seam or perforated metal panels with clean reveals and a precise, contemporary finish.", art: "Evoke metal cladding as flat grey planes with simple seam lines." },
        { value: "mixed-modern", label: "Mixed modern", fragment: "Combine a modern material palette of clear glass, fine metal panel, warm timber accents, and natural stone, balanced into a cohesive contemporary composition.", art: "Evoke a mixed palette of pale glass, grey metal, warm timber, and stone as adjoining blocks of colour and texture." },
        { value: "white-render", label: "White render / stucco", fragment: "Finish the building in smooth white rendered stucco with clean crisp edges, soft self-shadowing, and a bright, minimal surface.", art: "Evoke white render as clean, flat off-white planes." },
        { value: "rammed-earth", label: "Rammed earth", fragment: "Build the walls in rammed earth with horizontal sediment striations, an earthy natural palette, and a warm, tactile surface.", art: "Evoke rammed earth as warm ochre planes with horizontal banded striations." },
        { value: "polished-plaster", label: "Polished plaster", fragment: "Finish surfaces in smooth polished Venetian-style plaster with a soft satin sheen and gentle tonal movement.", art: "Evoke polished plaster as soft, flat planes with gentle tonal shifts." },
        { value: "as-is-mat", label: "Keep source materials", fragment: "Keep the materials implied by the source view, simply rendered realistically with believable texture, reflectance, and subtle weathering.", art: "Suggest the materials from the source view as flat blocks of colour and simple texture." },
      ],
    },
    interior: {
      label: "Interior style",
      options: [
        { value: "none", label: "Not specified", fragment: "" },
        { value: "scandinavian", label: "Scandinavian", fragment: "Furnish and style the interior in a Scandinavian manner: pale oak and birch, soft neutral and greige textiles, clean-lined functional furniture, cosy hygge layering, houseplants, and an airy, light-filled calm.", art: "Evoke a Scandinavian palette and furnishings as simple flat shapes: pale oak, soft greige and white, clean-lined forms, and a few plants." },
        { value: "japandi", label: "Japandi", fragment: "Furnish and style the interior in a Japandi manner — a fusion of Japanese and Scandinavian design: low-profile furniture, raw wood, linen, rice paper and textured ceramics, a soft earthy palette of greige, sand and anthracite, and a serene, wabi-sabi calm that embraces natural imperfection.", art: "Evoke a Japandi palette as simple flat shapes: low forms, raw wood, and a soft earthy palette of greige, sand and anthracite." },
        { value: "warm-minimal", label: "Warm minimalist", fragment: "Furnish and style the interior as warm minimalism: uncluttered space with a few high-quality pieces, soft neutral tones, tactile natural textures, warm woods, and generous breathing room and natural light.", art: "Evoke warm minimalism as a few simple flat forms in soft neutral, tactile warm tones." },
        { value: "minimalist", label: "Strict minimalist", fragment: "Furnish and style the interior as strict minimalism: a restrained neutral palette of white, grey and warm earth tones, very few carefully chosen furnishings, clean lines, and empty space treated as an active design element.", art: "Evoke strict minimalism as very few simple flat shapes in a restrained white, grey and earth palette." },
        { value: "mid-century", label: "Mid-century modern", fragment: "Furnish and style the interior in mid-century modern: teak and walnut furniture with tapered legs, organic curves, warm mustard, olive and burnt-orange accents, statement lighting, and a retro-yet-timeless feel.", art: "Evoke mid-century furnishings as simple flat forms with warm mustard, olive and burnt-orange accents." },
        { value: "industrial", label: "Industrial", fragment: "Furnish and style the interior in an industrial manner: exposed brick and concrete, black steel framing, reclaimed timber, Edison-bulb lighting, leather and raw-metal furniture, and an open warehouse-loft character.", art: "Evoke an industrial palette as flat blocks: exposed brick, black steel lines, and reclaimed timber." },
        { value: "contemporary", label: "Hypermodern / contemporary", fragment: "Furnish and style the interior as sleek hypermodern contemporary: crisp minimal forms, high-gloss and matte surfaces, integrated technology, a monochrome palette with bold accents, and a polished, cutting-edge feel.", art: "Evoke a sleek contemporary palette as crisp flat forms in a monochrome scheme with bold accents." },
        { value: "corporate", label: "Corporate / commercial", fragment: "Furnish and style the interior as a professional corporate workplace: modular desks and ergonomic seating, acoustic panels, glass partitions, brand-neutral greys and blues with timber accents, and a clean, productive office atmosphere.", art: "Evoke a corporate workplace as simple flat desks and partitions in brand-neutral greys and blues with timber accents." },
        { value: "traditional", label: "Traditional / classic", fragment: "Furnish and style the interior in a traditional, classic manner: rich hardwood furniture, symmetrical arrangements, moulded panelling and cornices, warm layered fabrics, patterned rugs, and an elegant, timeless formality.", art: "Evoke traditional furnishings as flat forms in rich hardwood tones with patterned rug and fabric shapes." },
        { value: "art-deco", label: "Art Deco", fragment: "Furnish and style the interior in Art Deco: bold geometric patterns, lacquered wood, brass and gold accents, marble, and velvet upholstery in jewel tones, for a glamorous 1920s sophistication.", art: "Evoke Art Deco as bold flat geometric patterns in brass, black, and jewel tones." },
        { value: "bohemian", label: "Bohemian", fragment: "Furnish and style the interior in a bohemian manner: layered rugs and textiles, rattan and woven furniture, abundant plants, warm earthy and jewel tones, and an eclectic, collected, free-spirited feel.", art: "Evoke a bohemian palette as layered flat patterns and plant shapes in warm earthy and jewel tones." },
        { value: "rustic", label: "Rustic / farmhouse", fragment: "Furnish and style the interior in a rustic farmhouse manner: reclaimed timber beams, natural stone, aged leather and linen, wrought iron, and a warm, homely, handcrafted character.", art: "Evoke a rustic palette as flat forms in reclaimed timber, stone, and aged leather tones." },
        { value: "coastal", label: "Coastal", fragment: "Furnish and style the interior in a coastal manner: a light palette of white, sand and soft blue, natural linen and rattan, weathered timber, and a breezy, relaxed seaside calm.", art: "Evoke a coastal palette as flat shapes in white, sand and soft blue." },
        { value: "mediterranean", label: "Mediterranean", fragment: "Furnish and style the interior in a Mediterranean manner: whitewashed lime-plaster walls, terracotta floors, wrought iron, warm ochre tones, arches, and rustic sun-baked warmth.", art: "Evoke a Mediterranean palette as flat whitewashed walls, terracotta floors, and warm ochre tones with arch shapes." },
        { value: "biophilic", label: "Biophilic", fragment: "Furnish and style the interior biophilically: abundant greenery and living walls, natural timber and stone, water features, generous daylight, and a strong, restorative connection to nature.", art: "Evoke a biophilic scheme as abundant flat plant shapes with natural timber and stone tones." },
        { value: "maximalist", label: "Maximalist", fragment: "Furnish and style the interior in a maximalist manner: rich saturated colours, bold layered patterns, a gallery wall, statement furniture, and a curated, exuberant abundance.", art: "Evoke maximalism as densely layered flat patterns and saturated colour blocks." },
        { value: "luxury", label: "Luxury / hospitality", fragment: "Furnish and style the interior as high-end luxury hospitality: polished marble, brushed brass, statement lighting, plush velvet and leather, bespoke joinery, and a refined, five-star sense of opulence.", art: "Evoke luxury as flat forms in marble, brass, and deep velvet jewel tones." },
      ],
    },
    background: {
      label: "Background",
      options: [
        { value: "urban", label: "Urban context", fragment: "Ground the building in a believable urban streetscape: paved sidewalks and kerbs, neighbouring buildings of varied height and age, street furniture, signage, and mature street trees.", art: "Suggest an urban context as simple flat shapes of neighbouring buildings, pavement, and a few tree forms." },
        { value: "rooftop-skyline", label: "Rooftop skyline", fragment: "Set the building against a layered city skyline seen from rooftop level, with atmospheric depth as distant towers recede toward the horizon.", art: "Suggest a city skyline as flat, layered building silhouettes receding in tone." },
        { value: "plaza", label: "Public plaza", fragment: "Place the building facing a generous public plaza with patterned paving, benches, planters, and people moving across the open space.", art: "Suggest a public plaza as flat paving shapes with a few simple figures." },
        { value: "courtyard", label: "Courtyard", fragment: "Arrange the scene around a landscaped internal courtyard with greenery, paving, and sheltered seating that draws the eye inward.", art: "Suggest a courtyard as flat planting and paving shapes." },
        { value: "suburban", label: "Suburban neighborhood", fragment: "Place the building in a leafy suburban neighbourhood with low surrounding houses, landscaped front gardens, driveways, and quiet tree-lined streets.", art: "Suggest a suburban setting as simple flat house and garden shapes." },
        { value: "park", label: "Park / greenery", fragment: "Nestle the building within a verdant park: manicured lawns, mature trees, winding pathways, and soft natural planting all around.", art: "Suggest a park as flat green shapes, simple tree forms, and pathways." },
        { value: "waterfront", label: "Waterfront", fragment: "Place the building on a vibrant waterfront with rippling water, a promenade, moored boats, and a distant skyline across the water.", art: "Suggest a waterfront as flat bands of water and a simple distant skyline." },
        { value: "mountains", label: "Mountains", fragment: "Set the building against a dramatic backdrop of layered mountains, rugged natural terrain, and crisp alpine air.", art: "Suggest mountains as flat, layered silhouettes in receding tones." },
        { value: "countryside", label: "Countryside", fragment: "Place the building in rolling open countryside with patchwork fields, hedgerows, scattered trees, and a soft natural horizon.", art: "Suggest countryside as flat bands of field and hedgerow shapes." },
        { value: "desert", label: "Desert", fragment: "Place the building in an arid desert landscape with sculpted sand, sparse hardy vegetation, distant mesas, and a vast clear sky.", art: "Suggest a desert as flat sand-toned planes under a broad flat sky." },
        { value: "forest", label: "Forest", fragment: "Embed the building within a dense forest of tall trees, dappled light, layered undergrowth, and a deep green canopy.", art: "Suggest a forest as flat, layered tree shapes in deep greens." },
        { value: "japanese-garden", label: "Japanese garden", fragment: "Surround the building with a serene Japanese garden of raked gravel, moss, stepping stones, maples, and a still reflecting pond.", art: "Suggest a Japanese garden as flat gravel, moss, and simple maple and rock shapes." },
        { value: "industrial", label: "Industrial district", fragment: "Set the building within a converted industrial district of brick warehouses, exposed infrastructure, and gritty urban texture.", art: "Suggest an industrial district as flat warehouse and infrastructure silhouettes." },
        { value: "snowfield", label: "Snowfield", fragment: "Place the building in a pristine, snow-blanketed landscape with soft drifts, frosted trees, and a cool, quiet stillness.", art: "Suggest a snowfield as flat white and pale-grey planes." },
        { value: "isolated", label: "Open sky / isolated", fragment: "Place the building against a clean, uncluttered open-sky backdrop with no surrounding context, so the architecture reads as the sole subject.", art: "Set the scene against a plain, flat background of a single colour, with no context." },
        { value: "keep", label: "Keep existing", fragment: "Keep the existing background and surrounding context from the source view, simply rendered realistically.", art: "Keep the existing background from the source view, rendered as simple flat shapes of colour." },
      ],
    },
    entourage: {
      label: "Entourage",
      options: [
        { value: "busy", label: "Busy and lively", fragment: "Populate the scene with lively human activity — pedestrians walking in small groups, people pausing to talk, a few cyclists — for a natural sense of everyday life that gives the architecture scale and warmth.", art: "Add several simple, almost silhouetted figures in small groups to suggest lively activity." },
        { value: "moderate", label: "Moderate activity", fragment: "Add a moderate, natural amount of life: a scattering of pedestrians and a few parked and passing vehicles for an authentic sense of scale.", art: "Add a few simple, flat figures for a sense of scale." },
        { value: "families", label: "Families", fragment: "Add families and children at relaxed play, with a warm, friendly, residential atmosphere.", art: "Add a few simple, flat figures of families and children." },
        { value: "cyclists", label: "Cyclists", fragment: "Add cyclists and pedestrians in gentle motion for an active, healthy streetscape with a sense of movement.", art: "Add a couple of simple, flat cyclist and pedestrian figures." },
        { value: "market-stalls", label: "Market stalls", fragment: "Animate the scene with a lively street market — stalls, awnings, produce, and browsing crowds — for a vibrant, bustling atmosphere.", art: "Suggest a street market as flat stall, awning, and figure shapes." },
        { value: "outdoor-cafe", label: "Outdoor café", fragment: "Add outdoor café seating with parasols, relaxed diners, and waiters, lending a sociable, animated street life.", art: "Suggest outdoor café seating as simple flat table, parasol, and figure shapes." },
        { value: "nightlife", label: "Nightlife", fragment: "Populate the scene with evening nightlife — glowing signage, softly lit windows, and well-dressed people out enjoying the night.", art: "Add simple flat figures and glowing sign shapes to suggest an evening scene." },
        { value: "people", label: "People only", fragment: "Add a light scattering of pedestrians for a believable sense of scale, with no vehicles.", art: "Add a few simple, almost silhouetted figures for scale." },
        { value: "vehicles", label: "Vehicles", fragment: "Add parked and slowly moving vehicles appropriate to the setting, with subtle motion blur on those in motion.", art: "Add a couple of simple, flat vehicle shapes." },
        { value: "furnished", label: "Furnished (lived-in)", fragment: "Furnish the interior fully and realistically: considered furniture, layered textiles, plants, and artwork, plus a few lived-in touches such as an open book and a coffee cup that suggest the space is loved and used.", art: "Furnish the space with simple flat furniture shapes and a few objects, kept graphic rather than detailed." },
        { value: "styled-empty", label: "Styled, no people", fragment: "Style the interior fully but leave it unoccupied, as in a magazine shoot — no people, just an immaculately composed and styled space.", art: "Style the space with simple flat furnishing shapes and leave it unoccupied." },
        { value: "office-workers", label: "Office workers", fragment: "Add a few people working — seated at desks, walking, and meeting — for a natural, active workplace feel.", art: "Add a few simple, flat figures at desks and in conversation." },
        { value: "diners", label: "Diners / guests", fragment: "Add seated diners and attentive staff for a warm, convivial hospitality atmosphere.", art: "Add a few simple, flat seated figures and staff." },
        { value: "quiet", label: "Quiet / empty", fragment: "Keep the scene calm and largely unpopulated, with at most one or two distant figures, for a serene, contemplative mood.", art: "Keep the scene almost empty, with at most one simple, silhouetted figure." },
        { value: "as-is-ent", label: "As is", fragment: "" },
      ],
    },
    weather: {
      label: "Weather",
      options: [
        { value: "as-is", label: "As is", fragment: "" },
        { value: "clear", label: "Clear sky", fragment: "Set a clear, bright sky of deep blue with excellent visibility and clean, crisp light.", art: "Render the sky as a flat plane of bright blue." },
        { value: "partly-cloudy", label: "Partly cloudy", fragment: "Set a partly cloudy sky with soft, scattered cumulus drifting across the blue, casting gentle moving shadows.", art: "Render the sky as a flat blue plane with a few simple cloud shapes." },
        { value: "overcast-w", label: "Overcast", fragment: "Set an even, overcast grey sky that diffuses the light softly across the whole scene.", art: "Render the sky as a flat, even grey plane." },
        { value: "dramatic-sky", label: "Dramatic clouds", fragment: "Set a dramatic, expressive sky with bold, sculptural cloud formations and shafts of breaking light.", art: "Render the sky as bold, simplified cloud shapes in strong tones." },
        { value: "golden-haze", label: "Golden haze", fragment: "Fill the air with a warm golden atmospheric haze that softens the distance and bathes the scene in glow.", art: "Wash the scene in a warm golden tone." },
        { value: "rain", label: "Rain / wet", fragment: "Set wet, rainy conditions with glistening reflective surfaces, puddles mirroring the building, and a fresh, washed atmosphere.", art: "Suggest rain with simple diagonal streak marks and a cool, muted palette." },
        { value: "storm", label: "Storm", fragment: "Set brooding stormy conditions with heavy dark clouds, dramatic breaking light, and a charged, atmospheric mood.", art: "Render a stormy sky as heavy, dark, simplified cloud shapes." },
        { value: "snow", label: "Snow", fragment: "Set a gentle snowfall with a soft blanket of snow on surfaces, drifting flakes, and a hushed, wintry calm.", art: "Suggest snow as flat white shapes on surfaces and scattered dots in the air." },
        { value: "fog", label: "Fog / mist", fragment: "Wrap the scene in soft fog and mist that fades the background into atmospheric depth and lends a quiet, moody air.", art: "Soften the background into a flat, pale haze." },
        { value: "mist-morning", label: "Morning mist", fragment: "Set a fresh early-morning mist hanging low across the scene, softening the distance with a tranquil dawn haze.", art: "Soften the distance into a flat, pale morning haze." },
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
      { value: "high", label: "High detail", fragment: "Output at high resolution with fine, sharp detail throughout.", art: "Produce it as a large, high-resolution artwork." },
      { value: "ultra", label: "Ultra / 4K", fragment: "Output at ultra-high 4K resolution with maximum sharpness, fine micro-detail, and a gallery-quality finish.", art: "Produce it as a very large, high-resolution artwork with crisp, clean edges." },
    ],
  },
};
