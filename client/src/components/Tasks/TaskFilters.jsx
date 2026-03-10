import { useState } from 'react';

const TaskFilters = ({ filters, setFilters, categories }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            sortBy: 'deadline',
            sortOrder: 'ASC'
        });
    };

    const activeCount = [filters.category].filter(Boolean).length;
    const isNonDefaultSort = filters.sortBy !== 'deadline' || filters.sortOrder !== 'ASC';

    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isOpen}
                aria-controls="filters-panel"
            >
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    <span>Filtres et tri</span>
                    {(activeCount > 0 || isNonDefaultSort) && !isOpen && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            {activeCount > 0 ? `${activeCount} filtre${activeCount > 1 ? 's' : ''}` : 'Tri personnalisé'}
                        </span>
                    )}
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div id="filters-panel" className="px-4 pb-4 pt-1 border-t border-gray-100">
                    <div className="flex flex-wrap gap-4 items-end mt-3">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catégorie
                            </label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trier par
                            </label>
                            <select
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="deadline">Échéance</option>
                                <option value="created_at">Date de création</option>
                                <option value="title">Titre</option>
                            </select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ordre
                            </label>
                            <select
                                name="sortOrder"
                                value={filters.sortOrder}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="ASC">Croissant</option>
                                <option value="DESC">Décroissant</option>
                            </select>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Effacer les filtres
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskFilters;