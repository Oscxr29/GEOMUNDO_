import type { ContenidoActividad } from "./index";

export const contenidoActividad1: ContenidoActividad = {
  actividadSlug: "segmentos-y-figuras",
  titulo: "Segmentos y figuras",
  secciones: [
    {
      titulo: "Analiza",
      texto: "Observa la imagen. La calle por donde pasa la motocicleta representa una línea recta. El camino de la casa de Antonio a la casa de Marta representa un segmento.",
      imagen: "/contenido/actividad-1/analiza.png",
      pieImagen: "Una calle recta y el camino entre dos casas.",
    },
    {
      titulo: "Comprende",
      texto: "La línea recta limitada por dos puntos se llama segmento. Para trazar un segmento debes colocar dos puntos y trazar la línea recta que los una.",
      imagen: "/contenido/actividad-1/comprende.png",
      pieImagen: "Segmento AB — limitado por los puntos A y B.",
      items: [
        "Un segmento tiene exactamente dos puntos extremos.",
        "Se nombra con las letras de sus puntos: segmento AB.",
        "Es la parte de una línea recta entre dos puntos.",
      ],
    },
    {
      titulo: "Resuelve",
      texto: "Ahora pon a prueba lo que aprendiste. Responde las preguntas sobre segmentos.",
    },
  ],
};
