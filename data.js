// Datos de los 22 OVAs del curso de Teoría General de Sistemas.
// La URL final se arma como: BASE_URL + carpeta + "/"

export const BASE_URL = "https://acxsta7.github.io/ovas-tgs/ovas/";

export const ovaUrl = (ova) => `${BASE_URL}${ova.carpeta}/`;

export const OVAS = [
  {
    id: 1,
    nombre: "Kevin Blanco",
    carpeta: "blanco-kevin",
    titulo: "Definiciones de sistema",
    resumen: "Parte de la pregunta ¿qué es un sistema? y recorre sus definiciones, sus componentes comunes (entradas, salidas, entorno) y ejemplos aplicados a casos reales."
  },
  {
    id: 2,
    nombre: "Manuel Cárdenas",
    carpeta: "cardenas-manuel",
    titulo: "Clasificación y características de los sistemas",
    resumen: "Explica de forma breve y sencilla por qué se clasifican los sistemas, cuáles son sus principales clasificaciones y características, con ejemplos reales."
  },
  {
    id: 3,
    nombre: "Julián Crasto",
    carpeta: "crasto-julian",
    titulo: "Entrada, proceso, salida y retroalimentación",
    resumen: "Muestra cómo funciona una empresa como sistema usando el caso de Transportar Carga S.A.S.: sus entradas, procesos, salidas y retroalimentación."
  },
  {
    id: 4,
    nombre: "Brehily Cruz",
    carpeta: "cruz-brehily",
    titulo: "Tipos de sistemas",
    resumen: "Diferencia los sistemas estáticos, dinámicos y adaptativos, explica cómo se relacionan y combinan, y suma videos de apoyo."
  },
  {
    id: 5,
    nombre: "Camilo Fuentes",
    carpeta: "fuentes-camilo",
    titulo: "Parámetros de los sistemas",
    resumen: "Presenta los parámetros de un sistema, la homeostasis y el equilibrio, con preguntas, ejercicios prácticos, juegos interactivos y videos."
  },
  {
    id: 6,
    nombre: "Gabriela Garavito",
    carpeta: "garavito-gabriela",
    titulo: "Propiedades de los sistemas",
    resumen: "Recorre las 8 propiedades de los sistemas con un laboratorio interactivo y actividades de relacionar conceptos mientras sumas puntos."
  },
  {
    id: 7,
    nombre: "Brayhan Gómez",
    carpeta: "gomez-brayhan",
    titulo: "Laboratorio del Caos",
    resumen: "Un laboratorio interactivo sobre el caos en los sistemas, con videos, fuentes, ficha técnica y declaración del uso de IA."
  },
  {
    id: 8,
    nombre: "Jesús Guerrero",
    carpeta: "guerrero-jesus",
    titulo: "Orígenes y principios de la TGS",
    resumen: "Cuenta de dónde surge la Teoría General de Sistemas y cuáles son sus principios, con contexto, justificación y referencias."
  },
  {
    id: 9,
    nombre: "Emanuel Hernández",
    carpeta: "hernandez-emanuel",
    titulo: "Conexiones",
    resumen: "Bajo la idea de que todo está conectado, explica los conceptos fundamentales de la TGS y la clasificación de sistemas con el caso de una plataforma de pedidos de cafetería."
  },
  {
    id: 10,
    nombre: "Brayan Jiménez",
    carpeta: "jimenez-brayan",
    titulo: "Enfoques de la TGS",
    resumen: "Contrasta el enfoque reduccionista con el sistémico y el análisis con la síntesis, mirando un mismo caso con dos lentes, con juegos y evaluación."
  },
  {
    id: 11,
    nombre: "Camilo Lindarte",
    carpeta: "lindarte-camilo",
    titulo: "El enfoque sistémico",
    resumen: "Define el enfoque sistémico, desarrolla sus conceptos clave y lo aplica a casos reales."
  },
  {
    id: 12,
    nombre: "Fernando Mendoza",
    carpeta: "mendoza-fernando",
    titulo: "Teoría de comportamientos",
    resumen: "Presenta los fundamentos de la teoría de comportamientos, sus autores y aportes principales, y sus aplicaciones."
  },
  {
    id: 13,
    nombre: "Sharon Merchán",
    carpeta: "merchan-sharon",
    titulo: "INFO VERSE · Teoría de la información",
    resumen: "Un universo para aprender los conceptos de la teoría de la información, el modelo de Shannon y Weaver y su presencia en el mundo real."
  },
  {
    id: 14,
    nombre: "Joel Ortiz",
    carpeta: "ortiz-joel",
    titulo: "Teoría de colas",
    resumen: "Introduce la teoría de colas con sus conceptos clave, el modelo M/M/1 y un video de apoyo."
  },
  {
    id: 15,
    nombre: "Yorman Pabón",
    carpeta: "pabon-yorman",
    titulo: "Cibernética y teoría de la organización",
    resumen: "Recorre dos temas con páginas informativas, retratos de autores, cuatro juegos prácticos con retroalimentación y un quiz final."
  },
  {
    id: 16,
    nombre: "Marlon Parada",
    carpeta: "parada-marlon",
    titulo: "Organizaciones que aprenden",
    resumen: "Explica la disciplina y las organizaciones inteligentes de Peter Senge, con su marco conceptual y las leyes de la quinta disciplina."
  },
  {
    id: 17,
    nombre: "Daniela Pedroza",
    carpeta: "pedroza-daniela",
    titulo: "Modelos en dinámica de sistemas",
    resumen: "Enseña paso a paso la metodología para crear modelos en dinámica de sistemas, con un caso de inventario de cafetería y un simulador."
  },
  {
    id: 18,
    nombre: "Camilo Ramírez",
    carpeta: "ramirez-camilo",
    titulo: "Entropía y neguentropía",
    resumen: "Explora el pulso vital del orden sistémico con el modelo E-P-S-R, un taller de clasificación de fenómenos y las leyes y principios de la entropía."
  },
  {
    id: 19,
    nombre: "Jesús David Ramírez",
    carpeta: "ramirez-jesusdavid",
    titulo: "Sistemas blandos de Checkland",
    resumen: "Cuando el problema no tiene forma: las siete etapas de la metodología de Checkland, CATWOE, la definición raíz PQR y las tres E."
  },
  {
    id: 20,
    nombre: "Anthony Renna",
    carpeta: "renna-anthony",
    titulo: "Modelo de Sistema Viable",
    resumen: "Presenta el Modelo de Sistema Viable de Stafford Beer y sus cinco sistemas con el ejemplo práctico de una universidad."
  },
  {
    id: 21,
    nombre: "Julián Romero",
    carpeta: "romero-julian",
    titulo: "Autopoiesis y sistemas vivos",
    resumen: "Explica la autopoiesis de Maturana y Varela, la diferencia entre autopoiesis y alopoiesis y sus analogías en casos reales."
  },
  {
    id: 22,
    nombre: "Adrián Rueda",
    carpeta: "rueda-adrian",
    titulo: "TGS aplicada a los sistemas de información",
    resumen: "Conoce la TGS, su historia y origen, y sus características aplicadas a los sistemas de información y la ingeniería de sistemas."
  }
];

