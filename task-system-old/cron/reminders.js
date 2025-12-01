// cron/reminders.js
import cron from "node-cron";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";

// हर दिन सुबह 9 बजे: due आने वाले tasks की जाँच (cron schedule adjust करें)
export const startReminders = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily reminders...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    // next 24 घंटे में due होने वाले tasks
    const tasks = await Task.find({ dueDate: { $gte: tomorrow, $lt: dayAfter }, status: { $in: ["assigned","claimed"] } }).populate("assignedTo assignedBy");
    for (const t of tasks) {
      try {
        // employee reminder
        await sendMail({
          to: t.assignedTo.email,
          subject: `Reminder: Task due tomorrow - ${t.title}`,
          text: `Your task "${t.title}" is due on ${t.dueDate}.`
        });

        // manager notify
        await sendMail({
          to: t.assignedBy.email,
          subject: `Reminder: Task for employee due tomorrow - ${t.title}`,
          text: `Task assigned to ${t.assignedTo.firstName} is due tomorrow.`
        });
      } catch (err) {
        console.error("Reminder email error", err);
      }
    }
  }, { timezone: "Asia/Kolkata" });
};
