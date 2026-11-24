import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OVAS, ovaUrl } from "./data.js";

const canvas = document.getElementById("escena");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Soporte WebGL (el respaldo 2D llega en una etapa posterior) ---------- */
function hayWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}
if (!hayWebGL()) throw new Error("WebGL no disponible");

/* ---------- Elementos de la interfaz ---------- */
const ui = {
  pista: document.getElementById("pista"),
  tooltip: document.getElementById("tooltip"),
  ttTitulo: document.getElementById("tt-titulo"),
  ttAutor: document.getElementById("tt-autor"),
  tarjeta: document.getElementById("tarjeta"),
  num: document.getElementById("t-num"),
  titulo: document.getElementById("t-titulo"),
  autor: document.getElementById("t-autor"),
  resumen: document.getElementById("t-resumen"),
  abrir: document.getElementById("t-abrir"),
  cerrar: document.getElementById("t-cerrar")
};

/* ---------- Renderer, escena, cámara ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const VISTA_INICIAL = {
  pos: new THREE.Vector3(0, 30, 62),
  target: new THREE.Vector3(0, 0, 0)
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.copy(VISTA_INICIAL.pos);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 3;
controls.maxDistance = 140;
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 0.35;

/* ---------- Luces ---------- */
const luzAmbiente = new THREE.AmbientLight(0x8899ff, 0.35);
scene.add(luzAmbiente);
const luzNucleo = new THREE.PointLight(0xffffff, 2.4, 0, 1.2);
scene.add(luzNucleo);

/* ---------- Núcleo TGS ---------- */
function crearEtiqueta(texto) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  g.font = "700 96px system-ui, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#ffffff";
  g.shadowColor = "rgba(124,156,255,0.9)";
  g.shadowBlur = 24;
  g.fillText(texto, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(6, 6, 1);
  return sprite;
}

function crearResplandor() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(124,156,255,0.85)");
  grad.addColorStop(0.4, "rgba(124,156,255,0.25)");
  grad.addColorStop(1, "rgba(124,156,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  sprite.scale.set(22, 22, 1);
  return sprite;
}

const nucleo = new THREE.Group();
const esfera = new THREE.Mesh(
  new THREE.SphereGeometry(3, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0x3a4fd6 })
);
const malla = new THREE.Mesh(
  new THREE.IcosahedronGeometry(3.6, 1),
  new THREE.MeshBasicMaterial({ color: 0xa9bbff, wireframe: true, transparent: true, opacity: 0.55 })
);
const resplandor = crearResplandor();
nucleo.add(esfera, malla, resplandor, crearEtiqueta("TGS"));
scene.add(nucleo);

/* ---------- Estrellas / partículas de fondo ---------- */
function crearEstrellas(cantidad) {
  const pos = new Float32Array(cantidad * 3);
  for (let i = 0; i < cantidad; i++) {
    const r = 90 + Math.random() * 160;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false
  }));
}
const estrellas = crearEstrellas(1800);
scene.add(estrellas);

/* ---------- Planetas (uno por OVA) ---------- */
const planetas = [];
const hitMeshes = [];          // esferas invisibles más grandes: facilitan el clic y el toque
const orbitas = new THREE.Group();
scene.add(orbitas);

const matOrbita = new THREE.LineBasicMaterial({ color: 0x7c9cff, transparent: true, opacity: 0.12 });

OVAS.forEach((ova, i) => {
  const radio = 11 + i * 1.5;                       // órbitas concéntricas
  const color = new THREE.Color().setHSL(i / OVAS.length, 0.65, 0.58);
  const tamano = 0.7 + (i % 4) * 0.12;

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(tamano, 32, 32),
    new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.1, emissive: color, emissiveIntensity: 0.18 })
  );
  scene.add(mesh);

  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(tamano * 2.4, 12, 12),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  mesh.add(hit);

  // Anillo de la órbita
  const puntos = [];
  for (let a = 0; a <= 128; a++) {
    const t = (a / 128) * Math.PI * 2;
    puntos.push(new THREE.Vector3(Math.cos(t) * radio, 0, Math.sin(t) * radio));
  }
  orbitas.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(puntos),
    matOrbita
  ));

  const planeta = {
    ova,
    mesh,
    color,
    tamano,
    radio,
    angulo: (i / OVAS.length) * Math.PI * 2 + i,    // fase inicial distinta
    velocidad: 0.22 / Math.sqrt(radio / 11),         // más lejos = más lento
    inclinacion: ((i % 5) - 2) * 0.25,               // ligera variación vertical
    escala: 1,
    pausado: false
  };
  hit.userData.planeta = planeta;
  hitMeshes.push(hit);
  planetas.push(planeta);
});

