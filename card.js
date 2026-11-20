const card = document.querySelector('.card');
const front = card.querySelector('.card__front');
const back = card.querySelector('.card__back img');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const artwork = (side) => new URL(`더블제로-마우스호버-${side}.svg`.normalize('NFD'), import.meta.url);

let ready = false;
let hovered = false;
let toggled = false;

function updateFace() {
  card.setAttribute('aria-pressed', String(ready && (hovered || toggled)));
}

card.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'touch') return;
  hovered = true;
  updateFace();
});

card.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'touch') return;
  hovered = false;
  toggled = false;
  updateFace();
});

card.addEventListener('click', (event) => {
  if (event.pointerType === 'mouse') return;
  toggled = !toggled;
  updateFace();
});

function reveal(svg) {
  const field = svg.querySelector(':scope > rect.st2');
  const lines = [...svg.querySelectorAll(':scope > line')].sort((a, b) =>
    Number(a.getAttribute('y1')) - Number(b.getAttribute('y1'))
  );
  const graphic = [...svg.querySelectorAll(':scope > path, :scope > g')];

  const animate = (element, delay, duration) => element.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { delay, duration, easing: 'ease-out', fill: 'backwards' }
  ).finished;

  return Promise.all([
    ...[field, ...lines].map((element, index) => animate(element, 300 + index * 36, 190)),
    ...graphic.map((element, index) => animate(element, 920 + index * 64, 260)),
  ]);
}

async function initialize() {
  back.src = artwork('02');
  const [response] = await Promise.all([fetch(artwork('01')), back.decode()]);
  if (!response.ok) throw new Error(`SVG 01: HTTP ${response.status}`);

  const artworkDocument = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
  const svg = artworkDocument.documentElement;
  if (svg.localName !== 'svg') throw new Error('Invalid SVG 01');

  // Keep Illustrator's class names and styles local to the original artwork.
  const shadow = front.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = 'svg { display: block; width: 100%; height: 100%; }';
  shadow.append(style, svg);
  front.dataset.loaded = '';

  if (!reducedMotion.matches) {
    await reveal(svg);
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  hovered ||= matchMedia('(hover: hover)').matches && card.matches(':hover');
  ready = true;
  card.disabled = false;
  updateFace();
}

initialize().catch((error) => {
  console.error(error);
  document.querySelector('.load-error').hidden = false;
});
