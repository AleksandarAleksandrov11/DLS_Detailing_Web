console.log("Cargando EmailJS...");

document.addEventListener("DOMContentLoaded", () => {
    emailjs.init({
        publicKey: "OM1X-CYb1Bt9RH62U",
    });
    console.log("EmailJS inicializado (v4)");
});
