import { useState, useEffect, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale/fr';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fr', fr);

const TaskForm = ({ task, onSubmit, onCancel, categories = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: new Date(),
        priority: 'medium',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const titleInputRef = useRef(null);
    const formRef = useRef(null);
    const categoryWrapperRef = useRef(null);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                deadline: task.deadline ? new Date(task.deadline) : new Date(),
                priority: task.priority || 'medium',
                category: task.category || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                deadline: new Date(),
                priority: 'medium',
                category: ''
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
            if (e.key === 'Escape') {
                if (suggestions.length > 0) setSuggestions([]);
                else onCancel();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel, suggestions]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                deadline: formData.deadline ? formData.deadline.toISOString() : null
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
                        Échéance
                    </label>
                    <DatePicker
                        id="deadline"
                        selected={formData.deadline}
                        onChange={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
                        locale="fr"
                        dateFormat="dd MMMM yyyy"
                        minDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        wrapperClassName="w-full"
                        placeholderText="Sélectionner une date"
                        ariaLabelledBy="deadline"
                        chooseDayAriaLabelPrefix="Choisir le"
                        disabledDayAriaLabelPrefix="Indisponible le"
                        monthAriaLabelPrefix="Mois"
                        weekAriaLabelPrefix="Semaine"
                        prevMonthAriaLabel="Mois précédent"
                        nextMonthAriaLabel="Mois suivant"
                        prevYearAriaLabel="Année précédente"
                        nextYearAriaLabel="Année suivante"
                    />
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

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                </label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                </select>
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
