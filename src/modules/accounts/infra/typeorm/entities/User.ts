import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("users")
class User {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    driver_license: string;

    @Column()
    isAdmin: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @Expose({ name: "avatar_url" })
    avatar_url(): string {
        return process.env.disk === "local"
            ? `${process.env.APP_API_URL}/avatar/${this.avatar}`
            : `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
    }

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}

export { User };
