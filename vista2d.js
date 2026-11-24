// Vista 2D: lista de tarjetas con búsqueda. No depende de Three.js,
// así que funciona aunque la escena 3D no pueda cargarse.
import { OVAS, ovaUrl } from "./data.js";

const normalizar = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Mismo color que tiene el planeta en 3D (Three.js interpreta el HSL en espacio lineal)
function colorPlaneta(i, n) {
  const h = i / n, s = 0.65, l = 0.58;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const lineal = [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
  const aSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  return "#" + lineal
    .map((c) => Math.round(Math.min(1, Math.max(0, aSrgb(c))) * 255).toString(16).padStart(2, "0"))
    .join("");
}

function crear(tag, clase, texto) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

export function construirVista2d() {
  const lista = document.getElementById("lista");
  const buscar = document.getElementById("buscar");
  const contador = document.getElementById("contador");
  const vacio = document.getElementById("vacio");

  const items = OVAS.map((ova, i) => {
    const li = crear("li", "ova-card");
    li.style.setProperty("--planeta", colorPlaneta(i, OVAS.length));
    li.style.setProperty("--i", i);

    const enlace = crear("a", "boton");
    enlace.href = ovaUrl(ova);
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.append("Abrir OVA ");
    const flecha = crear("span", "", "↗");
    flecha.setAttribute("aria-hidden", "true");
    enlace.append(flecha);
    enlace.setAttribute("aria-label", `Abrir OVA: ${ova.titulo}, por ${ova.nombre}`);

    li.append(
      crear("span", "num", `OVA ${String(ova.id).padStart(2, "0")}`),
      crear("h2", "", ova.titulo),
      crear("p", "autor", `Por ${ova.nombre}`),
      crear("p", "resumen", ova.resumen),
      enlace
    );
    lista.append(li);

    return { li, texto: normalizar(`${ova.titulo} ${ova.nombre} ${ova.resumen}`) };
  });

  function filtrar() {
    const consulta = normalizar(buscar.value.trim());
    let visibles = 0;
    items.forEach(({ li, texto }) => {
      const coincide = !consulta || consulta.split(/\s+/).every((palabra) => texto.includes(palabra));
      li.hidden = !coincide;
      if (coincide) visibles++;
    });
    contador.textContent = visibles === items.length
      ? `${items.length} OVAs`
      : `${visibles} de ${items.length} OVAs`;
    vacio.hidden = visibles > 0;
  }

  buscar.addEventListener("input", filtrar);
  filtrar();
}
