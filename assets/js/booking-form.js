console.log("booking-form.js cargado");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    if (!form) {
        console.error("No se encuentra el formulario #bookingForm");
        return;
    }

    const submitBtn = form.querySelector("button[type='submit']");

    // ===== TEXTO BOTÓN =====
    let btnText = submitBtn.querySelector("span");
    if (!btnText) {
        btnText = document.createElement("span");
        btnText.textContent = submitBtn.textContent;
        submitBtn.textContent = "";
        submitBtn.appendChild(btnText);
    }

    let spinner = submitBtn.querySelector(".spinner");
    if (spinner) spinner.remove();

    const serviceSelect = document.getElementById("service");
    const domicilioSelect = document.getElementById("domicilioService");
    const servicePrice = document.getElementById("servicePrice");
    const fileInput = document.getElementById("carImages");

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add("loading");

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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        setLoading(true);

        let imageLinks = "No se adjuntaron imágenes";

        try {
            if (fileInput && fileInput.files.length > 0) {
                const urls = await uploadImages(fileInput.files);
                imageLinks = urls.join("\n");
            }
        } catch (err) {
            alert("Error al subir las imágenes");
            setLoading(false);
            return;
        }

        const name = document.getElementById("name").value.trim() || "Sin nombre";
        const phoneRaw = document.getElementById("phone").value.replace(/\D/g, "");
        const date = document.getElementById("date").value || "No seleccionada";
        const time = document.getElementById("time").value || "No seleccionada";
        const finalPrice = "XXX€";

        function formatDate(date) {
            if (!date) return "";
            const [y, m, d] = date.split("-");
            return `${d}/${m}/${y}`;
        }

        const serviceText = serviceSelect
            ? serviceSelect.options[serviceSelect.selectedIndex].text
            : "No indicado";

        // ===== MENSAJE WHATSAPP NORMAL =====
        const whatsappMessage = encodeURIComponent(
`Hola ${name} 👋

Tras revisar las imágenes y el estado del vehículo, el precio final del servicio *${serviceText}* es de *${finalPrice}*.

📅 Fecha: ${formatDate(date)}
⏰ Hora: ${time}

Si todo está correcto, confirmamos la reserva con esos datos.

— DLS Detailing`
        );

        const whatsappLink = phoneRaw
            ? `https://wa.me/34${phoneRaw}?text=${whatsappMessage}`
            : "No disponible";

        // ===== MENSAJE WHATSAPP CAMBIO DE FECHA =====
        const whatsappChangeDateMessage = encodeURIComponent(
`Hola ${name} 👋

Gracias por tu solicitud para el servicio *${serviceText}*.

Tras revisar las imágenes y el estado del vehículo, el precio final sería de *${finalPrice}*.

En la fecha y hora solicitadas no tenemos disponibilidad, pero podemos proponerte una nueva:

📅 Nueva fecha: XX/XX/XXXX
⏰ Nueva hora: XX:XX

Dinos si te encaja o si prefieres otra opción.

— DLS Detailing`
        );

        const whatsappChangeDateLink = phoneRaw
            ? `https://wa.me/34${phoneRaw}?text=${whatsappChangeDateMessage}`
            : "No disponible";

        const data = {
            name: name,
            phone: document.getElementById("phone").value.trim() || "Sin teléfono",
            service: serviceText,
            domicilioService: domicilioSelect
                ? domicilioSelect.options[domicilioSelect.selectedIndex].text
                : "No aplica",
            carModel: document.getElementById("carModel").value.trim() || "No especificado",
            date: date,
            time: time,
            notes: document.getElementById("notes").value.trim() || "Sin notas",
            images: imageLinks,
            price: servicePrice ? servicePrice.textContent : "No indicado",
            whatsappLink: whatsappLink,
            whatsappChangeDateLink: whatsappChangeDateLink
        };

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
            alert("Error al enviar la solicitud");
            setLoading(false);
        }
    });

});
