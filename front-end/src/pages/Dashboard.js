import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Eğer kullanıcı giriş yapmamışsa, otomatik olarak giriş ekranına yönlendir
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    // Eğer kullanıcı verisi henüz yüklenmediyse boş ekran göster
    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-box">
                <h2>Hoşgeldin, {user.user.name}!</h2>
                <p>Seçeneklerden birini seçerek işlem yapabilirsin.</p>

                <div className="dashboard-buttons">
                    <button className="dashboard-btn" onClick={() => navigate("/prescriptions")}>
                        📄 Reçeteler
                    </button>
                    <button className="dashboard-btn" onClick={() => navigate("/add-prescription")}>
                        ➕ Yeni Reçete Ekle
                    </button>
                    <button className="dashboard-btn" onClick={() => navigate("/stock")}>
                        📦 Stokları Görüntüle
                    </button>
                </div>

                <button className="logout-btn" onClick={logout}>
                    🚪 Çıkış Yap
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
