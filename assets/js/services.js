document.addEventListener("DOMContentLoaded", () => {

    // ===== ELEMENTOS =====
    const form = document.getElementById("bookingForm");

    const serviceSelect = document.getElementById("service");
    const domicilioGroup = document.getElementById("domicilioServiceGroup");
    const domicilioSelect = document.getElementById("domicilioService");
    const domicilioNotice = document.getElementById("domicilioNotice");
    const servicePrice = document.getElementById("servicePrice");

    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");

    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn?.querySelector(".btn-text");

    if (!form || !serviceSelect || !servicePrice || !dateInput || !timeInput || !submitBtn || !btnText) {
        console.warn("Faltan elementos del formulario");
        return;
    }

    // ===== FECHA =====
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;

    // ===== HORA (select cada 15 min) =====
    function generateTimeOptions() {
        const startHour = 8;
        const endHour = 21;

        timeInput.innerHTML = '<option value="">Selecciona una hora</option>';

        for (let h = startHour; h <= endHour; h++) {
            for (let m = 0; m < 60; m += 15) {
                if (h === endHour && m > 0) continue;

                const hour = String(h).padStart(2, "0");
                const min = String(m).padStart(2, "0");
                const value = `${hour}:${min}`;

                const option = document.createElement("option");
                option.value = value;
                option.textContent = value;

                timeInput.appendChild(option);
            }
        }
    }

    generateTimeOptions();

    // ===== PRECIOS =====
    const prices = {
        integral: 144,
        interior: 99,
        basico: 39,
        asientos: 54,
        pulido: 70,
        domicilio: 50 // extra domicilio
    };

    // ===== DURACIONES =====
    const durations = {
        integral: "4h",
        interior: "2h",
        basico: "1h",
        asientos: "1.5h",
        pulido: "3h",
        domicilio: "Xh"
    };

    // ===== SERVICIO PRINCIPAL =====
    serviceSelect.addEventListener("change", () => {
        const selectedService = serviceSelect.value;

        if (selectedService === "domicilio") {
            // Mostrar select de servicio final
            domicilioGroup && (domicilioGroup.style.display = "block");
            domicilioNotice && (domicilioNotice.style.display = "block");
            domicilioSelect?.setAttribute("required", "required");

            // Precio y duración temporal para domicilio
            servicePrice.textContent = `Precio orientativo: Desde ${prices.domicilio}€ · Duración aprox: ${durations.domicilio}`;
        } else {
            // Ocultar select de servicio final
            domicilioGroup && (domicilioGroup.style.display = "none");
            domicilioNotice && (domicilioNotice.style.display = "none");
            if (domicilioSelect) {
                domicilioSelect.removeAttribute("required");
                domicilioSelect.value = "";
            }

            // Precio y duración normales
            const priceText = prices[selectedService] ? `Desde ${prices[selectedService]}€` : "—";
            const durationText = durations[selectedService] ? durations[selectedService] : "—";
            servicePrice.textContent = `Precio orientativo: ${priceText} · Duración aprox: ${durationText}`;
        }
    });

    // ===== SERVICIO FINAL A DOMICILIO =====
    domicilioSelect?.addEventListener("change", () => {
        const finalService = domicilioSelect.value;
        if (!finalService) return;

        const basePrice = prices[finalService] || 0;
        const totalPrice = basePrice + prices.domicilio; // sumar extra domicilio
        const durationText = durations[finalService] || "—";

        servicePrice.textContent = `Precio orientativo: Desde ${totalPrice}€ · Duración aprox: ${durationText}`;
    });

    // ===== FORMATO FECHA / HORA =====
    dateInput.addEventListener("change", () => {
        dateInput.dataset.formatted = formatDate(dateInput.value);
    });

    timeInput.addEventListener("change", () => {
        timeInput.dataset.formatted = timeInput.value;
    });

    function formatDate(date) {
        if (!date) return "";
        const [y, m, d] = date.split("-");
        return `${d}/${m}/${y}`;
    }

    // ===== SUBIDA DE IMÁGENES =====
    const fileInput = document.getElementById("carImages");
    const fileList = document.getElementById("fileList");

    let storedFiles = [];

    if (fileInput && fileList) {
        fileInput.addEventListener("change", () => {
            const newFiles = Array.from(fileInput.files);

            newFiles.forEach(file => {
                if (!file.type.startsWith("image/")) return;
                if (storedFiles.length >= 5) return;

                storedFiles.push(file);
                createPreview(file);
            });

            if (storedFiles.length > 5) {
                storedFiles = storedFiles.slice(0, 5);
                alert("Máximo 5 imágenes.");
            }

            updateFileInput();
            fileInput.value = "";
        });
    }

    function createPreview(file) {
        const reader = new FileReader();

        reader.onload = e => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("image-preview-wrapper");

            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("preview-image");

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.innerHTML = "✕";
            removeBtn.classList.add("remove-image-btn");

            removeBtn.addEventListener("click", () => {
                storedFiles = storedFiles.filter(f => f !== file);
                wrapper.remove();
                updateFileInput();
            });

            wrapper.appendChild(img);
            wrapper.appendChild(removeBtn);
            fileList.appendChild(wrapper);
        };

        reader.readAsDataURL(file);
    }

    function updateFileInput() {
        const dataTransfer = new DataTransfer();
        storedFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
    }

});
