import "./style.css";
import datepicker from "js-datepicker";
import "js-datepicker/dist/datepicker.min.css";
import { DateTime } from "luxon";

function main() {
  const input = document.querySelector<HTMLInputElement>(".datepicker");
  const button = document.querySelector<HTMLButtonElement>("#calculate-age");
  const result = document.querySelector<HTMLDivElement>("#age-result");
  const resultSpan = result?.querySelector<HTMLSpanElement>("span");

  const datePickerElement = datepicker(".datepicker", {
    formatter: (input, date) => {
      const formattedDate = DateTime.fromJSDate(date).toFormat("dd/MM/yyyy");
      input.value = formattedDate;
    },
  });

  datePickerElement.calendarContainer.style.setProperty("width", "100%");

  button?.addEventListener("click", () => {
    if (!result || !resultSpan) return;
    if (!input?.value || input.value.trim() === "") {
      result.textContent = "Please select a valid date";
      return;
    }

    const dateParts = input.value.split("/");
    if (dateParts.length !== 3) {
      result.textContent = "Invalid date format. Please use dd/MM/yyyy";
      return;
    }

    let [day, month, year] = dateParts;
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");

    const normalizedDate = `${day}/${month}/${year}`;
    const selectedBirthdate = DateTime.fromFormat(normalizedDate, "dd/MM/yyyy");

    if (!selectedBirthdate.isValid) {
      result.textContent = "Invalid date format. Please try again";
      return;
    }

    const today = DateTime.now();
    const diff = today.diff(selectedBirthdate, ["years", "months", "days"]);
    const years = Math.floor(diff.years);
    const months = Math.floor(diff.months);
    const days = Math.floor(diff.days);

    // Función para formatear unidades con plural
    const formatUnit = (value: number, unit: string) => {
      if (value === 0) return "";
      if (value === 1) return `1 ${unit}`;
      return `${value} ${unit}s`;
    };

    const parts = [
      formatUnit(years, "year"),
      formatUnit(months, "month"),
      formatUnit(days, "day"),
    ].filter(Boolean); // Elimina los vacíos (unidades en cero)

    const finalText = parts.join(", ").replace(/,([^,]*)$/, " and$1");

    result.classList.remove("hidden");
    resultSpan.textContent = finalText;
  });
}

document.addEventListener("DOMContentLoaded", main);
