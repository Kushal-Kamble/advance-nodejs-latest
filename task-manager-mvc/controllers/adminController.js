const Task = require('../models/Task');
const User = require('../models/User');
const moment = require('moment');

// Get task status counts and manager distribution & monthly counts
exports.getStats = async (req, res) => {
  try {
    // 1) Task status counts
    const statuses = ['assigned','claimed','in_progress','completed','closed'];
    const statusCountsPromises = statuses.map(s => Task.countDocuments({ status: s }));
    const statusCounts = await Promise.all(statusCountsPromises);

    // 2) Manager-wise distribution (how many tasks assigned by each manager)
    const managers = await User.find({ role: 'manager' }).select('name');
    const managerDist = [];
    for (let m of managers) {
      const cnt = await Task.countDocuments({ assignedBy: m._id });
      managerDist.push({ manager: m.name, count: cnt });
    }

    // 3) Monthly performance (last 6 months) - tasks created per month
    const months = [];
    const monthlyCounts = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = moment().subtract(i, 'months').startOf('month').toDate();
      const mEnd = moment().subtract(i, 'months').endOf('month').toDate();
      const cnt = await Task.countDocuments({ createdAt: { $gte: mStart, $lte: mEnd } });
      months.push(moment(mStart).format('MMM YYYY'));
      monthlyCounts.push(cnt);
    }

    res.json({
      statusLabels: statuses,
      statusCounts,
      managerDist,
      months,
      monthlyCounts
    });
  } catch (err) {
    console.error('Admin stats error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
