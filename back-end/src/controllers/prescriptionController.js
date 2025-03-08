const db = require('../models/db');


const createPrescription = async (req, res) => {
    const { patient_name, diagnosis, medication, dosage, duration } = req.body;
    const user_id = req.user.id; // JWT ile doğrulanmış kullanıcıdan gelen ID

    try {
        // 📌 İlaç adını kullanarak ilacı veritabanında bul
        const [med] = await db.query(
            "SELECT name, stock FROM medications WHERE LOWER(name) = LOWER(?)",
            [medication]
        );

        if (!med.length) {
            return res.status(400).json({ message: "İlaç bulunamadı, lütfen doğru ismi giriniz." });
        }

        if (med[0].stock <= 0) {
            return res.status(400).json({ message: "Bu ilaç stokta yok." });
        }

        // 📌 Reçeteyi veritabanına ekle
        const [result] = await db.query(
            "INSERT INTO prescriptions (user_id, patient_name, diagnosis, medication, dosage, duration) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, patient_name, diagnosis, med[0].name, dosage, duration]
        );

        // 📌 Stoktan 1 azalt
        await db.query(
            "UPDATE medications SET stock = stock - 1 WHERE name = ? AND stock > 0",
            [med[0].name]
        );

        res.status(201).json({ 
            message: "Reçete başarıyla oluşturuldu, stok güncellendi.",
            prescriptionId: result.insertId,
            remainingStock: med[0].stock - 1
        });

    } catch (error) {
        console.error("🚨 Reçete ekleme hatası:", error);
        res.status(500).json({ message: "Reçete eklenirken hata oluştu.", error: error.message });
    }
};


// Kullanıcının kendi reçetelerini listeleme
const getPrescriptions = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [prescriptions] = await db.query("SELECT * FROM prescriptions WHERE user_id = ?", [user_id]);
        res.status(200).json({ prescriptions });
    } catch (error) {
        console.error("🚨 Kullanıcı reçetelerini getirme hatası:", error);
        res.status(500).json({ message: "Reçeteleri çekerken hata oluştu.", error: error.message });
    }
};

// Tüm reçeteleri listeleme
const getAllPrescriptions = async (req, res) => {
    try {
        const [prescriptions] = await db.query("SELECT * FROM prescriptions");
        res.status(200).json({ prescriptions });
    } catch (error) {
        console.error("🚨 Tüm reçeteleri getirme hatası:", error);
        res.status(500).json({ message: "Tüm reçeteleri çekerken hata oluştu.", error: error.message });
    }
};

// Reçete ID'ye göre getirme
const getPrescriptionById = async (req, res) => {
    const { id } = req.params;

    try {
        const [prescription] = await db.query("SELECT * FROM prescriptions WHERE id = ?", [id]);

        if (!prescription.length) {
            return res.status(404).json({ message: "Reçete bulunamadı." });
        }

        res.status(200).json(prescription[0]);
    } catch (error) {
        console.error("🚨 Reçete getirme hatası:", error);
        res.status(500).json({ message: "Reçete getirilirken hata oluştu.", error: error.message });
    }
};

// Reçete güncelleme
const updatePrescription = async (req, res) => {
    const { patient_name, diagnosis, medication, dosage, duration } = req.body;
    const prescriptionId = req.params.id;

    try {
        const [existingPrescription] = await db.query("SELECT * FROM prescriptions WHERE id = ?", [prescriptionId]);

        if (!existingPrescription.length) {
            return res.status(404).json({ message: "Reçete bulunamadı." });
        }

        await db.query(
            "UPDATE prescriptions SET patient_name = ?, diagnosis = ?, medication = ?, dosage = ?, duration = ? WHERE id = ?",
            [patient_name, diagnosis, medication, dosage, duration, prescriptionId]
        );

        res.status(200).json({ message: "Reçete başarıyla güncellendi." });
    } catch (error) {
        console.error("🚨 Reçete güncelleme hatası:", error);
        res.status(500).json({ message: "Reçete güncellenirken hata oluştu.", error: error.message });
    }
};

// Reçete silme + Stok Güncelleme
const deletePrescription = async (req, res) => {
    const prescriptionId = req.params.id;

    try {
        const [existingPrescription] = await db.query("SELECT * FROM prescriptions WHERE id = ?", [prescriptionId]);

        if (!existingPrescription.length) {
            return res.status(404).json({ message: "Reçete bulunamadı." });
        }

        const { medication } = existingPrescription[0];

        await db.query("UPDATE medications SET stock = stock + 1 WHERE name = ?", [medication]);

        await db.query("DELETE FROM prescriptions WHERE id = ?", [prescriptionId]);

        res.status(200).json({ message: "Reçete başarıyla silindi, stok güncellendi." });
    } catch (error) {
        console.error("🚨 Reçete silme hatası:", error);
        res.status(500).json({ message: "Reçete silinirken hata oluştu.", error: error.message });
    }
};

// İlaç stok bilgisi getirme
const getMedicationStock = async (req, res) => {
    const { name } = req.params;

    try {
        const [med] = await db.query("SELECT stock FROM medications WHERE name = ?", [name]);

        if (!med.length) {
            return res.status(404).json({ message: "İlaç bulunamadı." });
        }

        res.status(200).json({ stock: med[0].stock });
    } catch (error) {
        console.error("🚨 Stok bilgisi alma hatası:", error);
        res.status(500).json({ message: "Stok bilgisi alınırken hata oluştu.", error: error.message });
    }
};

// **Tüm ilaçları listeleme (Stokları görüntüleme)**
const getAllMedications = async (req, res) => {
    try {
        const [medications] = await db.query("SELECT * FROM medications");
        res.status(200).json(medications);
    } catch (error) {
        console.error("🚨 Stok bilgisi alma hatası:", error);
        res.status(500).json({ message: "Stok bilgisi alınırken hata oluştu.", error: error.message });
    }
};

// **Fonksiyonları dışa aktarma**
module.exports = { 
    createPrescription, 
    getPrescriptions, 
    getAllPrescriptions, 
    getPrescriptionById, 
    updatePrescription, 
    deletePrescription, 
    getMedicationStock,
    getAllMedications
};
