import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("MailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute(email: string) {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("User does not exists");
        }

        const token = uuidV4();

        const expires_date = this.dateProvider.addHoursInDate(
            3,
            this.dateProvider.dateNow()
        );

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date,
        });

        await this.mailProvider.sendMail(
            email,
            "Recuperação de Senha",
            `O link para o rest é ${token}`
        );
    }
}

export { SendForgotPasswordMailUseCase };
