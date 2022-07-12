import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let dayAdd24Hours: Date;

describe("Create Rental", () => {
    beforeEach(() => {
        dayjsDateProvider = new DayjsDateProvider();

        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();

        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );

        dayAdd24Hours = dayjsDateProvider.addOneDayInDate(
            dayjsDateProvider.dateNow()
        );
    });

    it("should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Test Car Rental",
            description: "Car Test",
            daily_rate: 102,
            license_plate: "test",
            fine_amount: 42,
            category_id: "1234",
            brand: "brand",
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "car_same_user",
            expected_return_date: dayAdd24Hours,
            user_id: "user_test",
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "user_test",
                car_id: "new_car_user",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "car_same",
            expected_return_date: dayAdd24Hours,
            user_id: "user_test",
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "user_rental",
                car_id: "car_same",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "invalid_date_user",
                car_id: "car_date",
                expected_return_date: dayjsDateProvider.dateNow(),
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
