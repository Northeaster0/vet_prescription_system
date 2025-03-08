const express = require("express");
const db = require("../models/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// **Tüm ilaçları listele (Stokları görüntüle)**
router.get("/", authenticateToken, async (req, res) => {
    try {
        const [medications] = await db.query("SELECT * FROM medications");
        res.status(200).json(medications);
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "İlaç bilgileri alınırken hata oluştu." });
    }
});

// **Stokta olan ilaçları listele**
router.get("/available", authenticateToken, async (req, res) => {
    try {
        const [medications] = await db.query("SELECT name FROM medications WHERE stock > 0");
        res.status(200).json({ medications });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Stokta olan ilaçlar alınırken hata oluştu." });
    }
});

// **Belirli bir ilacın stok bilgisini al**
router.get("/:name", authenticateToken, async (req, res) => {
    try {
        const { name } = req.params;
        const [med] = await db.query("SELECT stock FROM medications WHERE name = ?", [name]);

        if (!med.length) {
            return res.status(404).json({ message: "İlaç bulunamadı." });
        }

        res.status(200).json({ stock: med[0].stock });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "İlaç stok bilgisi alınırken hata oluştu." });
    }
});

// 🔹 **İlaç stokunu artır (Reçete güncellenirken eski ilacı geri ekleme)**
router.put("/increase/:name", authenticateToken, async (req, res) => {
    try {
        const { name } = req.params;
        await db.query("UPDATE medications SET stock = stock + 1 WHERE name = ?", [name]);
        res.status(200).json({ message: "Stok artırıldı." });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Stok artırma hatası.", error: error.message });
    }
});

// 🔹 **İlaç stokunu azalt (Reçete güncellenirken yeni ilaç stoğunu düşme)**
router.put("/decrease/:name", authenticateToken, async (req, res) => {
    try {
        const { name } = req.params;
        await db.query("UPDATE medications SET stock = stock - 1 WHERE name = ? AND stock > 0", [name]);
        res.status(200).json({ message: "Stok azaltıldı." });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Stok azaltma hatası.", error: error.message });
    }
});
// Stok azaltma endpointi
router.put("/decrease/:name", authenticateToken, async (req, res) => {
    try {
        const { name } = req.params;
        await db.query("UPDATE medications SET stock = GREATEST(stock - 1, 0) WHERE name = ?", [name]);
        res.status(200).json({ message: "Stok 1 azaltıldı." });
    } catch (error) {
        console.error("🛑 Stok azaltma hatası:", error);
        res.status(500).json({ message: "Stok azaltılırken hata oluştu." });
    }
});

module.exports = router;