/* ---------- Anillo que marca el planeta seleccionado ---------- */
function crearAnilloSeleccion() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  g.strokeStyle = "#ffffff";
  g.lineWidth = 5;
  g.beginPath();
  g.arc(64, 64, 56, 0, Math.PI * 2);
  g.stroke();
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c), transparent: true, depthTest: false, depthWrite: false
  }));
  sprite.renderOrder = 10;
  sprite.visible = false;
  return sprite;
}
const anillo = crearAnilloSeleccion();
scene.add(anillo);

/* ---------- Selección y vuelo de cámara ---------- */
let seleccion = null;
let hover = null;
let vuelo = null;

const easeInOutCubic = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

function iniciarVuelo(hacia, alTerminar) {
  vuelo = {
    t0: performance.now(),
    dur: reduceMotion ? 1 : 1400,
    desdePos: camera.position.clone(),
    desdeTarget: controls.target.clone(),
    haciaPos: hacia.pos,
    haciaTarget: hacia.target,
    alTerminar
  };
  controls.autoRotate = false;
  controls.enabled = false;
}

function destinoParaPlaneta(p) {
  const pos = p.mesh.position.clone();
  const fuera = new THREE.Vector3(pos.x, 0, pos.z).normalize();
  const distancia = 6 + p.tamano * 3;
  const offset = fuera.multiplyScalar(distancia).add(new THREE.Vector3(0, 2.2, 0));

  // Desplaza el encuadre para que el planeta no quede tapado por la tarjeta
  const adelante = offset.clone().negate().normalize();
  const derecha = new THREE.Vector3().crossVectors(adelante, new THREE.Vector3(0, 1, 0)).normalize();
  const escritorio = window.innerWidth > 700;
  const desplazamiento = escritorio
    ? derecha.multiplyScalar(2.6)          // planeta a la izquierda, tarjeta a la derecha
    : new THREE.Vector3(0, -1.8, 0);       // planeta arriba, tarjeta abajo

  return {
    pos: pos.clone().add(offset).add(desplazamiento),
    target: pos.clone().add(desplazamiento)
  };
}

function mostrarTarjeta(p) {
  const { ova, color } = p;
  ui.num.textContent = `OVA ${String(ova.id).padStart(2, "0")} / ${OVAS.length}`;
  ui.titulo.textContent = ova.titulo;
  ui.autor.textContent = `Por ${ova.nombre}`;
  ui.resumen.textContent = ova.resumen;
  ui.abrir.href = ovaUrl(ova);
  ui.tarjeta.style.setProperty("--planeta", `#${color.getHexString()}`);
  ui.tarjeta.dataset.open = "true";
  ui.pista.dataset.oculta = "true";
  // El foco se pide cuando la tarjeta ya es visible (un elemento oculto no lo recibe)
  setTimeout(() => {
    if (seleccion === p) ui.abrir.focus({ preventScroll: true });
  }, 700);
}

function ocultarTarjeta() {
  ui.tarjeta.dataset.open = "false";
}

function seleccionar(p) {
  if (seleccion && seleccion !== p) seleccion.pausado = false;
  seleccion = p;
  p.pausado = true;                       // el planeta elegido se detiene para poder leer
  mostrarTarjeta(p);
  iniciarVuelo(destinoParaPlaneta(p));
}

function deseleccionar() {
  if (!seleccion) return;
  seleccion.pausado = false;
  seleccion = null;
  ocultarTarjeta();
  iniciarVuelo(VISTA_INICIAL, () => { controls.autoRotate = !reduceMotion; });
}

ui.cerrar.addEventListener("click", deseleccionar);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") deseleccionar();
});

/* ---------- Puntero: hover y clic ---------- */
const raycaster = new THREE.Raycaster();
const puntero = new THREE.Vector2();
const ptr = { x: 0, y: 0, dentro: false, tipo: "mouse", arrastrando: false, down: null };

function actualizarPuntero(e) {
  const r = canvas.getBoundingClientRect();
  puntero.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  puntero.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  ptr.x = e.clientX;
  ptr.y = e.clientY;
}

function planetaBajoPuntero() {
  raycaster.setFromCamera(puntero, camera);
  const impactos = raycaster.intersectObjects(hitMeshes, false);
  return impactos.length ? impactos[0].object.userData.planeta : null;
}

