import { Request, Response } from "express";
import { createSchedule, updateScheduleForEmployee, findAllScheduleOfEmployee, findAllScheduleInRestaurant } from "../models/schedule/schedule.query";
import { AuthRequest } from "../interfaces/authRequest.interface";


export async function postScheduleToEmployee (req: AuthRequest, res: Response) {
    try {
      // let id = req.params.id;
      // const restaurantId = Number(id);
      const restaurantId = req.user?.employeeInformation.restaurantId;
      if (restaurantId) {
        const { employees, day, slotStart, slotEnds, shift } = req.body;
        if (typeof day === 'string' ) {
          const schedule = await createSchedule( restaurantId, {employees, day, slotStart, slotEnds, shift});
          res.status(201).json(schedule);
        } else res.status(400).json({ message: "Invalid employee ID." });
      } else res.status(400).json({ message: "Invalid restaurant ID." });
  
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

export async function getAllScheduleOfRestaurant (req: AuthRequest, res: Response) {
    try {
      // let id = req.params.id;
      // const restaurantId = Number(id);
      const restaurantId = req.user?.employeeInformation.restaurantId;
      if (restaurantId) {
        const schedule = await findAllScheduleInRestaurant(restaurantId);
        res.json({ data: schedule });
      } else res.status(400).json({ message: "Invalid restaurant ID." });
  
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  export async function getAllScheduleOfEmployee (req: AuthRequest, res: Response) {
    try {
      // let id = req.params.id;
      // const restaurantId = Number(id);
      const restaurantId = req.user?.employeeInformation.restaurantId;
      const employeeId = Number(req.params.employeeId);
      if (restaurantId && employeeId) {
        const schedule = await findAllScheduleOfEmployee(employeeId, restaurantId);
        res.json({ data: schedule });
      } else res.status(400).json({ message: "Invalid employee ID." });
  
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  export async function updateScheduleOfEmployee (req: Request, res: Response) {
    try {
        const employeeId = Number(req.params.employeeId);
        const scheduleId = Number(req.params.scheduleId);
        if (employeeId && scheduleId) {
            const { day, slotStart, slotEnds } = req.body;
            if (
                typeof day === 'string') {
              const schedule = await updateScheduleForEmployee( employeeId, scheduleId,{day, slotStart, slotEnds});
              res.status(201).json(schedule);
            } else res.status(400).json({ message: "Invalid employee ID." });
          } else res.status(400).json({ message: "Invalid schedule ID." });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
  }