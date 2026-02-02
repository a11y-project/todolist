import { Link } from 'react-router-dom';

const LegalMentions = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Éditeur du site</h2>
                    <p className="text-gray-600 leading-relaxed">
                        <strong>Responsable de la publication :</strong> Kevin Bustamante<br />
                        <strong>Contact :</strong> contact@accessiproject.fr<br />
                        Ce site est édité dans le cadre d'un projet personnel.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Hébergement</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Ce site est hébergé par :<br />
                        <strong>o2switch SARL</strong><br />
                        222 Boulevard Gustave Flaubert<br />
                        63000 Clermont-Ferrand, France<br />
                        Téléphone : 04 44 44 60 40<br />
                        Site web : <a href="https://www.o2switch.fr" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">www.o2switch.fr</a>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Propriété intellectuelle</h2>
                    <p className="text-gray-600 leading-relaxed">
                        L'ensemble du contenu de ce site (textes, images, vidéos, etc.) est protégé par le droit d'auteur.
                        Toute reproduction, même partielle, est interdite sans autorisation préalable.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Protection des données personnelles</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit
                        d'accès, de rectification et de suppression de vos données personnelles. Les données collectées
                        (nom, email) sont utilisées uniquement pour le fonctionnement du service de gestion de tâches
                        et ne sont pas transmises à des tiers.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Cookies</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Ce site utilise des cookies techniques nécessaires au bon fonctionnement du service
                        (authentification, session utilisateur). Aucun cookie publicitaire ou de traçage n'est utilisé.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Limitation de responsabilité</h2>
                    <p className="text-gray-600 leading-relaxed">
                        L'éditeur ne saurait être tenu responsable des erreurs, d'une absence de disponibilité
                        des informations et/ou de la présence de virus sur le site.
                    </p>
                </section>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link
                        to="/"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        &larr; Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LegalMentions;
