document.addEventListener('DOMContentLoaded', () => {
    const serviceSelect = document.getElementById("service");
    const domicilioGroup = document.getElementById("domicilioServiceGroup");
    const domicilioSelect = document.getElementById("domicilioService");
    const domicilioNotice = document.getElementById("domicilioNotice");
    const servicePrice = document.getElementById("servicePrice");

    const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;

    // Precios orientativos
    const prices = {
        integral: "Desde 144€",
        interior: "Desde 99€",
        basico: "Desde 39€",
        asientos: "Desde 54€",
        pulido: "Desde 70€",
        domicilio: "Desde 50€"
    };

    serviceSelect.addEventListener("change", () => {
        const selectedService = serviceSelect.value;

        // Mostrar precio
        if (prices[selectedService]) {
            servicePrice.textContent = `Precio orientativo: ${prices[selectedService]}`;
        } else {
            servicePrice.textContent = "Precio orientativo: —";
        }

        // Mostrar servicios a domicilio
        if (selectedService === "domicilio") {
            domicilioGroup.style.display = "block";
            domicilioNotice.style.display = "block";
            domicilioSelect.setAttribute("required", "required");
        } else {
            domicilioGroup.style.display = "none";
            domicilioNotice.style.display = "none";
            domicilioSelect.removeAttribute("required");
            domicilioSelect.value = "";
        }
    });
});