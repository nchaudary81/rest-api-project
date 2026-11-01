
const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
    {
        id: randomUUID(),
        title: 'Complete REST API assignment',
        description: 'Build an API using Node.js and Express.',
        completed: false
    },
    {
        id: randomUUID(),
        title: 'Test API endpoints',
        description: 'Test all five endpoints.',
        completed: false
    }
];

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});


app.get('/api/resources', (req, res) => {
    res.status(200).json(tasks);
});


app.get('/api/resources/:id', (req, res) => {
    const task = tasks.find(task => task.id === req.params.id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
});

app.post('/api/resources', (req, res) => {
    const { title, description, completed } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'Task title is required' });
    }

    const newTask = {
        id: randomUUID(),
        title: title.trim(),
        description: description || '',
        completed: completed ?? false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});


app.put('/api/resources/:id', (req, res) => {
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, completed } = req.body;

    if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof completed !== 'boolean'
    ) {
        return res.status(400).json({
            message: 'Provide title, description, and completed with valid values'
        });
    }

    const updatedTask = {
        id: tasks[taskIndex].id,
        title,
        description,
        completed
    };

    tasks[taskIndex] = updatedTask;

    res.status(200).json(updatedTask);
});


app.delete('/api/resources/:id', (req, res) => {
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask
    });
});


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
