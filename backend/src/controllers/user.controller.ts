import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/user.interface";


export class UserController {
    
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getAllUsers(req: Request, res: Response) {

        const users = await this.userService.getAllUsers();

        res.status(200).json({
            data: users,
        });
    }

    async getUserById(req: Request, res: Response) {

        const id = req.params.id;

        if (typeof id !== "string" || id.length === 0) {
            return res.status(400).json({
                message: "Id inválido"
            });
        }

        const user = await this.userService.getUserById(id);

        res.status(200).json({
            data: user,
        });
    }

async createUser(req: Request, res: Response) {

    const user: IUser = req.body;

    if (!user.nombre || !user.email || !user.password) {

        return res.status(400).json({
            message: "Todos los campos son obligatorios"
        });
    }
    if (!user.email.includes("@")) {

        return res.status(400).json({
            message: "Email inválido"
        });
    }

    await this.userService.createUser(user);

    res.status(201).json({
        message: "Usuario creado correctamente",
    });
}

async updateUser(req: Request, res: Response) {

    const id = req.params.id;

    if (typeof id !== "string" || id.length === 0) {
        return res.status(400).json({
            message: "Id inválido"
        });
    }

    const user: IUser = req.body;

    if (!user.nombre || !user.email || !user.password) {

        return res.status(400).json({
            message: "Todos los campos son obligatorios"
        });
    }

    if (!user.email.includes("@")) {

        return res.status(400).json({
            message: "Email inválido"
        });
    }

    const updatedUser = await this.userService.updateUser(id, user);

    res.status(200).json({
        message: "Usuario actualizado correctamente",
        data: updatedUser
    });
}

    async deleteUser(req: Request, res: Response) {

        const id = req.params.id;

        if (typeof id !== "string" || id.length === 0) {
            return res.status(400).json({
                message: "Id inválido"
            });
        }

        await this.userService.deleteUser(id);

        res.status(200).json({
            message: "Usuario eliminado correctamente",
        });
    }
}