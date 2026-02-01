const Task = require('../models/Task');

const createTask = async (req, res) => {
    try {
        const { title, description, deadline, priority, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Le titre est requis' });
        }

        const task = await Task.create(req.user.id, {
            title,
            description,
            deadline,
            priority,
            category
        });

        res.status(201).json({ message: 'Tâche créée avec succès', task });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getTasks = async (req, res) => {
    try {
        const { status, priority, category, sortBy, sortOrder } = req.query;

        const tasks = await Task.findByUserId(req.user.id, {
            status,
            priority,
            category,
            sortBy,
            sortOrder
        });

        res.json({ tasks });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        if (task.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        res.json({ task });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, deadline, priority, status, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Le titre est requis' });
        }

        const task = await Task.update(req.params.id, req.user.id, {
            title,
            description,
            deadline,
            priority,
            status,
            category
        });

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
        }

        res.json({ message: 'Tâche modifiée avec succès', task });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.delete(req.params.id, req.user.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
        }

        res.json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Task.getCategories(req.user.id);
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    getCategories
};
