// src/services/guestService.js

// Fungsi untuk menambahkan tamu (simulasi kirim ke server / API)
export const addGuest = async (guestData) => {
  try {
    // ✅ Untuk saat ini kita hanya log ke console
    console.log("Menambahkan tamu:", guestData);

    // Simulasi kirim ke backend
    // await fetch("/api/tamu", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(guestData),
    // });

    return true;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengirim data:", error);
    return false;
  }
};
