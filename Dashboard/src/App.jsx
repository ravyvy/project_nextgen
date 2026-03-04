import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from './page/dashboard/loginadmin';
import MainDb from './page/dashboard/mainDb';

const ProtectedRoute = ({ children }) => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
        return <Navigate to="/login_admin" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login_admin" element={<LoginAdmin />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainDb />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboards" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
