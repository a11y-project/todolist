import { useState, useEffect, useRef, useMemo } from 'react';

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

const parseFromKey = (key) => {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
};

const TaskForm = ({ task, onSubmit, onCancel, categories = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: new Date(),
        category: '',
        recurrence: '',
        recurrence_end_date: null
    });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const titleInputRef = useRef(null);
    const formRef = useRef(null);
    const categoryWrapperRef = useRef(null);

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

    // Options pour la date de fin : dates après l'échéance choisie, jusqu'à 3 ans
    const endDateOptions = useMemo(() => {
        const options = [];
        const start = formData.deadline ? new Date(formData.deadline) : new Date();
        start.setHours(12, 0, 0, 0);
        const limit = new Date(start);
        limit.setFullYear(limit.getFullYear() + 3);
        let d = new Date(start);
        d.setDate(d.getDate() + 1);
        while (d <= limit) {
            options.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        return options;
    }, [formData.deadline]);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                deadline: task.deadline ? new Date(task.deadline) : new Date(),
                category: task.category || '',
                recurrence: task.recurrence || '',
                recurrence_end_date: null
            });
        } else {
            setFormData({
                title: '',
                description: '',
                deadline: new Date(),
                category: '',
                recurrence: '',
                recurrence_end_date: null
            });
        }
    }, [task]);

    useEffect(() => {
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && suggestions.length > 0) {
                setSuggestions([]);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [suggestions]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Réinitialise la date de fin si la récurrence est désactivée
    useEffect(() => {
        if (!formData.recurrence) {
            setFormData(prev => ({ ...prev, recurrence_end_date: null }));
        }
    }, [formData.recurrence]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'category') {
            const filtered = value
                ? categories.filter(c => c.toLowerCase().includes(value.toLowerCase()) && c.toLowerCase() !== value.toLowerCase())
                : [];
            setSuggestions(filtered);
            setActiveSuggestion(-1);
        }
    };

    const handleCategoryKeyDown = (e) => {
        if (suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && activeSuggestion >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestion]);
        }
    };

    const selectSuggestion = (value) => {
        setFormData(prev => ({ ...prev, category: value }));
        setSuggestions([]);
        setActiveSuggestion(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                deadline: formData.deadline ? formData.deadline.toISOString() : null,
                recurrence_end_date: formData.recurrence_end_date
                    ? (formData.recurrence_end_date instanceof Date
                        ? formData.recurrence_end_date.toISOString()
                        : formData.recurrence_end_date)
                    : null
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4"
            role="dialog"
            aria-labelledby="form-title"
        >
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Fermer le formulaire"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre *
                </label>
                <input
                    ref={titleInputRef}
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Entrez le titre de la tâche"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Entrez une description (optionnel)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                        Première échéance
                    </label>
                    <select
                        id="deadline"
                        value={formData.deadline ? toDateKey(formData.deadline) : toDateKey(new Date())}
                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: parseFromKey(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {formData.deadline && !dateOptions.some(d => toDateKey(d) === toDateKey(formData.deadline)) && (
                            <option value={toDateKey(formData.deadline)}>
                                {formatDateFr(formData.deadline)}
                            </option>
                        )}
                        {dateOptions.map(date => (
                            <option key={toDateKey(date)} value={toDateKey(date)}>
                                {formatDateFr(date)}
                            </option>
                        ))}
                    </select>
                </div>

                <div ref={categoryWrapperRef} className="relative">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                    </label>
                    <input
                        id="category"
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        onKeyDown={handleCategoryKeyDown}
                        autoComplete="off"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="ex: Travail, Personnel"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={suggestions.length > 0}
                        aria-haspopup="listbox"
                        aria-controls="category-suggestions"
                        aria-activedescendant={activeSuggestion >= 0 ? `category-suggestion-${activeSuggestion}` : undefined}
                    />
                    <ul
                        id="category-suggestions"
                        role="listbox"
                        aria-label="Suggestions de catégories"
                        className={`absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto ${suggestions.length === 0 ? 'hidden' : ''}`}
                    >
                        {suggestions.map((s, i) => (
                            <li
                                key={s}
                                id={`category-suggestion-${i}`}
                                role="option"
                                aria-selected={i === activeSuggestion}
                                onMouseDown={() => selectSuggestion(s)}
                                className={`px-3 py-2 text-sm cursor-pointer ${i === activeSuggestion ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
                        Récurrence
                    </label>
                    <select
                        id="recurrence"
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Aucune récurrence</option>
                        <option value="weekly">Toutes les semaines</option>
                        <option value="biweekly">Toutes les 2 semaines</option>
                        <option value="triweekly">Toutes les 3 semaines</option>
                        <option value="monthly">Tous les mois</option>
                        <option value="bimonthly">Tous les 2 mois</option>
                        <option value="quarterly">Tous les trimestres</option>
                    </select>
                </div>

                {formData.recurrence && (
                    <div>
                        <label htmlFor="recurrence_end_date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date de fin <span className="text-gray-400 font-normal">(facultatif — 1 an par défaut)</span>
                        </label>
                        <select
                            id="recurrence_end_date"
                            value={formData.recurrence_end_date ? toDateKey(formData.recurrence_end_date) : ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                recurrence_end_date: e.target.value ? parseFromKey(e.target.value) : null
                            }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Dans 1 an (par défaut)</option>
                            {endDateOptions.map(date => (
                                <option key={toDateKey(date)} value={toDateKey(date)}>
                                    {formatDateFr(date)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Enregistrement...' : (task ? 'Modifier la tâche' : 'Créer la tâche')}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