function posicionarTooltip() {
  const t = ui.tooltip;
  const w = t.offsetWidth, h = t.offsetHeight;
  let x = ptr.x + 16, y = ptr.y + 16;
  if (x + w > window.innerWidth - 8) x = ptr.x - w - 16;
  if (y + h > window.innerHeight - 8) y = ptr.y - h - 16;
  t.style.transform = `translate(${Math.max(8, x)}px, ${Math.max(8, y)}px)`;
}

function aplicarHover(p) {
  if (p === hover) return;
  hover = p;
  canvas.style.cursor = p ? "pointer" : "";
  if (p && p !== seleccion) {
    ui.ttTitulo.textContent = p.ova.titulo;
    ui.ttAutor.textContent = p.ova.nombre;
    ui.tooltip.dataset.visible = "true";
    posicionarTooltip();
  } else {
    ui.tooltip.dataset.visible = "false";
  }
}

canvas.addEventListener("pointermove", (e) => {
  ptr.tipo = e.pointerType;
  ptr.dentro = true;
  actualizarPuntero(e);
  if (hover && ui.tooltip.dataset.visible === "true") posicionarTooltip();
});
canvas.addEventListener("pointerleave", () => { ptr.dentro = false; });
canvas.addEventListener("pointerdown", (e) => {
  ptr.arrastrando = true;
  ptr.down = { x: e.clientX, y: e.clientY, t: performance.now() };
});
canvas.addEventListener("pointercancel", () => { ptr.arrastrando = false; ptr.down = null; });
canvas.addEventListener("pointerup", (e) => {
  ptr.arrastrando = false;
  const d = ptr.down;
  ptr.down = null;
  if (!d) return;
  // Solo cuenta como clic si el puntero casi no se movió (si no, era un arrastre)
  const movimiento = Math.hypot(e.clientX - d.x, e.clientY - d.y);
  if (movimiento > 6 || performance.now() - d.t > 600) return;
  actualizarPuntero(e);
  const p = planetaBajoPuntero();
  if (p) seleccionar(p);
  else if (seleccion) deseleccionar();
});

/* ---------- Tema claro / oscuro ---------- */
const C = (hex) => new THREE.Color(hex);

// Valores de la escena 3D en cada tema; se interpolan para que el cambio sea suave
const PARAMS = {
  dark: {
    estrella: C(0xffffff), estrellaOp: 0.85,
    orbita: C(0x7c9cff), orbitaOp: 0.12,
    malla: C(0xa9bbff), mallaOp: 0.55,
    glowOp: 1,
    ambiente: 0.35, ambienteColor: C(0x8899ff),
    puntual: 2.4,
    emisivo: 0.18
  },
  light: {
    estrella: C(0x3b4690), estrellaOp: 0.4,
    orbita: C(0x3b4690), orbitaOp: 0.24,
    malla: C(0x1b2570), mallaOp: 0.5,
    glowOp: 0.5,
    ambiente: 1.0, ambienteColor: C(0xffffff),
    puntual: 2.2,
    emisivo: 0.06
  }
};

const tema = { actual: 0, objetivo: 0 };   // 0 = oscuro, 1 = claro
let emisivoBase = PARAMS.dark.emisivo;

function aplicarParametros(k) {
  const a = PARAMS.dark, b = PARAMS.light;
  const mezcla = (x, y) => x + (y - x) * k;

  estrellas.material.color.lerpColors(a.estrella, b.estrella, k);
  estrellas.material.opacity = mezcla(a.estrellaOp, b.estrellaOp);

  matOrbita.color.lerpColors(a.orbita, b.orbita, k);
  matOrbita.opacity = mezcla(a.orbitaOp, b.orbitaOp);

  malla.material.color.lerpColors(a.malla, b.malla, k);
  malla.material.opacity = mezcla(a.mallaOp, b.mallaOp);

  // El brillo aditivo no se ve sobre fondo claro: pasa a mezcla normal
  resplandor.material.opacity = mezcla(a.glowOp, b.glowOp);
  const modo = k > 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending;
  if (resplandor.material.blending !== modo) {
    resplandor.material.blending = modo;
    resplandor.material.needsUpdate = true;
  }

  luzAmbiente.intensity = mezcla(a.ambiente, b.ambiente);
  luzAmbiente.color.lerpColors(a.ambienteColor, b.ambienteColor, k);
  luzNucleo.intensity = mezcla(a.puntual, b.puntual);
  emisivoBase = mezcla(a.emisivo, b.emisivo);
}

