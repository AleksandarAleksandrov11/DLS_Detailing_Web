console.log("booking-form.js cargado");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");

    if (!form) {
        console.error("No se encuentra el formulario #bookingForm");
        return;
    }

    const serviceSelect = document.getElementById("service");
    const domicilioSelect = document.getElementById("domicilioService");
    const servicePrice = document.getElementById("servicePrice");
    const fileInput = document.getElementById("carImages");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Formulario enviado");

        let imageLinks = "No se adjuntaron imágenes";

        try {
            if (fileInput && fileInput.files.length > 0) {
                console.log("Subiendo imágenes...");
                const urls = await uploadImages(fileInput.files);
                imageLinks = urls.join("\n");
            }
        } catch (uploadError) {
            console.error("Error subiendo imágenes:", uploadError);
            alert("Error al subir las imágenes");
            return;
        }

        const data = {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            service: serviceSelect
                ? serviceSelect.options[serviceSelect.selectedIndex].text
                : "No indicado",
            domicilioService: domicilioSelect && domicilioSelect.value
                ? domicilioSelect.options[domicilioSelect.selectedIndex].text
                : "No aplica",
            carModel: document.getElementById("carModel").value.trim(),

            date: document.getElementById("date").value,
            time: document.getElementById("time").value,

            notes: document.getElementById("notes").value.trim() || "Sin notas",
            images: imageLinks,
            price: servicePrice ? servicePrice.textContent : "No indicado"
        };

        console.log("Datos enviados a EmailJS:", data);

        try {
            await emailjs.send(
                "service_q6rbwie",       // TU SERVICE ID
                "template_jn1rxfb",      // TU TEMPLATE ID
                data
            );

            alert("Solicitud enviada correctamente. Te contactaremos pronto.");
            form.reset();

            if (servicePrice) {
                servicePrice.textContent = "Precio orientativo: —";
            }

        } catch (error) {
            console.error("ERROR EMAILJS:", error);
            alert("Error al enviar la solicitud. Revisa la consola.");
        }
    });
});
