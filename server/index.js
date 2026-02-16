const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const subtaskRoutes = require('./routes/subtasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mount the batch reorder route BEFORE the :id param routes
app.use('/api/tasks/batch', (req, res, next) => {
  if (req.path === '/reorder' && req.method === 'PATCH') {
    const { readDB, writeDB } = require('./utils/db');
    const db = readDB();
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Expected an array of updates' });
    }

    updates.forEach((update) => {
      const index = db.tasks.findIndex((t) => t.id === update.id);
      if (index !== -1) {
        if (update.status !== undefined) db.tasks[index].status = update.status;
        if (update.order !== undefined) db.tasks[index].order = update.order;
        db.tasks[index].updatedAt = new Date().toISOString();
      }
    });

    writeDB(db);
    return res.json({ success: true });
  }
  next();
});

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TaskApp API running on http://localhost:${PORT}`);
});
