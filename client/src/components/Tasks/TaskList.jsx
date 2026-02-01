import { useState, useEffect, useRef } from 'react';
import { tasksAPI } from '../../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        sortBy: 'created_at',
        sortOrder: 'DESC'
    });

    const formContainerRef = useRef(null);
    const newTaskButtonRef = useRef(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.category) params.category = filters.category;
            params.sortBy = filters.sortBy;
            params.sortOrder = filters.sortOrder;

            const response = await tasksAPI.getAll(params);
            setTasks(response.data.tasks);
        } catch (err) {
            setError('Échec du chargement des tâches');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await tasksAPI.getCategories();
            setCategories(response.data.categories);
        } catch (err) {
            console.error('Échec du chargement des catégories', err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchCategories();
    }, [filters]);

    // Scroll vers le formulaire quand il s'ouvre
    useEffect(() => {
        if ((showForm || editingTask) && formContainerRef.current) {
            formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showForm, editingTask]);

    const handleCreateTask = async (taskData) => {
        try {
            await tasksAPI.create(taskData);
            setShowForm(false);
            fetchTasks();
            fetchCategories();
            // Remettre le focus sur le bouton "Nouvelle Tâche"
            setTimeout(() => newTaskButtonRef.current?.focus(), 100);
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de la création de la tâche');
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            await tasksAPI.update(editingTask.id, taskData);
            setEditingTask(null);
            fetchTasks();
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de la modification de la tâche');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

        try {
            await tasksAPI.delete(id);
            fetchTasks();
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de la suppression de la tâche');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const task = tasks.find(t => t.id === id);
            await tasksAPI.update(id, { ...task, status: newStatus });
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de la mise à jour du statut');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(false);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTask(null);
        // Remettre le focus sur le bouton "Nouvelle Tâche"
        setTimeout(() => newTaskButtonRef.current?.focus(), 100);
    };

    const handleNewTask = () => {
        setShowForm(true);
        setEditingTask(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mes Tâches</h1>
                <button
                    ref={newTaskButtonRef}
                    onClick={handleNewTask}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nouvelle Tâche
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6" role="alert">
                    {error}
                    <button
                        onClick={() => setError('')}
                        className="float-right text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        aria-label="Fermer l'alerte"
                    >
                        &times;
                    </button>
                </div>
            )}

            {(showForm || editingTask) && (
                <div
                    ref={formContainerRef}
                    className="bg-white rounded-lg shadow-lg p-6 mb-6"
                    role="region"
                    aria-label={editingTask ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}
                >
                    <h2 id="form-title" className="text-lg font-semibold mb-4">
                        {editingTask ? 'Modifier la Tâche' : 'Créer une Nouvelle Tâche'}
                    </h2>
                    <TaskForm
                        task={editingTask}
                        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                        onCancel={handleCancelForm}
                    />
                </div>
            )}

            <TaskFilters
                filters={filters}
                setFilters={setFilters}
                categories={categories}
            />

            {loading ? (
                <div className="flex justify-center py-12" aria-label="Chargement">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <p className="text-gray-500">Aucune tâche trouvée. Créez votre première tâche !</p>
                </div>
            ) : (
                <div className="space-y-4" role="list" aria-label="Liste des tâches">
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
                {tasks.length} tâche{tasks.length !== 1 ? 's' : ''} au total
            </div>
        </div>
    );
};

export default TaskList;
