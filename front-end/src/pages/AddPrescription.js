import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { addPrescription, getMedications } from "../services/api";
import "../styles/AddPrescription.css";

const AddPrescription = () => {
    const { user } = useContext(AuthContext);
    const [patientName, setPatientName] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [medications, setMedications] = useState([]); // 📌 İlaçları sakla
    const [medicationName, setMedicationName] = useState(""); // Seçilen ilaç ismi
    const [dosage, setDosage] = useState("");
    const [duration, setDuration] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 📌 Sayfa açıldığında ilaç listesini çek
    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const data = await getMedications(user.token);
                setMedications(data);
            } catch (error) {
                setError("İlaçlar yüklenirken hata oluştu.");
            }
        };
        fetchMedications();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await addPrescription(user.token, {
                patient_name: patientName,
                diagnosis: diagnosis,
                medication: medicationName,
                dosage: dosage,
                duration: duration
            });

            setSuccess("Reçete başarıyla eklendi!");
            setPatientName("");
            setDiagnosis("");
            setMedicationName("");
            setDosage("");
            setDuration("");
        } catch (error) {
            setError("Reçete eklenirken bir hata oluştu.");
        }
    };

    return (
        <div className="add-prescription-container">
            <div className="add-prescription-box">
                <h2>Yeni Reçete Ekle</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Hasta Adı</label>
                        <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Tanı</label>
                        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>İlaç Seç</label>
                        <select value={medicationName} onChange={(e) => setMedicationName(e.target.value)} required>
                            <option value="">İlaç Seçin</option>
                            {medications.map((med) => (
                                <option key={med.id} value={med.name}>
                                    {med.name} (Stok: {med.stock})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Dozaj</label>
                        <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Kullanım Süresi (Gün)</label>
                        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                    </div>
                    <button type="submit" className="submit-btn">Ekle</button>
                </form>
            </div>
        </div>
    );
};

export default AddPrescription;
