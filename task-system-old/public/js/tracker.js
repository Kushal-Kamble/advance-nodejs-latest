// public/js/tracker.js
// छोटी utility: browser से location/time लेकर server पर भेजना (optional)

export async function sendLocationPing(url) {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(async pos => {
    const payload = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      timestamp: new Date().toISOString()
    };
    try {
      const token = localStorage.getItem("token");
      await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Location ping failed", err);
    }
  }, err => {
    console.warn("Geolocation error", err);
  });
}
