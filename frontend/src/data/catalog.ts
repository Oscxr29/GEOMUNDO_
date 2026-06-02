export type ActivityContent = {
  id: string;
  title: string;
  description: string;
  level: number;
  duration: string;
  objective: string;
  checkpoints: string[];
};

export type ThemeContent = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  duration: string;
  level: string;
  focus: string;
  activities: ActivityContent[];
};

export const themeCatalog: ThemeContent[] = [
  {
    id: "1",
    title: "Figuras planas",
    subtitle: "Reconoce, clasifica y compara formas básicas.",
    description: "Identifica figuras como círculo, triángulo, cuadrado y rectángulo con ejemplos del entorno.",
    icon: "◼",
    duration: "10 min",
    level: "Inicial",
    focus: "Percepción visual y clasificación",
    activities: [
      {
        id: "1-1",
        title: "Detecta la figura correcta",
        description: "Mira varias imágenes y elige la figura que corresponde.",
        level: 1,
        duration: "3 min",
        objective: "Reconocer patrones visuales y nombrar figuras comunes.",
        checkpoints: ["Identifica lados", "Reconoce vértices", "Relaciona forma con nombre"],
      },
      {
        id: "1-2",
        title: "Clasifica por características",
        description: "Agrupa las figuras según su cantidad de lados o curvas.",
        level: 1,
        duration: "4 min",
        objective: "Comparar figuras usando características simples.",
        checkpoints: ["Cuenta lados", "Distingue curvas y ángulos", "Ordena por similitud"],
      },
    ],
  },
  {
    id: "2",
    title: "Perímetro",
    subtitle: "Suma lados para descubrir cuánto mide alrededor.",
    description: "Calcula perímetros con ejemplos sencillos y ejercicios prácticos de medición básica.",
    icon: "⟐",
    duration: "12 min",
    level: "Básico",
    focus: "Medición y suma",
    activities: [
      {
        id: "2-1",
        title: "Suma los lados",
        description: "Resuelve sumas cortas para obtener el perímetro de cada figura.",
        level: 2,
        duration: "4 min",
        objective: "Aplicar la suma para medir bordes de figuras.",
        checkpoints: ["Suma lados", "Identifica unidades", "Verifica resultado"],
      },
      {
        id: "2-2",
        title: "Perímetro en objetos reales",
        description: "Relaciona figuras con objetos cotidianos y estima su borde.",
        level: 2,
        duration: "5 min",
        objective: "Conectar la geometría con contextos cercanos del estudiante.",
        checkpoints: ["Observa objetos", "Estima medidas", "Justifica respuesta"],
      },
    ],
  },
  {
    id: "3",
    title: "Área",
    subtitle: "Descubre el espacio que ocupa una superficie.",
    description: "Explora el área con cuadriculas y figuras sencillas para entender la diferencia con el perímetro.",
    icon: "▣",
    duration: "12 min",
    level: "Básico",
    focus: "Comparación de superficies",
    activities: [
      {
        id: "3-1",
        title: "Cuenta cuadrados",
        description: "Observa figuras cuadriculadas y cuenta los cuadros internos.",
        level: 2,
        duration: "4 min",
        objective: "Entender el concepto de área como conteo de unidades.",
        checkpoints: ["Cuenta cuadritos", "Compara tamaños", "Evita confundir con perímetro"],
      },
      {
        id: "3-2",
        title: "Compara superficies",
        description: "Decide cuál figura ocupa más espacio y explica por qué.",
        level: 3,
        duration: "4 min",
        objective: "Desarrollar razonamiento visual y comparación.",
        checkpoints: ["Comparar áreas", "Argumentar decisión", "Elegir la opción correcta"],
      },
    ],
  },
  {
    id: "4",
    title: "Ángulos",
    subtitle: "Observa giros, esquinas y direcciones.",
    description: "Aprende a reconocer ángulos en el entorno y en figuras geométricas sencillas.",
    icon: "∠",
    duration: "10 min",
    level: "Intermedio",
    focus: "Orientación y comparación visual",
    activities: [
      {
        id: "4-1",
        title: "Identifica el ángulo",
        description: "Selecciona el tipo de ángulo que ves en cada imagen.",
        level: 2,
        duration: "3 min",
        objective: "Reconocer ángulos según su apertura.",
        checkpoints: ["Identifica apertura", "Distingue agudo y recto", "Relaciona con objetos"],
      },
      {
        id: "4-2",
        title: "Ángulos en la vida diaria",
        description: "Busca objetos del aula o casa que representen ángulos.",
        level: 3,
        duration: "4 min",
        objective: "Vincular geometría con observación del entorno.",
        checkpoints: ["Observa contexto", "Describe el giro", "Da un ejemplo"],
      },
    ],
  },
];

export function getThemeById(themeId: string) {
  return themeCatalog.find((theme) => theme.id === themeId);
}

export function getActivityByThemeId(themeId: string) {
  const theme = getThemeById(themeId);
  return theme?.activities[0];
}
