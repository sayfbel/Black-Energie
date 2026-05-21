import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppAdmin from './admin/AppAdmin';
import AppUser from './user/AppUser';
import { NotificationProvider } from './user/context/NotificationContext';

const App = () => {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NotificationProvider>
                <Routes>
                    {/* Admin Module Routes */}
                    <Route path="/admin/*" element={<AppAdmin />} />

                    {/* User Module Routes */}
                    <Route path="/*" element={<AppUser />} />
                </Routes>
            </NotificationProvider>
        </Router>
    );
};

export default App;
