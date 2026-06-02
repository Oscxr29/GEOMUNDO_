import { describe, expect, it, vi } from "vitest";
import { SesionCalificacionController } from "../src/controllers/sesion-calificacion.controller";

describe("SesionCalificacionController", () => {
  it("responde 400 cuando faltan puntaje o totalPreguntas", async () => {
    const service = {
      createSesionCalificacion: vi.fn(),
    } as any;
    const controller = new SesionCalificacionController(service);
    const req = { body: { puntaje: 4 } } as any;
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res = { status } as any;

    await controller.createSesionCalificacion(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Puntaje y totalPreguntas son obligatorios" });
    expect(service.createSesionCalificacion).not.toHaveBeenCalled();
  });

  it("responde 201 y devuelve el registro creado", async () => {
    const created = {
      id: "session-3",
      estudiante: "Luis",
      tema: "Ángulos",
      actividad: "act-2",
      puntaje: 9,
      totalPreguntas: 10,
    };
    const service = {
      createSesionCalificacion: vi.fn().mockResolvedValue(created),
    } as any;
    const controller = new SesionCalificacionController(service);
    const req = {
      body: {
        estudiante: "Luis",
        tema: "Ángulos",
        actividad: "act-2",
        puntaje: 9,
        totalPreguntas: 10,
      },
    } as any;
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res = { status } as any;

    await controller.createSesionCalificacion(req, res);

    expect(service.createSesionCalificacion).toHaveBeenCalledWith(req.body);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ data: created });
  });
});
