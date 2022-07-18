import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;

let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        mailProvider = new MailProviderInMemory();

        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        );
    });

    it("should be able to send a forgot password mail to user", async () => {
        const sendMail = jest.spyOn(mailProvider, "sendMail");

        await usersRepositoryInMemory.create({
            driver_license: "037222",
            email: "uw@sid.sx",
            name: "Frederick Baker",
            password: "1234",
        });

        await sendForgotPasswordMailUseCase.execute("uw@sid.sx");

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send an email if user does not exists", async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute("rikkuf@goka.pl")
        ).rejects.toEqual(new AppError("User does not exists"));
    });

    it("should be able to create an users token", async () => {
        const generateTokenMail = jest.spyOn(
            usersTokensRepositoryInMemory,
            "create"
        );

        await usersRepositoryInMemory.create({
            driver_license: "586939",
            email: "nafwo@cirbo.sr",
            name: "Lillie Cunningham",
            password: "4321",
        });

        await sendForgotPasswordMailUseCase.execute("nafwo@cirbo.sr");

        expect(generateTokenMail).toHaveBeenCalled();
    });
});
