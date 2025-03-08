import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/Login.css"; // Yeni CSS dosyamızı ekledik

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await loginUser(email, password);
            login({ token: data.token, user: data.user });

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Giriş Yap</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Giriş Yap</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
