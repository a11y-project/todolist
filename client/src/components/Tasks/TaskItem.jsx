import { useMemo, useState } from 'react';

const formatDateFr = (date) =>
    new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);

const toDateKey = (date) => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    return d.toISOString().split('T')[0];
};

const RECURRENCE_LABELS = {
    weekly: 'Hebdo',
    biweekly: '2 sem.',
    triweekly: '3 sem.',
    monthly: 'Mensuel',
    bimonthly: '2 mois',
    quarterly: 'Trimestriel'
};

const TaskItem = ({ task, onEdit, onDelete, onDeadlineChange, onDone }) => {
    const [pendingAction, setPendingAction] = useState(null); // null | 'delete' | 'edit'

    const isOverdue = task.deadline && new Date(task.deadline) < new Date();

    const dateOptions = useMemo(() => {
        const options = [];
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        for (let i = 0; i <= 365; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            options.push(d);
        }
        return options;
    }, []);

    const deadlineKey = task.deadline ? toDateKey(task.deadline) : null;
    const deadlineInOptions = deadlineKey && dateOptions.some(d => toDateKey(d) === deadlineKey);

    const handleDeleteClick = () => {
        if (task.recurrence_group_id) {
            setPendingAction('delete');
        } else {
            onDelete(task.id, 'single');
        }
    };

    const handleEditClick = () => {
        if (task.recurrence_group_id) {
            setPendingAction('edit');
        } else {
            onEdit(task, 'single');
        }
    };

    return (
        <li className={`bg-white rounded-lg shadow p-4 border-l-4 ${isOverdue ? 'border-red-500' : 'border-indigo-300'}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                            {task.category && (
                                <span className="text-indigo-600">{task.category} — </span>
                            )}
                            {task.title}
                        </h3>
                        {task.recurrence && (
                            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                                ↻ {RECURRENCE_LABELS[task.recurrence]}
                            </span>
                        )}
                    </div>

                    {task.description && (
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}

                    <div className="mt-2">
                        <select
                            value={deadlineKey || ''}
                            onChange={(e) => {
                                const [year, month, day] = e.target.value.split('-').map(Number);
                                const date = new Date(year, month - 1, day, 12);
                                onDeadlineChange(task.id, date.toISOString());
                            }}
                            aria-label="Échéance"
                            className={`text-xs px-2 py-1 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                isOverdue
                                    ? 'border-red-300 bg-red-50 text-red-700 font-medium'
                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                            }`}
                        >
                            {deadlineKey && !deadlineInOptions && (
                                <option value={deadlineKey}>
                                    {formatDateFr(new Date(task.deadline))} (en retard)
                                </option>
                            )}
                            {dateOptions.map(date => (
                                <option key={toDateKey(date)} value={toDateKey(date)}>
                                    {formatDateFr(date)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                    {/* Choix inline pour delete */}
                    {pendingAction === 'delete' && (
                        <div className="flex flex-col gap-1 mr-1">
                            <button
                                onClick={() => { onDelete(task.id, 'single'); setPendingAction(null); }}
                                className="text-xs px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Cette occurrence
                            </button>
                            <button
                                onClick={() => { onDelete(task.id, 'all', task.recurrence_group_id); setPendingAction(null); }}
                                className="text-xs px-2 py-1 bg-red-100 text-red-800 border border-red-300 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Toutes les occurrences
                            </button>
                            <button
                                onClick={() => setPendingAction(null)}
                                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                Annuler
                            </button>
                        </div>
                    )}

                    {/* Choix inline pour edit */}
                    {pendingAction === 'edit' && (
                        <div className="flex flex-col gap-1 mr-1">
                            <button
                                onClick={() => { onEdit(task, 'single'); setPendingAction(null); }}
                                className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                Cette occurrence
                            </button>
                            <button
                                onClick={() => { onEdit(task, 'all'); setPendingAction(null); }}
                                className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 border border-indigo-300 rounded hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                Toutes les occurrences
                            </button>
                            <button
                                onClick={() => setPendingAction(null)}
                                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                Annuler
                            </button>
                        </div>
                    )}

                    {pendingAction === null && (
                        <>
                            <button
                                onClick={() => onDone(task)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                                title="Marquer comme fait"
                                aria-label="Marquer comme fait"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <button
                                onClick={handleEditClick}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                title="Modifier"
                                aria-label="Modifier la tâche"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>

                            <button
                                onClick={handleDeleteClick}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                title="Supprimer"
                                aria-label="Supprimer la tâche"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </li>
    );
};

export default TaskItem;
