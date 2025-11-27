const cron = require('node-cron');
const Task = require('../models/Task');
const sendEmail = require('../utils/email');
const moment = require('moment');

// Every 10 minutes check for tasks with deadline within next 24 hours
cron.schedule('*/10 * * * *', async () => {
  try {
    const now = moment().toDate();
    const next24 = moment().add(24, 'hours').toDate();

    const tasks = await Task.find({
      status: { $in: ['assigned','claimed','in_progress'] },
      deadline: { $gte: now, $lte: next24 }
    }).populate('assignedTo assignedBy');

    for (let t of tasks) {
      if (t.assignedTo && t.assignedTo.email) {
        await sendEmail(t.assignedTo.email, 'Task Reminder: Deadline Approaching', `Task "${t.title}" ki deadline ${moment(t.deadline).format('YYYY-MM-DD HH:mm')}`);
      }
      // optional: notify manager as well
      if (t.assignedBy && t.assignedBy.email) {
        await sendEmail(t.assignedBy.email, 'Reminder: Task approaching deadline', `Task "${t.title}" assigned to ${t.assignedTo?.name || 'Employee'} has deadline ${moment(t.deadline).format('YYYY-MM-DD HH:mm')}`);
      }
    }
  } catch (err) {
    console.error('Cron error', err);
  }
});
