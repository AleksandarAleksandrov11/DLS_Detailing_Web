console.log("booking-form.js cargado");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    if (!form) return;

    const submitBtn = form.querySelector("button[type='submit']");

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

    // Campo oculto para guardar servicio principal
    let mainServiceInput = document.getElementById("mainService");
    if (!mainServiceInput) {
        mainServiceInput = document.createElement("input");
        mainServiceInput.type = "hidden";
        mainServiceInput.id = "mainService";
        form.appendChild(mainServiceInput);
    }

    // ===== DURACIONES =====
    const durations = {
        integral: "4h",
        interior: "2h",
        basico: "1h",
        asientos: "1.5h",
        pulido: "3h",
        domicilio: "Xh"
    };

    // ===== PRECIOS =====
    const prices = {
        integral: 144,
        interior: 99,
        basico: 39,
        asientos: 54,
        pulido: 70,
        domicilio: 50 // extra domicilio
    };

    // ===== FUNCIONES BOTÓN =====
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

    // Mensaje de confirmación
    const confirmationMessage = document.createElement("div");
    confirmationMessage.className = "confirmation-message";
    confirmationMessage.style.marginTop = "10px";
    confirmationMessage.style.color = "#e3be57";
    confirmationMessage.style.fontWeight = "bold";
    confirmationMessage.style.display = "none";
    submitBtn.insertAdjacentElement("afterend", confirmationMessage);

    // ===== FUNCIONES PARA ACTUALIZAR PRECIO Y DURACIÓN =====
    function updatePriceAndDuration() {
        const selectedService = serviceSelect.value;

        let priceText = "—";
        let durationText = "—";

        if (selectedService === "domicilio") {
            durationText = durations.domicilio;
            priceText = `Desde ${prices.domicilio}€`;

            const finalService = domicilioSelect.value;
            if (finalService) {
                durationText = durations[finalService];
                priceText = `Desde ${prices[finalService] + prices.domicilio}€`;
            }
        } else {
            durationText = durations[selectedService];
            priceText = `Desde ${prices[selectedService]}€`;
        }

        servicePrice.textContent = `Precio orientativo: ${priceText} · Duración aprox: ${durationText}`;
    }

    // ===== EVENTOS =====
    serviceSelect.addEventListener("change", () => {
        const selectedService = serviceSelect.value;

        if (selectedService !== "domicilio") mainServiceInput.value = selectedService;

        if (selectedService === "domicilio") {
            domicilioSelect?.setAttribute("required", "required");
            document.getElementById("domicilioServiceGroup").style.display = "block";
            document.getElementById("domicilioNotice").style.display = "block";
        } else {
            domicilioSelect?.removeAttribute("required");
            document.getElementById("domicilioServiceGroup").style.display = "none";
            document.getElementById("domicilioNotice").style.display = "none";
            domicilioSelect.value = "";
        }

        updatePriceAndDuration();
    });

    domicilioSelect?.addEventListener("change", updatePriceAndDuration);

    // ===== FORMATO FECHA =====
    function formatDate(date) {
        if (!date) return "";
        const [y, m, d] = date.split("-");
        return `${d}/${m}/${y}`;
    }

    // ===== SUBMIT =====
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
        const selectedService = serviceSelect.value;
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex]?.text || "No indicado";

        // Determinar precio y duración final para email y WhatsApp
        let finalPrice, serviceDuration;
        if (selectedService === "domicilio") {
            const finalService = domicilioSelect.value || "domicilio";
            serviceDuration = durations[finalService];
            finalPrice = `Desde ${prices[finalService] + prices.domicilio}€`;
        } else {
            serviceDuration = durations[selectedService];
            finalPrice = `Desde ${prices[selectedService]}€`;
        }

        // Mensajes WhatsApp
        const whatsappMessage = encodeURIComponent(
            `Hola ${name} 👋

Tras revisar las imágenes y el estado del vehículo, el precio final del servicio *${serviceText}* es de *${finalPrice}*.

📅 Fecha: ${formatDate(date)}
⏰ Hora: ${time}
⏳ Duración aprox: ${serviceDuration}

Si todo está correcto, confirmamos la reserva con esos datos.

— DLS Detailing`
        );

        const whatsappLink = phoneRaw ? `https://wa.me/34${phoneRaw}?text=${whatsappMessage}` : "No disponible";

        const whatsappChangeDateMessage = encodeURIComponent(
            `Hola ${name} 👋

Gracias por tu solicitud para el servicio *${serviceText}*.

Tras revisar las imágenes y el estado del vehículo, el precio final sería de *${finalPrice}*.

En la fecha y hora solicitadas no tenemos disponibilidad, pero podemos proponerte una nueva:

📅 Nueva fecha: XX/XX/XXXX
⏰ Nueva hora: XX:XX
⏳ Duración aprox: ${serviceDuration}

Dinos si te encaja o si prefieres otra opción.

— DLS Detailing`
        );

        const whatsappChangeDateLink = phoneRaw ? `https://wa.me/34${phoneRaw}?text=${whatsappChangeDateMessage}` : "No disponible";

        // Datos para EmailJS
        const data = {
            name: name,
            phone: document.getElementById("phone").value.trim() || "Sin teléfono",
            service: serviceText,
            duration: serviceDuration,
            domicilioService: domicilioSelect ? domicilioSelect.options[domicilioSelect.selectedIndex].text : "No aplica",
            carModel: document.getElementById("carModel").value.trim() || "No especificado",
            date: date,
            time: time,
            notes: document.getElementById("notes").value.trim() || "Sin notas",
            images: imageLinks,
            price: finalPrice,
            whatsappLink: whatsappLink,
            whatsappChangeDateLink: whatsappChangeDateLink
        };

        try {
            await emailjs.send("service_8h46z8p", "template_pcq0h6o", data);

            btnText.textContent = "✔ Enviado";
            confirmationMessage.textContent = "✅ Hemos recibido su reserva y nos pondremos en contacto pronto con usted.";
            confirmationMessage.style.display = "block";

            setTimeout(() => {
                form.reset();
                if (servicePrice) servicePrice.textContent = "Precio orientativo: —";
                mainServiceInput.value = "";
                setLoading(false);
            }, 1500);

        } catch (error) {
            alert("Error al enviar la solicitud");
            setLoading(false);
        }
    });

});
