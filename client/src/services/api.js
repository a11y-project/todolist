import { supabase } from '../lib/supabase';

export const tasksAPI = {
    getAll: async (filters = {}) => {
        const { data: { user } } = await supabase.auth.getUser();
        let query = supabase.from('tasks').select('*').eq('user_id', user.id);

        if (filters.category) query = query.eq('category', filters.category);

        const sortField = filters.sortBy || 'created_at';
        const ascending = (filters.sortOrder || 'DESC').toUpperCase() === 'ASC';
        query = query.order(sortField, { ascending });

        const { data, error } = await query;
        if (error) throw error;
        return { data: { tasks: data } };
    },

    create: async (taskData) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('tasks')
            .insert({ ...taskData, user_id: user.id })
            .select()
            .single();
        if (error) throw error;
        return { data: { task: data } };
    },

    update: async (id, taskData) => {
        const { id: _id, user_id: _uid, created_at: _ca, recurrence_end_date: _red, ...updateData } = taskData;
        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return { data: { task: data } };
    },

    createBatch: async (tasksArray) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
            .from('tasks')
            .insert(tasksArray.map(t => ({ ...t, user_id: user.id })));
        if (error) throw error;
        return { data: {} };
    },

    delete: async (id) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { data: {} };
    },

    deleteGroup: async (groupId) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('recurrence_group_id', groupId);
        if (error) throw error;
        return { data: {} };
    },

    updateGroup: async (groupId, updateData) => {
        const { error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('recurrence_group_id', groupId);
        if (error) throw error;
        return { data: {} };
    },

    getCategories: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('tasks')
            .select('category')
            .eq('user_id', user.id)
            .not('category', 'is', null)
            .neq('category', '');
        if (error) throw error;
        const categories = [...new Set(data.map(r => r.category))];
        return { data: { categories } };
    }
};

export const authAPI = {};

export default {};
