import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import createConnection from "@shared/infra/database/typeorm";
import { app } from "@shared/infra/http/app";

let connection: Connection;
let tokenAdmin: string;

describe("List Categories Controller", () => {
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

    it("should be able to list all categories", async () => {
        await request(app)
            .post("/categories")
            .send({
                name: "Category 1",
                description: "Category Test 1",
            })
            .set({
                Authorization: `Bearer ${tokenAdmin}`,
            });

        await request(app)
            .post("/categories")
            .send({
                name: "Category 2",
                description: "Category Test 2",
            })
            .set({
                Authorization: `Bearer ${tokenAdmin}`,
            });

        const response = await request(app).get("/categories");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);

        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[1]).toHaveProperty("id");

        expect(response.body[0].name).toEqual("Category 1");
        expect(response.body[1].name).toEqual("Category 2");
    });
});
