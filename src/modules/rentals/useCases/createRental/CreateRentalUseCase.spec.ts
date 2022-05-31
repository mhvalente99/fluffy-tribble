import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let dayAdd24Hours: Date;

describe("Create Rental", () => {
    beforeEach(() => {
        dayjsDateProvider = new DayjsDateProvider();

        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();

        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider
        );

        dayAdd24Hours = dayjsDateProvider.addOneDayInDate(
            dayjsDateProvider.dateNow()
        );
    });

    it("should be able to create a new rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: "12334",
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        await createRentalUseCase.execute({
            user_id: "user_rental",
            car_id: "car_user",
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "user_rental",
                car_id: "new_car_user",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        await createRentalUseCase.execute({
            user_id: "user_test",
            car_id: "car_same",
            expected_return_date: dayAdd24Hours,
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
