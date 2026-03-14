const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <p className="text-gray-500 text-sm text-center">
                    &copy; {new Date().getFullYear()} Liste de Tâches. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
