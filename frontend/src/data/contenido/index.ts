export interface SeccionContenido {
  titulo: string;           // "Analiza", "Comprende", "Resuelve"
  texto: string;            // Explicación principal de la sección
  imagen?: string;          // Ruta desde /public, ej: "/contenido/actividad-1/comprende.webp"
  pieImagen?: string;       // Texto debajo de la imagen (opcional)
  items?: string[];         // Lista de puntos clave (opcional)
}

export interface ContenidoActividad {
  actividadSlug: string;    // Identificador legible, ej: "segmentos-y-figuras"
  titulo: string;           // Igual al nombre de la actividad en DB
  secciones: SeccionContenido[];
}

import { contenidoActividad1 } from "./actividad-1";
import { contenidoActividad2 } from "./actividad-2";
import { contenidoActividad3 } from "./actividad-3";
import { contenidoActividad4 } from "./actividad-4";
import { contenidoActividad5 } from "./actividad-5";
import { contenidoActividad6 } from "./actividad-6";
import { contenidoActividad7 } from "./actividad-7";
import { contenidoActividad8 } from "./actividad-8";

export const CONTENIDO_POR_NOMBRE: Record<string, ContenidoActividad> = {
  "Segmentos y figuras":                       contenidoActividad1,
  "Triángulos y cuadriláteros":                contenidoActividad2,
  "Lados, vértices y ángulos":                 contenidoActividad3,
  "Figuras compuestas":                        contenidoActividad4,
  "Superficies planas y curvas":               contenidoActividad5,
  "Elementos de la caja: cara, arista y vértice": contenidoActividad6,
  "Cuenta los elementos de una caja":          contenidoActividad7,
  "Repaso de figuras y cuerpos":               contenidoActividad8,
};
