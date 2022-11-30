import {Router, Request, Response} from "express";
import {Event} from "../entities/event";
import {EventEntity} from "../entities";
import {EventRepo, LuckyNumberRepo} from "../database";
import {LuckyNumber} from "../entities/lucky_number";
import {io} from "../../index";

interface CreateEventDto {
    start: number;
    end: number;
    active: boolean;
}

interface UpdateEventDto {
    start?: number;
    end?: number;
    active?: boolean;
}

interface SelectNumberDto {
    eventId: number;
    selected: number;
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const query = req.query;
    let events: EventEntity[];

    switch (query.status) {
        case "active":
            events = await EventRepo.find({ where: { active: true }, relations: ["luckyNumbers", "luckyNumbers.user"] });
        case "disabled":
            events = await EventRepo.find({ where: { active: false }, relations: ["luckyNumbers", "luckyNumbers.user"] });
        default:
            events = await EventRepo.find({ relations: ["luckyNumbers", "luckyNumbers.user"] });
    }

    if(events.length === 0) {
        return res.status(200).json({ success: false, events });
    }

    return res.status(200).json({ success: true, events });
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;

    const event = await EventRepo.findOne({ where: { id: Number(id) }, relations: ["luckyNumbers", "luckyNumbers.user"] });
    if(!event) {
        return res.status(200).json({ success: false, event: null });
    }

    return res.status(200).json({ success: true, event });
})

router.post("/", async (req: Request, res: Response) => {
    const body = req.body as CreateEventDto;

    if(!body.start || !body.end || !body.active) {
        return res.status(422).json({ success: false, message: "Проверьте входные данные", event: null });
    }

    const event = await EventRepo.save(body);
    return res.status(200).json({ event });
});

router.patch("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body as UpdateEventDto;

    const event = await EventRepo.findOne({ where: { id: Number(id) } });
    if (!event) {
        return res.status(200).json({ success: false, message: "Розыгрыш не найден" });
    }

    Object.keys(body).filter(key => key !== undefined).forEach(key => {
        // @ts-ignore
        event[key] = body[key];
    });

    await event.save();
    return res.status(200).json({ event });
});

router.delete("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body as CreateEventDto;

    const event = await EventRepo.findOne({ where: { id: Number(id) } });
    if (!event) {
        return res.status(200).json({ success: false, message: "Розыгрыш не найден" });
    }

    await event.remove();
    return res.status(200).json({ success: true });
});

router.post("/:id/number/:number", async (req: Request, res: Response) => {
    const {id, number} = req.params;

    const event = await EventRepo.findOne({ where: { id: Number(id) } });
    if(!event) {
        return res.status(200).json({ success: false, message: "Такого розыгрыша нет" });
    }

    const luckyNumber = LuckyNumberRepo.create({ selected: Number(number), event, eventId: event.id });
    await luckyNumber.save();

    io.to(id).emit("reserve", { number });

    return res.status(200).json({ status: true, id: luckyNumber.id });
});

export default router;