/* ---------------------------------------------------------------
   Ficha técnica del portal (se muestra en el botón "i").
   Los campos vacíos ("") o null NO se muestran: llénalos cuando los tengas.
   --------------------------------------------------------------- */
export const FICHA = {
  titulo: "OVA TGS · Recopilación de los OVAs de Teoría General de Sistemas",
  tema: "Recopilación de los 22 OVAs del curso",
  autor: "Elibardo Acosta Contreras",
  universidad: "Universidad Simón Bolívar",
  campus: "Campus Cúcuta",
  asignatura: "Teoría General de Sistemas",
  docente: "Ing. Eddy Marlene Ortiz Ramirez",
  periodo: "II semestre de 2026",
  fecha: "Noviembre de 2026",

  objetivo:
    "Reunir en un solo lugar los 22 OVAs de Teoría General de Sistemas del curso, con un resumen y el enlace de cada uno, " +
    "para explorarlos de forma ordenada, visual e interactiva: un sistema solar donde cada planeta es un OVA y el núcleo es la TGS.",

  // Mirada sistémica del propio portal (borra el bloque o ponlo en null para ocultarlo)
  sistema: {
    entradas: "Los 22 OVAs de los compañeros, con su título, autor y contenido.",
    proceso: "Recopilación, resumen y organización de cada OVA en una escena 3D y en una lista 2D.",
    salidas: "Un portal navegable con resumen y enlace directo a cada OVA.",
    entorno: "El navegador de la persona, GitHub Pages, la biblioteca Three.js y los OVAs originales.",
    retroalimentacion: "La búsqueda, la selección de planetas y la elección de vista y de tema ajustan lo que se ve."
  },

  tecnologias: ["HTML5", "CSS3", "JavaScript (módulos ES)", "Three.js r160 (escena 3D)"],

  declaracionIA:
    "Este portal se desarrolló con la asistencia de Claude, un modelo de inteligencia artificial de Anthropic, que ayudó a escribir " +
    "y depurar el código (HTML, CSS y JavaScript) y a redactar los resúmenes de cada OVA a partir de su contenido. " +
    "La idea, el diseño general, la selección de contenidos y la revisión final son del autor.",

  referencias: [
    { texto: "Three.js (r160): biblioteca de gráficos 3D para la web. Licencia MIT.", url: "https://threejs.org" },
    { texto: "Cada OVA enlazado pertenece a su autor, estudiante de Teoría General de Sistemas de la Universidad Simón Bolívar, Campus Cúcuta." },
    { texto: "Logotipo de la Universidad Simón Bolívar, tomado de los OVAs del curso." }
  ]
};
