import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Liste de Tâches. Tous droits réservés.
                    </p>
                    <Link
                        to="/mentions-legales"
                        className="text-gray-500 hover:text-indigo-600 text-sm transition-colors"
                    >
                        Mentions légales
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
