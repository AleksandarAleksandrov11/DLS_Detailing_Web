console.log("booking-form.js cargado");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    if (!form) {
        console.error("No se encuentra el formulario #bookingForm");
        return;
    }

    const submitBtn = form.querySelector("button[type='submit']");

    // Creamos un span para el texto si no existe
    let btnText = submitBtn.querySelector("span");
    if (!btnText) {
        btnText = document.createElement("span");
        btnText.textContent = submitBtn.textContent;
        submitBtn.textContent = "";
        submitBtn.appendChild(btnText);
    }

    // Asegurarnos de que no haya spinner al inicio
    let spinner = submitBtn.querySelector(".spinner");
    if (spinner) spinner.remove();

    const serviceSelect = document.getElementById("service");
    const domicilioSelect = document.getElementById("domicilioService");
    const servicePrice = document.getElementById("servicePrice");
    const fileInput = document.getElementById("carImages");

    // ===== SPINNER =====
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add("loading");

            // Crear spinner solo si no existe
            spinner = document.createElement("span");
            spinner.className = "spinner";
            submitBtn.insertBefore(spinner, btnText);

            btnText.textContent = "Enviando...";
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove("loading");

            if (spinner) spinner.remove();
            btnText.textContent = "SOLICITAR PRESUPUESTO";
        }
    }

    // ===== SUBMIT =====
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Formulario enviado");

        setLoading(true);

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
            setLoading(false);
            return;
        }

        const data = {
            name: document.getElementById("name").value.trim() || "Sin nombre",
            phone: document.getElementById("phone").value.trim() || "Sin teléfono",
            service: serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : "No indicado",
            domicilioService: domicilioSelect && domicilioSelect.value ? domicilioSelect.options[domicilioSelect.selectedIndex].text : "No aplica",
            carModel: document.getElementById("carModel").value.trim() || "No especificado",
            date: document.getElementById("date").value || "No seleccionada",
            time: document.getElementById("time").value || "No seleccionada",
            notes: document.getElementById("notes").value.trim() || "Sin notas",
            images: imageLinks,
            price: servicePrice ? servicePrice.textContent : "No indicado"
        };

        console.log("Datos enviados a EmailJS:", data);

        try {
            await emailjs.send(
                "service_8h46z8p",
                "template_pcq0h6o",
                data
            );

            btnText.textContent = "✔ Enviado";
            setTimeout(() => {
                form.reset();
                if (servicePrice) servicePrice.textContent = "Precio orientativo: —";
                setLoading(false);
            }, 1500);

        } catch (error) {
            console.error("ERROR EMAILJS:", error);
            alert("Error al enviar la solicitud. Revisa la consola.");
            setLoading(false);
        }
    });

});
