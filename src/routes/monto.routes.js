import { Router } from "express";
import {
    crearMontoPagado
} from "../controllers/monto.controller.js"

export const montoRouter = Router();
montoRouter.post("/monto_pagado",crearMontoPagado); 