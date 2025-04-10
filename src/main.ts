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

  // According to documentation, to style the calendar, we need to set the width of the calendar container
  datePickerElement.calendarContainer.style.setProperty('width', '100%');

  button?.addEventListener("click", () => {
    if (!result) return;
    if (!input?.value || input?.value === "") {
      result.textContent = "Please select a valid date";
      return;
    }

    // Normalize the date by adding zeroes to the day and month
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
    const diff = today.diff(selectedBirthdate, ["years", "months"]);
    const years = Math.floor(diff.years);
    const months = Math.floor(diff.months);

    result.classList.remove("hidden");

    if (!resultSpan) return;
    resultSpan.textContent = `${years} years and ${months} months`;
  });
}

document.addEventListener("DOMContentLoaded", main);
