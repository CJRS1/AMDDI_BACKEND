import { Router } from "express";
import {
    crearMontoPagado,
    traerMontoPagado,
    editarMontoPagado
} from "../controllers/monto.controller.js"

export const montoRouter = Router();
montoRouter.post("/monto_pagado",crearMontoPagado); 
montoRouter.get("/monto_pagado/:id",traerMontoPagado); 
montoRouter.put("/monto_pagado/:id",editarMontoPagado); 