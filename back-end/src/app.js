const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicationRoutes = require("./routes/medicationRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use("/api/medications", medicationRoutes);

// **Ana dizine (`/`) girildiğinde otomatik yönlendirme yap**
app.get('/', (req, res) => {
    res.redirect('/login'); // Ana sayfaya girenleri otomatik olarak `/login`e yönlendir
});

// **Eğer bilinmeyen bir rota girilirse hata döndür**
app.use((req, res) => {
    res.status(404).json({ message: "❌ Route not found!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
