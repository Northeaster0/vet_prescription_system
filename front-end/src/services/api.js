const API_URL = "http://localhost:5001/api"; // Back-end’in çalıştığı portu kullan

export const addPrescription = async (token, prescriptionData) => {
    const response = await fetch(`${API_URL}/prescriptions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(prescriptionData),
    });

    if (!response.ok) {
        throw new Error("Reçete eklenemedi.");
    }

    return response.json();
};

export const getMedications = async (token) => {
    const response = await fetch(`${API_URL}/medications`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("İlaç bilgileri alınamadı.");
    }

    return response.json();
};


export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Giriş başarısız. Bilgilerinizi kontrol edin.");
    }

    return response.json();
};

export const getPrescriptions = async (token) => {
    const response = await fetch(`${API_URL}/prescriptions`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Reçeteler yüklenemedi.");
    }

    return response.json();
};

export const getStock = async (token) => {
    const response = await fetch(`${API_URL}/medications`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Stok bilgileri yüklenemedi.");
    }

    return response.json();
};


export const deletePrescription = async (token, id) => {
    const response = await fetch(`${API_URL}/prescriptions/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Reçete silinemedi!");
    }

    return { success: true };
};

