import { beforeEach, describe, expect, it, vi } from "vitest";

const { createMock, saveMock, getRepositoryMock } = vi.hoisted(() => {
  const createMock = vi.fn();
  const saveMock = vi.fn();
  const getRepositoryMock = vi.fn(() => ({
    create: createMock,
    save: saveMock,
  }));

  return { createMock, saveMock, getRepositoryMock };
});

vi.mock("../src/config/database", () => ({
  AppDataSource: {
    getRepository: getRepositoryMock,
  },
}));

import { SesionCalificacionService } from "../src/services/sesion-calificacion.service";

describe("SesionCalificacionService", () => {
  beforeEach(() => {
    createMock.mockReset();
    saveMock.mockReset();
    getRepositoryMock.mockClear();
  });

  it("normaliza y guarda una sesión de calificación", async () => {
    const service = new SesionCalificacionService();
    const input = {
      estudiante: "Ana",
      tema: "Figuras",
      actividad: "act-1",
      puntaje: 8,
      totalPreguntas: 10,
    };

    const normalized = {
      estudiante: "Ana",
      tema: "Figuras",
      actividad: "act-1",
      puntaje: 8,
      totalPreguntas: 10,
    };
    const saved = { id: "session-1", createdAt: new Date("2026-06-02T00:00:00.000Z"), ...normalized };

    createMock.mockReturnValue(normalized);
    saveMock.mockResolvedValue(saved);

    const result = await service.createSesionCalificacion(input);

    expect(getRepositoryMock).toHaveBeenCalled();
    expect(createMock).toHaveBeenCalledWith({
      estudiante: "Ana",
      tema: "Figuras",
      actividad: "act-1",
      puntaje: 8,
      totalPreguntas: 10,
    });
    expect(saveMock).toHaveBeenCalledWith(normalized);
    expect(result).toEqual(saved);
  });

  it("convierte campos opcionales faltantes a null", async () => {
    const service = new SesionCalificacionService();
    const input = {
      puntaje: 5,
      totalPreguntas: 7,
    };

    createMock.mockReturnValue({
      estudiante: null,
      tema: null,
      actividad: null,
      puntaje: 5,
      totalPreguntas: 7,
    });
    saveMock.mockResolvedValue({ id: "session-2", createdAt: new Date(), puntaje: 5, totalPreguntas: 7 });

    await service.createSesionCalificacion(input);

    expect(createMock).toHaveBeenCalledWith({
      estudiante: null,
      tema: null,
      actividad: null,
      puntaje: 5,
      totalPreguntas: 7,
    });
  });
});
