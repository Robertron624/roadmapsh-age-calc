import "./style.css";
import datepicker from "js-datepicker";
import { DateTime } from "luxon";

function main() {
  const input = document.querySelector<HTMLInputElement>(".datepicker");
  const button = document.querySelector<HTMLButtonElement>("#calculate-age");
  const result = document.querySelector<HTMLDivElement>("#age-result");

  datepicker(".datepicker", {
    formatter: (input, date) => {
      const value = date.toLocaleDateString();
      input.value = value;
    },
  });

  button?.addEventListener("click", () => {
    if (!result) return;
    if (!input?.value) {
      result.textContent = "Please select a valid date";
      return;
    }

    const selectedBirthdate = DateTime.fromFormat(input?.value, "MM/dd/yyyy");
    if (!selectedBirthdate.isValid) {
      result.textContent = "Invalid date format. Please try again";
      return;
    }

    const today = DateTime.now();
    const age = today.diff(selectedBirthdate, "years").years.toFixed(0);
    result.textContent = `You are ${age} years old`;
  });
}

document.addEventListener("DOMContentLoaded", main);
