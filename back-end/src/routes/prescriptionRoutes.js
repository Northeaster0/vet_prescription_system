const express = require('express');
const {
    createPrescription,
    getPrescriptions,
    updatePrescription,
    deletePrescription,
    getAllPrescriptions,
    getPrescriptionById,
    getAllMedications 
} = require('../controllers/prescriptionController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Reçete ekleme
router.post('/', authenticateToken, createPrescription);

// Kullanıcının kendi reçeteleri
router.get('/', authenticateToken, getPrescriptions);

// Tüm reçeteleri listeleme (Admin için)
router.get('/all', authenticateToken, getAllPrescriptions);

// Belirli bir reçeteyi getirme
router.get('/:id', authenticateToken, getPrescriptionById);

// Reçete güncelleme
router.put('/update/:id', authenticateToken, updatePrescription);

// Reçete silme
router.delete('/delete/:id', authenticateToken, deletePrescription);

// Tüm ilaçları listeleme (Stokları görüntüleme)
router.get('/medications', authenticateToken, getAllMedications); // ✅ Yeni route eklendi

module.exports = router;