function actualizarTema(dt) {
  if (tema.actual === tema.objetivo) return;
  const d = tema.objetivo - tema.actual;
  tema.actual = Math.abs(d) < 0.002 ? tema.objetivo : tema.actual + d * Math.min(1, dt * 5);
  aplicarParametros(tema.actual);
}

// El botón, la memoria y el tema del sistema los gestiona app.js;
// aquí solo se aplica el tema a la escena 3D.
let activo = true;     // false mientras se muestra la vista 2D
let rafId = 0;

export function setTema3d(t, instantaneo = false) {
  tema.objetivo = t === "light" ? 1 : 0;
  if (instantaneo || reduceMotion || !activo) {
    tema.actual = tema.objetivo;
    aplicarParametros(tema.actual);
  }
}
setTema3d(document.documentElement.dataset.theme === "light" ? "light" : "dark", true);

/* ---------- Animación ---------- */
const reloj = new THREE.Clock();

function animar() {
  if (!activo) return;
  const dt = Math.min(reloj.getDelta(), 0.05);
  const t = reloj.elapsedTime;

  if (!reduceMotion) {
    nucleo.rotation.y += dt * 0.25;
    malla.rotation.x += dt * 0.15;
    estrellas.rotation.y += dt * 0.004;
    const pulso = 1 + Math.sin(t * 1.6) * 0.03;
    esfera.scale.setScalar(pulso);
    planetas.forEach((p) => { if (!p.pausado) p.angulo += dt * p.velocidad; });
  }

  planetas.forEach((p) => {
    p.mesh.position.set(
      Math.cos(p.angulo) * p.radio,
      Math.sin(p.angulo * 2) * p.inclinacion,
      Math.sin(p.angulo) * p.radio
    );
    p.mesh.rotation.y += dt * 0.5;

    // Crecimiento suave al pasar el puntero o al seleccionar
    const objetivo = (p === hover || p === seleccion) ? 1.35 : 1;
    p.escala += (objetivo - p.escala) * Math.min(1, dt * 10);
    p.mesh.scale.setScalar(p.escala);
    p.mesh.material.emissiveIntensity = emisivoBase + (p.escala - 1) * 1.1;
  });

  // Hover (solo con mouse y sin arrastrar)
  const puedeHover = ptr.dentro && ptr.tipo !== "touch" && !ptr.arrastrando;
  aplicarHover(puedeHover ? planetaBajoPuntero() : null);

  // Anillo del planeta seleccionado
  if (seleccion) {
    anillo.visible = true;
    anillo.position.copy(seleccion.mesh.position);
    anillo.material.color.copy(seleccion.color);
    anillo.scale.setScalar(seleccion.tamano * 3.6 * (1 + Math.sin(t * 2.4) * 0.05));
  } else {
    anillo.visible = false;
  }

  // Vuelo de cámara
  if (vuelo) {
    const k = Math.min((performance.now() - vuelo.t0) / vuelo.dur, 1);
    const e = easeInOutCubic(k);
    camera.position.lerpVectors(vuelo.desdePos, vuelo.haciaPos, e);
    controls.target.lerpVectors(vuelo.desdeTarget, vuelo.haciaTarget, e);
    if (k >= 1) {
      const fin = vuelo.alTerminar;
      vuelo = null;
      controls.enabled = true;
      if (fin) fin();
    }
  }

  actualizarTema(dt);

  controls.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(animar);
}
animar();

/* ---------- Responsive ---------- */
function ajustarTamano() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", ajustarTamano);

/* ---------- Pausa (mientras se ve la vista 2D) ---------- */
function reiniciarVista() {
  if (seleccion) { seleccion.pausado = false; seleccion = null; }
  ocultarTarjeta();
  ptr.dentro = false;
  ptr.arrastrando = false;
  aplicarHover(null);
  vuelo = null;
  controls.enabled = true;
  camera.position.copy(VISTA_INICIAL.pos);
  controls.target.copy(VISTA_INICIAL.target);
  controls.autoRotate = !reduceMotion;
  controls.update();
}

export function pausar() {
  activo = false;
  cancelAnimationFrame(rafId);
  reiniciarVista();
}

export function reanudar() {
  if (activo) return;
  activo = true;
  ajustarTamano();
  reloj.getDelta();      // descarta el tiempo que estuvo en pausa
  animar();
}
