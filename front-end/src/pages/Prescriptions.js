import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getPrescriptions } from "../services/api";
import "../styles/Prescriptions.css";
import { deletePrescription } from "../services/api"; 


const Prescriptions = () => {
    const { user } = useContext(AuthContext);
    const [prescriptions, setPrescriptions] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const handleDelete = async (id) => {
        if (!window.confirm("Bu reçeteyi silmek istediğinizden emin misiniz?")) {
            return;
        }
    
        try {
            await deletePrescription(user.token, id);
            setPrescriptions(prev => prev.filter(p => p.id !== id)); // Listeden kaldır
        } catch (error) {
            setError("Reçete silinemedi!");
        }
    }; 
    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await getPrescriptions(user.token);
                console.log("API'den gelen veri:", response); // Konsolda hataları görmek için
    
                // API `prescriptions` anahtarı içinde veri döndürüyorsa bunu düzeltelim
                if (!Array.isArray(response.prescriptions)) {
                    throw new Error("Beklenen veri formatı yanlış!");
                }
    
                setPrescriptions(response.prescriptions);
            } catch (error) {
                setError(error.message);
            }
        };
    
        fetchPrescriptions();
    }, [user]);
    



    return (
        <div className="prescriptions-container">
            <div className="prescriptions-box">
                <h2>Reçeteler</h2>
                {error && <p className="error">{error}</p>}
                
                <input 
                    type="text" 
                    placeholder="Reçete ara..." 
                    className="search-bar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table className="prescriptions-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hasta Adı</th>
                            <th>İlaç Adı</th>
                            <th>Tanı</th>
                            <th>Dozaj</th>
                            <th>Süre</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.length > 0 ? (
                            prescriptions
                                .filter(p => p.patient_name.toLowerCase().includes(search.toLowerCase()))
                                .map((prescription) => (
                                    <tr key={prescription.id}>
                                        <td>{prescription.id}</td>
                                        <td>{prescription.patient_name}</td>
                                        <td>{prescription.medication}</td>
                                        <td>{prescription.diagnosis}</td>
                                        <td>{prescription.dosage}</td>
                                        <td>{prescription.duration}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDelete(prescription.id)}>
                                                ❌ Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data">Reçete bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Prescriptions;
