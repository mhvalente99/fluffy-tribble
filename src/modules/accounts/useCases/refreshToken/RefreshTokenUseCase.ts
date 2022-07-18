import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    token: string;
    refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        const { email, sub } = verify(
            token,
            auth.secret_refresh_token
        ) as IPayload;

        const userId = sub;

        const userToken =
            await this.usersTokensRepository.findByUserIdAndRefreshToken(
                userId,
                token
            );

        if (!userToken) {
            throw new AppError("Refresh Token does not exists!");
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const refreshToken = sign({ email }, auth.secret_refresh_token, {
            subject: userId,
            expiresIn: auth.expires_in_refresh_token,
        });

        await this.usersTokensRepository.create({
            user_id: userId,
            expires_date: this.dateProvider.addDaysInDate(
                30,
                this.dateProvider.dateNow()
            ),
            refresh_token: refreshToken,
        });

        const newToken = sign({}, auth.secret_token, {
            subject: userId,
            expiresIn: auth.expires_in_token,
        });

        return {
            refresh_token: refreshToken,
            token: newToken,
        };
    }
}

export { RefreshTokenUseCase };
