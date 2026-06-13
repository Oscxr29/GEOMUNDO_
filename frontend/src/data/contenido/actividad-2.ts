import type { ContenidoActividad } from "./index";

export const contenidoActividad2: ContenidoActividad = {
  actividadSlug: "triangulos-y-cuadrilateros",
  titulo: "Triángulos y cuadriláteros",
  secciones: [
    {
      titulo: "Analiza",
      texto: "Observa las figuras formadas por segmentos de recta unidos en sus extremos.",
    },
    {
      titulo: "Comprende",
      texto: "La figura formada por 3 segmentos de recta se llama triángulo. La figura formada por 4 segmentos de recta se llama cuadrilátero.",
      imagen: "/contenido/actividad-2/comprende.png",
      pieImagen: "Ejemplos de triángulo y cuadrilátero.",
      items: [
        "Un triángulo tiene exactamente 3 lados.",
        "Un cuadrilátero tiene exactamente 4 lados.",
        "Los lados son segmentos que se unen por sus extremos.",
      ],
    },
    {
      titulo: "Resuelve",
      texto: "Ahora pon a prueba lo que aprendiste. Responde las preguntas sobre triángulos y cuadriláteros.",
    },
  ],
};
