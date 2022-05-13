import { Router } from "express";
import { container } from "tsyringe";

import { ensureAuthenticated } from "@middlewares/ensureAuthenticated";
import { CreateSpecificationService } from "@modules/cars/services/CreateSpecificationService";

const specificationsRoutes = Router();

specificationsRoutes.use(ensureAuthenticated);
specificationsRoutes.post("/", async (request, response) => {
    const { name, description } = request.body;

    const createSpecificationService = container.resolve(
        CreateSpecificationService
    );

    await createSpecificationService.execute({ name, description });

    return response.status(201).send();
});

export { specificationsRoutes };
