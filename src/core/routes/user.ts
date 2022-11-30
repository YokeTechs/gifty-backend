import {Request, Response, Router} from "express";
import {LuckyNumberRepo, UserRepo} from "../database";
import {In} from "typeorm";

interface CreateUserDto {
    givenName: string;
    familyName: string;
    patronymic: string;
    numbers: number[];
}


const router = Router();

router.post("/register", async (req: Request, res: Response) => {
    const body = req.body as CreateUserDto;

    if(!body.givenName || !body.familyName || !body.patronymic) {
        return res.status(422).json({ success: false, message: "Проверьте входные данные" })
    }

    const user = await UserRepo.save(body);
    if(!user) {
        return res.status(200).json({ success: false });
    }

    const numbers = await LuckyNumberRepo.findBy({ id: In(body.numbers) });
    for (const number of numbers) {
        number.userId = user.id;
        await number.save();
    }

    return res.status(200).json({ success: true });
});

export default router;