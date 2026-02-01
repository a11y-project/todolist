const pool = require('../config/db');

class Task {
    static async create(userId, taskData) {
        const { title, description, deadline, priority, category } = taskData;
        const [result] = await pool.execute(
            `INSERT INTO tasks (user_id, title, description, deadline, priority, category)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, title, description || null, deadline || null, priority || 'medium', category || null]
        );
        return this.findById(result.insertId);
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async findByUserId(userId, filters = {}) {
        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        const params = [userId];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.priority) {
            query += ' AND priority = ?';
            params.push(filters.priority);
        }

        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }

        // Sorting
        const sortField = filters.sortBy || 'created_at';
        const sortOrder = filters.sortOrder || 'DESC';
        const allowedSortFields = ['created_at', 'deadline', 'priority', 'title'];
        const allowedSortOrders = ['ASC', 'DESC'];

        if (allowedSortFields.includes(sortField) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
            query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, userId, taskData) {
        const { title, description, deadline, priority, status, category } = taskData;

        const [result] = await pool.execute(
            `UPDATE tasks
             SET title = ?, description = ?, deadline = ?, priority = ?, status = ?, category = ?
             WHERE id = ? AND user_id = ?`,
            [title, description || null, deadline || null, priority, status, category || null, id, userId]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }

    static async delete(id, userId) {
        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }

    static async getCategories(userId) {
        const [rows] = await pool.execute(
            'SELECT DISTINCT category FROM tasks WHERE user_id = ? AND category IS NOT NULL',
            [userId]
        );
        return rows.map(row => row.category);
    }
}

module.exports = Task;
