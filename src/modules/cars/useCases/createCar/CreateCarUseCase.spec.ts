import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it("should be able to create a new car", async () => {
        const car = await createCarUseCase.execute({
            name: "Name Car",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand Car",
            category_id: "category",
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a car with exists license plate", () => {
        expect(async () => {
            await createCarUseCase.execute({
                name: "Name Car 1",
                description: "Description Car 1",
                daily_rate: 100,
                license_plate: "ABC-1234",
                fine_amount: 60,
                brand: "Brand Car 1",
                category_id: "category 1",
            });

            await createCarUseCase.execute({
                name: "Name Car 2",
                description: "Description Car 2",
                daily_rate: 120,
                license_plate: "ABC-1234",
                fine_amount: 80,
                brand: "Brand Car 2",
                category_id: "category 2",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("it should be able to create a car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Name Car Available",
            description: "Description Car Available",
            daily_rate: 80,
            license_plate: "AVA-1234",
            fine_amount: 30,
            brand: "Brand Car Available",
            category_id: "category available",
        });

        expect(car.available).toBe(true);
    });
});
