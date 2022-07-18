import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import createConnection from "@shared/infra/database/typeorm";
import { app } from "@shared/infra/http/app";

let connection: Connection;
let tokenAdmin: string;

describe("Create Category Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
            `INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
            VALUES('${id}', 'admin', 'admin@rentalx.com.br', '${password}', true, 'now()', '')
            `
        );

        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentalx.com.br",
            password: "admin",
        });

        tokenAdmin = responseToken.body.refresh_token;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new category", async () => {
        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Test",
                description: "Category Test",
            })
            .set({
                Authorization: `Bearer ${tokenAdmin}`,
            });

        expect(response.status).toBe(201);
    });

    it("should not be able to create a new category with name exists", async () => {
        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Test",
                description: "Category Test Same Name",
            })
            .set({
                Authorization: `Bearer ${tokenAdmin}`,
            });

        expect(response.status).toBe(500);
    });
});
