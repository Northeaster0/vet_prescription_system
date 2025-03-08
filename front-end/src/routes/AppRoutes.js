import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Prescriptions from "../pages/Prescriptions";
import AddPrescription from "../pages/AddPrescription";
import Stock from "../pages/Stock";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/prescriptions" 
                        element={
                            <ProtectedRoute>
                                <Prescriptions />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/add-prescription" 
                        element={
                            <ProtectedRoute>
                                <AddPrescription />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/stock" 
                        element={
                            <ProtectedRoute>
                                <Stock />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;
