// Ficha técnica: un panel (<dialog>) que se llena con los datos de FICHA en data.js.
// No depende de Three.js, así que funciona en ambas vistas.
import { FICHA } from "./data.js";

function crear(tag, clase, texto) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function seccion(titulo, ...contenido) {
  const s = crear("section", "f-seccion");
  s.append(crear("h3", "", titulo), ...contenido);
  return s;
}

const COMO_USAR = [
  "Vista 3D: arrastra para girar, usa la rueda (o pellizca) para acercar y haz clic en un planeta para ver el resumen de ese OVA.",
  "Vista 2D: lista de tarjetas con buscador por tema o autor. Se activa sola si el 3D no está disponible.",
  "Botón 2D/3D cambia de vista; el de sol o luna cambia entre modo claro y oscuro.",
  "«Abrir OVA» lleva al OVA original de cada compañero, en una pestaña nueva."
];

export function construirFicha() {
  const dialogo = document.getElementById("ficha");
  const cuerpo = document.getElementById("f-cuerpo");
  const abrir = document.getElementById("btn-ficha");
  const cerrar = document.getElementById("f-cerrar");

  const f = FICHA;
  const lleno = (v) => typeof v === "string" && v.trim() !== "";

  cuerpo.append(crear("h2", "", "Ficha técnica"));
  cuerpo.lastChild.id = "f-titulo";
  if (lleno(f.titulo)) cuerpo.append(crear("p", "f-sub", f.titulo));

  // Datos generales (solo los que tengan valor)
  const datos = [
    ["Tema", f.tema],
    ["Autor", f.autor],
    ["Asignatura", f.asignatura],
    ["Docente", f.docente],
    ["Periodo", f.periodo],
    ["Universidad", [f.universidad, f.campus].filter(lleno).join(" · ")],
    ["Fecha", f.fecha]
  ].filter(([, v]) => lleno(v));
  if (datos.length) {
    const dl = crear("dl", "f-datos");
    datos.forEach(([k, v]) => dl.append(crear("dt", "", k), crear("dd", "", v)));
    cuerpo.append(dl);
  }

  if (lleno(f.objetivo)) cuerpo.append(seccion("Objetivo del portal", crear("p", "", f.objetivo)));

  cuerpo.append(seccion("Cómo usarlo", (() => {
    const ul = crear("ul");
    COMO_USAR.forEach((t) => ul.append(crear("li", "", t)));
    return ul;
  })()));

  if (f.sistema) {
    const etiquetas = [
      ["Entradas", f.sistema.entradas],
      ["Proceso", f.sistema.proceso],
      ["Salidas", f.sistema.salidas],
      ["Entorno", f.sistema.entorno],
      ["Retroalimentación", f.sistema.retroalimentacion]
    ].filter(([, v]) => lleno(v));
    if (etiquetas.length) {
      const dl = crear("dl", "f-datos");
      etiquetas.forEach(([k, v]) => dl.append(crear("dt", "", k), crear("dd", "", v)));
      cuerpo.append(seccion("El portal como sistema", dl));
    }
  }

  if (f.tecnologias && f.tecnologias.length) {
    cuerpo.append(seccion("Tecnologías", crear("p", "", f.tecnologias.join(" · "))));
  }

  if (lleno(f.declaracionIA)) cuerpo.append(seccion("Declaración de uso de inteligencia artificial", crear("p", "", f.declaracionIA)));

  if (f.referencias && f.referencias.length) {
    const ul = crear("ul");
    f.referencias.forEach((r) => {
      const li = crear("li");
      li.append(r.texto);
      if (r.url) {
        li.append(" ");
        const a = crear("a", "", r.url);
        a.href = r.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        li.append(a);
      }
      ul.append(li);
    });
    cuerpo.append(seccion("Referencias y créditos", ul));
  }

  abrir.addEventListener("click", () => {
    if (typeof dialogo.showModal === "function") dialogo.showModal();
    else dialogo.setAttribute("open", "");       // navegadores sin <dialog> modal
  });
  cerrar.addEventListener("click", () => dialogo.close());
  // Clic en el fondo oscuro (fuera del panel) también cierra
  dialogo.addEventListener("click", (e) => { if (e.target === dialogo) dialogo.close(); });
}
