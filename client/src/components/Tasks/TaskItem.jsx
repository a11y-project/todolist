const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
    };

    const priorityLabels = {
        low: 'Basse',
        medium: 'Moyenne',
        high: 'Haute'
    };

    const statusColors = {
        pending: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800'
    };

    const statusLabels = {
        pending: 'En attente',
        in_progress: 'En cours',
        completed: 'Terminé'
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

    return (
        <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${
            task.status === 'completed' ? 'border-green-500 opacity-75' :
            isOverdue ? 'border-red-500' :
            task.priority === 'high' ? 'border-red-400' :
            task.priority === 'medium' ? 'border-yellow-400' : 'border-green-400'
        }`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                        </h3>
                        {task.category && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                {task.category}
                            </span>
                        )}
                    </div>

                    {task.description && (
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                            Priorité {priorityLabels[task.priority]}
                        </span>

                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                            {statusLabels[task.status]}
                        </span>

                        {task.deadline && (
                            <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                Échéance : {formatDate(task.deadline)}
                                {isOverdue && ' (En retard)'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                    {task.status !== 'completed' && (
                        <button
                            onClick={() => onStatusChange(task.id, 'completed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                            title="Marquer comme terminé"
                            aria-label="Marquer comme terminé"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}

                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        title="Modifier la tâche"
                        aria-label="Modifier la tâche"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Supprimer la tâche"
                        aria-label="Supprimer la tâche"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
