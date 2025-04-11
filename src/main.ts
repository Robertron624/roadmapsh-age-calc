import "./style.css";
import datepicker from "js-datepicker";
import "js-datepicker/dist/datepicker.min.css";
import { DateTime } from "luxon";

function setupDatepicker(selector: string): void {
  const dp = datepicker(selector, {
    formatter: (input, date) => {
      const formatted = DateTime.fromJSDate(date).toFormat("dd/MM/yyyy");
      input.value = formatted;
    },
  });

  dp.calendarContainer.style.setProperty("width", "100%");
}

function parseDateInput(inputValue: string): DateTime | null {
  const parts = inputValue.split("/");
  if (parts.length !== 3) return null;

  let [day, month, year] = parts;
  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  const normalized = `${day}/${month}/${year}`;
  const date = DateTime.fromFormat(normalized, "dd/MM/yyyy");
  return date.isValid ? date : null;
}

function formatUnit(value: number, unit: string): string {
  if (value === 0) return "";
  if (value === 1) return `1 ${unit}`;
  return `${value} ${unit}s`;
}

function calculateAge(birthdate: DateTime): string {
  const now = DateTime.now();
  const diff = now.diff(birthdate, ["years", "months", "days"]);
  const years = Math.floor(diff.years);
  const months = Math.floor(diff.months);
  const days = Math.floor(diff.days);

  const parts = [
    formatUnit(years, "year"),
    formatUnit(months, "month"),
    formatUnit(days, "day"),
  ].filter(Boolean);

  if (parts.length === 0) return "just born 🎉";
  return parts.join(", ").replace(/,([^,]*)$/, " and$1");
}

function main() {
  const input = document.querySelector<HTMLInputElement>(".datepicker");
  const button = document.querySelector<HTMLButtonElement>("#calculate-age");
  const result = document.querySelector<HTMLDivElement>("#age-result");
  const resultSpan = result?.querySelector<HTMLSpanElement>("span");

  if (!input || !button || !result || !resultSpan) return;

  setupDatepicker(".datepicker");

  button.addEventListener("click", () => {
    if (!input.value || input.value.trim() === "") {
      result.textContent = "Please select a valid date";
      return;
    }

    const birthdate = parseDateInput(input.value);
    if (!birthdate) {
      result.textContent = "Invalid date format. Please use dd/MM/yyyy";
      return;
    }

    const ageText = calculateAge(birthdate);
    resultSpan.textContent = ageText;
    result.classList.remove("hidden");
  });
}
document.addEventListener("DOMContentLoaded", main);
