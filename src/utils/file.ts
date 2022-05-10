import fs from "fs";

export const deleteFile = async (filename: string) => {
    try {
        await fs.promises.stat(filename);
    } catch (error) {
        console.log(error);

        return;
    }

    await fs.promises.unlink(filename);
};
