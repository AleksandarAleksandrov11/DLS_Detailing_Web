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

    // ===== HORA =====
    timeInput.min = "09:00";
    timeInput.max = "20:00";
    timeInput.step = 900; // 15 min

    // ===== PRECIOS =====
    const prices = {
        integral: "Desde 144€",
        interior: "Desde 99€",
        basico: "Desde 39€",
        asientos: "Desde 54€",
        pulido: "Desde 70€",
        domicilio: "Desde 50€"
    };

    // ===== SERVICIO =====
    serviceSelect.addEventListener("change", () => {
        const selectedService = serviceSelect.value;

        servicePrice.textContent = prices[selectedService]
            ? `Precio orientativo: ${prices[selectedService]}`
            : "Precio orientativo: —";

        if (selectedService === "domicilio") {
            domicilioGroup && (domicilioGroup.style.display = "block");
            domicilioNotice && (domicilioNotice.style.display = "block");
            domicilioSelect?.setAttribute("required", "required");
        } else {
            domicilioGroup && (domicilioGroup.style.display = "none");
            domicilioNotice && (domicilioNotice.style.display = "none");
            if (domicilioSelect) {
                domicilioSelect.removeAttribute("required");
                domicilioSelect.value = "";
            }
        }
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


});
