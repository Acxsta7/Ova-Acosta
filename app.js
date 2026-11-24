// Orquestador: tema claro/oscuro, vista 3D/2D y carga de la escena 3D bajo demanda.
// Esta parte no depende de Three.js: si el 3D falla, la página sigue funcionando en 2D.
import { construirVista2d } from "./vista2d.js";
import { construirFicha } from "./ficha.js";

const raiz = document.documentElement;
const $ = (id) => document.getElementById(id);
const btnTema = $("btn-tema");
const btnVista = $("btn-vista");
const cargando = $("cargando");
const aviso = $("aviso");

const CLAVE_TEMA = "ova-tgs-tema";
const CLAVE_VISTA = "ova-tgs-vista";

let motor3d = null;      // módulo main.js, una vez cargado
let cargaPromesa = null;
let temporizadorAviso = 0;

const leer = (clave) => { try { return localStorage.getItem(clave); } catch { return null; } };
const guardar = (clave, valor) => { try { localStorage.setItem(clave, valor); } catch { /* sin almacenamiento */ } };

/* ---------- Tema claro / oscuro ---------- */
function fijarTema(t, { persistir = false } = {}) {
  raiz.dataset.theme = t;
  const etiqueta = t === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
  btnTema.setAttribute("aria-label", etiqueta);
  btnTema.title = etiqueta;
  if (persistir) guardar(CLAVE_TEMA, t);
  if (motor3d) motor3d.setTema3d(t);
}

btnTema.addEventListener("click", () => {
  fijarTema(raiz.dataset.theme === "light" ? "dark" : "light", { persistir: true });
});

// Mientras la persona no elija, la página sigue el tema del sistema
const mqClaro = window.matchMedia("(prefers-color-scheme: light)");
if (mqClaro.addEventListener) {
  mqClaro.addEventListener("change", (e) => {
    const guardado = leer(CLAVE_TEMA);
    if (guardado !== "light" && guardado !== "dark") fijarTema(e.matches ? "light" : "dark");
  });
}

/* ---------- Aviso ---------- */
function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { aviso.hidden = true; }, 9000);
}

/* ---------- Carga de la escena 3D ---------- */
function hayWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

function asegurar3d() {
  if (!cargaPromesa) {
    cargaPromesa = (async () => {
      if (!hayWebGL()) throw new Error("WebGL no disponible");
      cargando.dataset.visible = "true";
      try {
        motor3d = await import("./main.js");
        motor3d.setTema3d(raiz.dataset.theme);
        return true;
      } finally {
        cargando.dataset.visible = "false";
      }
    })().catch((err) => {
      console.error("La vista 3D no está disponible:", err);
      btnVista.hidden = true;
      mostrarAviso("No se pudo iniciar la vista 3D en este dispositivo. Te mostramos la versión 2D, con los mismos 22 OVAs.");
      return false;
    });
  }
  return cargaPromesa;
}

/* ---------- Vista 3D / 2D ---------- */
async function fijarVista(v, { persistir = false } = {}) {
  btnVista.disabled = true;
  if (v === "3d" && !(await asegurar3d())) v = "2d";

  raiz.dataset.vista = v;
  const aVista2d = v === "3d";   // el botón ofrece la vista contraria a la actual
  btnVista.textContent = aVista2d ? "2D" : "3D";
  const etiqueta = aVista2d ? "Cambiar a vista 2D (lista de OVAs)" : "Cambiar a vista 3D (sistema solar)";
  btnVista.setAttribute("aria-label", etiqueta);
  btnVista.title = etiqueta;

  if (v === "3d") motor3d.reanudar();
  else if (motor3d) motor3d.pausar();

  if (persistir) guardar(CLAVE_VISTA, v);
  btnVista.disabled = false;
}

btnVista.addEventListener("click", () => {
  fijarVista(raiz.dataset.vista === "3d" ? "2d" : "3d", { persistir: true });
});

/* ---------- Inicio ---------- */
construirVista2d();
construirFicha();
fijarTema(raiz.dataset.theme === "light" ? "light" : "dark");
fijarVista(raiz.dataset.vista === "2d" ? "2d" : "3d");
