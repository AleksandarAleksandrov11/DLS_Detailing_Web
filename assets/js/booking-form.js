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
    const ceramicSelect = document.getElementById("ceramicProtection");
    const ceramicGroup = document.getElementById("ceramicProtectionGroup");
    const servicePrice = document.getElementById("servicePrice");
    const fileInput = document.getElementById("carImages");

    // ===== SERVICIO FINAL REAL =====
    function getFinalService() {
        return serviceSelect.value === "domicilio" ? domicilioSelect.value || null : serviceSelect.value;
    }

    // ===== PRECIOS =====
    const prices = {
        integral: 149,
        interior: 119,
        basico: 39,
        asientos: 55,
        pulidoFaros: 49,
        pulido1: 219,
        pulido2: 319,
        pulido3: 499,
        domicilio: 30
    };

    // ===== CERÁMICA =====
    const ceramicPrices = {
        "1year": 50,
        "5years": 105,
        "7years": 140
    };
    const ceramicServices = ["pulido1", "pulido2", "pulido3"];
    function shouldShowCeramic() {
        return ceramicServices.includes(getFinalService());
    }
    function getCeramicExtra() {
        return ceramicPrices[ceramicSelect?.value] || 0;
    }

    // ===== DURACIONES =====
    const durations = {
        integral: "4-7h",
        interior: "3-5h",
        basico: "1-2h",
        asientos: "1-2h",
        pulidoFaros: "1-2h",
        pulido1: "6-8h",
        pulido2: "8-12h",
        pulido3: "24-72h",
        domicilio: "Xh"
    };

    // ===== BOTÓN =====
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

    // ===== MENSAJE CONFIRMACIÓN =====
    const confirmationMessage = document.createElement("div");
    confirmationMessage.className = "confirmation-message";
    confirmationMessage.style.marginTop = "10px";
    confirmationMessage.style.color = "#e3be57";
    confirmationMessage.style.fontWeight = "bold";
    confirmationMessage.style.display = "none";
    submitBtn.insertAdjacentElement("afterend", confirmationMessage);

    // ===== ACTUALIZAR PRECIO Y DURACIÓN =====
    function updatePriceAndDuration() {
        const selectedService = serviceSelect.value;
        const finalService = getFinalService();
        let ceramicExtra = ceramicServices.includes(finalService) ? getCeramicExtra() : 0;

        let priceText = "—";
        let durationText = "—";

        if (selectedService === "domicilio") {
            if (finalService) {
                durationText = durations[finalService];
                priceText = `Desde ${prices[finalService] + prices.domicilio + ceramicExtra}€`;
            }
        } else {
            durationText = durations[selectedService];
            priceText = `Desde ${prices[selectedService] + ceramicExtra}€`;
        }

        servicePrice.textContent = `Precio orientativo: ${priceText} · Duración aprox: ${durationText}`;
    }

    // ===== EVENTOS =====
    function handleServiceChange() {
        if (serviceSelect.value === "domicilio") {
            domicilioSelect.setAttribute("required", "required");
            document.getElementById("domicilioServiceGroup").style.display = "block";
            document.getElementById("domicilioNotice").style.display = "block";
        } else {
            domicilioSelect.removeAttribute("required");
            domicilioSelect.value = "";
            document.getElementById("domicilioServiceGroup").style.display = "none";
            document.getElementById("domicilioNotice").style.display = "none";
        }

        if (shouldShowCeramic()) {
            ceramicGroup.style.display = "block";
        } else {
            ceramicGroup.style.display = "none";
            ceramicSelect.value = "";
        }

        updatePriceAndDuration();
    }

    serviceSelect.addEventListener("change", handleServiceChange);
    domicilioSelect.addEventListener("change", handleServiceChange);
    ceramicSelect.addEventListener("change", updatePriceAndDuration);

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
        } catch {
            alert("Error al subir las imágenes");
            setLoading(false);
            return;
        }

        const name = document.getElementById("name").value.trim() || "Sin nombre";
        const phoneRaw = document.getElementById("phone").value.replace(/\D/g, "");
        const date = document.getElementById("date").value || "No seleccionada";
        const time = document.getElementById("time").value || "No seleccionada";

        const selectedService = serviceSelect.value;
        const finalService = getFinalService();
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex]?.text || "No indicado";
        const ceramicText = ceramicSelect?.options[ceramicSelect.selectedIndex]?.text || "Sin protección cerámica";

        let finalPrice = 0;
        let serviceDuration = "";

        if (selectedService === "domicilio") {
            serviceDuration = durations[finalService];
            finalPrice = prices[finalService] + prices.domicilio + (ceramicServices.includes(finalService) ? getCeramicExtra() : 0);
        } else {
            serviceDuration = durations[selectedService];
            finalPrice = prices[selectedService] + (ceramicServices.includes(finalService) ? getCeramicExtra() : 0);
        }

        // ===== MENSAJES WHATSAPP =====
        const whatsappMessage = encodeURIComponent(
            `Hola ${name} 👋

Tras revisar las imágenes y el estado del vehículo, el precio final del servicio *${serviceText}* es de *${finalPrice}€*.

📅 Fecha: ${formatDate(date)}
⏰ Hora: ${time}
⏳ Duración aprox: ${serviceDuration}

Si todo está correcto, confirmamos la reserva con esos datos.

— DLS Detailing`
        );

        const whatsappChangeDateMessage = encodeURIComponent(
            `Hola ${name} 👋

Gracias por tu solicitud para el servicio *${serviceText}*.

Tras revisar las imágenes y el estado del vehículo, el precio final sería de *${finalPrice}€*.

En la fecha y hora solicitadas no tenemos disponibilidad, pero podemos proponerte una nueva:

📅 Nueva fecha: XX/XX/XXXX
⏰ Nueva hora: XX:XX
⏳ Duración aprox: ${serviceDuration}

Dinos si te encaja o si prefieres otra opción.

— DLS Detailing`
        );

        const whatsappLink = phoneRaw ? `https://wa.me/34${phoneRaw}?text=${whatsappMessage}` : "No disponible";
        const whatsappChangeDateLink = phoneRaw ? `https://wa.me/34${phoneRaw}?text=${whatsappChangeDateMessage}` : "No disponible";

        const data = {
            name,
            phone: document.getElementById("phone").value.trim() || "Sin teléfono",
            service: serviceText,
            ceramic: ceramicText,
            duration: serviceDuration,
            domicilioService: domicilioSelect ? domicilioSelect.options[domicilioSelect.selectedIndex].text : "No aplica",
            carModel: document.getElementById("carModel").value.trim() || "No especificado",
            date,
            time,
            notes: document.getElementById("notes").value.trim() || "Sin notas",
            images: imageLinks,
            price: `Desde ${finalPrice}€`,
            whatsappLink,
            whatsappChangeDateLink
        };

        try {
            await emailjs.send("service_8h46z8p", "template_pcq0h6o", data);

            btnText.textContent = "✔ Enviado";
            confirmationMessage.textContent = "✅ Hemos recibido su reserva y nos pondremos en contacto pronto con usted.";
            confirmationMessage.style.display = "block";

            setTimeout(() => {
                form.reset();
                servicePrice.textContent = "Precio orientativo: —";
                ceramicGroup.style.display = "none";
                setLoading(false);
            }, 1500);

        } catch {
            alert("Error al enviar la solicitud");
            setLoading(false);
        }
    });

});
