import { Router } from "express";
import { container } from "tsyringe";

import { CreateSpecificationService } from "@modules/cars/services/CreateSpecificationService";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

import { ensureAdmin } from "../middlewares/ensureAdmin";

const specificationsRoutes = Router();

specificationsRoutes.use(ensureAuthenticated, ensureAdmin);
specificationsRoutes.post("/", async (request, response) => {
    const { name, description } = request.body;

    const createSpecificationService = container.resolve(
        CreateSpecificationService
    );

    await createSpecificationService.execute({ name, description });

    return response.status(201).send();
});

export { specificationsRoutes };
