import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMedications } from "../services/api";
import "../styles/Stock.css";

const Stock = () => {
    const { user } = useContext(AuthContext);
    const [medications, setMedications] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const data = await getMedications(user.token);
                setMedications(data);
            } catch (error) {
                setError("Stokları yüklerken bir hata oluştu!");
            }
        };
        fetchMedications();
    }, [user]);

    return (
        <div className="stock-container">
            <div className="stock-box">
                <h2>İlaç Stokları</h2>
                {error && <p className="error">{error}</p>}

                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>İlaç Adı</th>
                            <th>Stok</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medications.length > 0 ? (
                            medications.map((medication) => (
                                <tr key={medication.id}>
                                    <td>{medication.id}</td>
                                    <td>{medication.name}</td>
                                    <td>{medication.stock}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="no-data">Stok bilgisi bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Stock;
