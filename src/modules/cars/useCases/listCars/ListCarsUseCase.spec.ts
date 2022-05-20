import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListCarsUseCase } from "./ListCarsUseCase";

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
    });

    it("should be able to list all availables cars", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car Name",
            description: "Car Description",
            daily_rate: 120.0,
            license_plate: "AXV-1345",
            fine_amount: 60.0,
            brand: "Car Brand",
            category_id: "4b2bdfe8-ed08-4f16-a8ef-07fa0b7f004c",
        });

        const cars = await listCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it("should be able to list all availables cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Brand Name",
            description: "Brand Description",
            daily_rate: 130.0,
            license_plate: "BRA-1234",
            fine_amount: 70.0,
            brand: "Test Brand",
            category_id: "4b2bdfe8-ed08-4f16-a8ef-07fa0b7f004c",
        });

        const cars = await listCarsUseCase.execute({ brand: "Test Brand" });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all availables cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Name Name",
            description: "Name Description",
            daily_rate: 140.0,
            license_plate: "NAM-1234",
            fine_amount: 80.0,
            brand: "Test Name",
            category_id: "4b2bdfe8-ed08-4f16-a8ef-07fa0b7f004c",
        });

        const cars = await listCarsUseCase.execute({ name: "Name Name" });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all availables cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Category Name",
            description: "Category Description",
            daily_rate: 150.0,
            license_plate: "CAT-1234",
            fine_amount: 90.0,
            brand: "Category Brand",
            category_id: "4b2bdfe8-ed08-4f16-a8ef-07fa0b7f004c",
        });

        const cars = await listCarsUseCase.execute({
            category_id: "4b2bdfe8-ed08-4f16-a8ef-07fa0b7f004c",
        });

        expect(cars).toEqual([car]);
    });
});
