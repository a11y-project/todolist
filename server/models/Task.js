const pool = require('../config/db');

class Task {
    static async create(userId, taskData) {
        const { title, description, deadline, priority, category } = taskData;
        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, description, deadline, priority, category)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [userId, title, description || null, deadline || null, priority || 'medium', category || null]
        );
        return this.findById(result.rows[0].id);
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByUserId(userId, filters = {}) {
        let query = 'SELECT * FROM tasks WHERE user_id = $1';
        const params = [userId];
        let paramIndex = 2;

        if (filters.status) {
            query += ` AND status = $${paramIndex++}`;
            params.push(filters.status);
        }

        if (filters.priority) {
            query += ` AND priority = $${paramIndex++}`;
            params.push(filters.priority);
        }

        if (filters.category) {
            query += ` AND category = $${paramIndex++}`;
            params.push(filters.category);
        }

        const sortField = filters.sortBy || 'created_at';
        const sortOrder = filters.sortOrder || 'DESC';
        const allowedSortFields = ['created_at', 'deadline', 'priority', 'title'];
        const allowedSortOrders = ['ASC', 'DESC'];

        if (allowedSortFields.includes(sortField) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
            query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const result = await pool.query(query, params);
        return result.rows;
    }

    static async update(id, userId, taskData) {
        const { title, description, deadline, priority, status, category } = taskData;

        const result = await pool.query(
            `UPDATE tasks
             SET title = $1, description = $2, deadline = $3, priority = $4, status = $5, category = $6
             WHERE id = $7 AND user_id = $8`,
            [title, description || null, deadline || null, priority, status, category || null, id, userId]
        );

        if (result.rowCount === 0) {
            return null;
        }

        return this.findById(id);
    }

    static async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rowCount > 0;
    }

    static async getCategories(userId) {
        const result = await pool.query(
            'SELECT DISTINCT category FROM tasks WHERE user_id = $1 AND category IS NOT NULL',
            [userId]
        );
        return result.rows.map(row => row.category);
    }
}

module.exports = Task;
