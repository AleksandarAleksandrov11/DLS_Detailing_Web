console.log("Cargando EmailJS...");

document.addEventListener("DOMContentLoaded", () => {
    emailjs.init({
        publicKey: "-7iES4wNDIw5RIkR_",
    });
    console.log("EmailJS inicializado (v4)");
});
