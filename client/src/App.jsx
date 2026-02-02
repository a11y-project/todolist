import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import LegalMentions from './components/Layout/LegalMentions';

function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <TaskList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? <Navigate to="/" replace /> : <Login />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuthenticated ? <Navigate to="/" replace /> : <Register />
                        }
                    />
                    <Route path="/mentions-legales" element={<LegalMentions />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
