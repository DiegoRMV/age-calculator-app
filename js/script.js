// const form = document.querySelector(".form");
const extreamError = document.getElementById("extream-error");

const inputDay = document.getElementById("day");
const inputMonth = document.getElementById("month");
const inputYear = document.getElementById("year");
const errorDay = document.getElementById("error-day");
const errorMonth = document.getElementById("error-month");
const errorYear = document.getElementById("error-year");
const outputYear = document.getElementById("years");
const outputMonth = document.getElementById("months");
const outputDay = document.getElementById("days");
const btn = document.getElementById("btn");
const labels = document.querySelectorAll(".box label");

////////////////////////////////
//// Error rendering funtion
// This function renders error messages based on the validation status of an input field.
const renderError = function (status, element) {
	const msgError = element.nextElementSibling; // The error message element next to the input element
	const labelError = element.previousElementSibling; // The error label element previous to the input element
	const fieldName = element.name; // The name of the input field

	switch (status) {
		case "empty":
			msgError.textContent = `${fieldName} is required`;
			labelError.classList.add("error-label");
			msgError.classList.add("show-error");
			element.classList.add("error-input");
			break;
		case "invalid":
			msgError.textContent = `Must be a valid ${fieldName.toLowerCase()}`;
			labelError.classList.add("error-label");
			msgError.classList.add("show-error");
			element.classList.add("error-input");
			break;
		case "future":
			msgError.textContent = "Must be in the past";
			labelError.classList.add("error-label");
			msgError.classList.add("show-error");
			element.classList.add("error-input");
			break;
		default:
			msgError.textContent = "";
			labelError.classList.remove("error-label");
			msgError.classList.remove("show-error");
			element.classList.remove("error-input");
	}
};

/////////////////////////////////
///// Validation funtions //////
////////////////////////////////

/////////////////////////////
//// Year validation
// Validates the input value for year and returns a boolean
const validateYear = function (element) {
	const inputValue = +element.value;
	const currentYear = new Date().getFullYear();

	// checks if the input value is empty
	if (inputValue == "") {
		renderError("empty", element);
		return false;
	}

	// checks if the input value is less than 1000
	if (inputValue < 1) {
		renderError("invalid", element);
		return false;
	}

	// checks if the input value is greater than the current year
	if (inputValue > currentYear) {
		renderError("future", element);
		return false;
	}

	// If input value is valid, remove error messages and return true
	renderError("", element);
	return true;
};

/////////////////////////////
//// Month validation
// Validates the input value for month and returns a boolean
const validateMonth = function (element) {
	const inputValue = +element.value;
	const day = +inputDay.value;
	const lastDayOfMonth = new Date(
		+inputYear.value,
		+inputMonth.value,
		0
	).getDate();

	// Render error message for day input if day is greater than last day of the month
	if (inputValue == "") {
		renderError("empty", element);
		return false;
	}

	if (day > lastDayOfMonth) {
		renderError("invalid", inputDay);
		return false;
	}

	// Render error message if input value is empty, greater than 12 or less than 1
	if (inputValue === "" || inputValue < 1 || inputValue > 12) {
		renderError("invalid", element);
		return false;
	}

	// If input value is valid, remove error messages and return true
	renderError("", element);
	renderError("", inputDay);
	return true;
};

/////////////////////////////
//// Day validation
// Validates the input value for day and returns a boolean
const validateDay = function (element) {
	// Getting the day input value and the last day of the month based on input year and month
	const inputValue = +element.value;
	const lastDayOfMonth = new Date(
		+inputYear.value,
		+inputMonth.value,
		0
	).getDate();

	// Checking if the input value is empty
	if (inputValue == "") {
		renderError("empty", element);
		return false;
	}

	// Checking if the input value is not between 1 and the last day of the month
	if (inputValue > lastDayOfMonth || inputValue < 1) {
		renderError("invalid", element);
		return false;
	}

	// If input value is valid, then clear any error message and return true
	renderError("", element);
	return true;
};

//////////////////////////////
///// Events for inputs /////
/////////////////////////////
//Adding event listeners to the year, month, and day input fields
//When the input values change, their respective validation functions are called
//Also, the extremeError message is cleared
inputYear.addEventListener("input", () => {
	validateYear(inputYear);
	extreamError.textContent = null;
});

inputMonth.addEventListener("input", () => {
	validateMonth(inputMonth);
	extreamError.textContent = null;
});

inputDay.addEventListener("input", () => {
	validateDay(inputDay);
	extreamError.textContent = null;
});

//////////////////////////////
////// Form submission //////
/////////////////////////////
btn.addEventListener("click", function () {
	// Check if the input values are valid by calling the respective validation functions
	// If any validation function returns false, exit the function and do not proceed further
	validateDay(inputDay);
	validateDay(inputMonth);
	validateDay(inputYear);
	const isValid =
		validateDay(inputDay) &&
		validateMonth(inputMonth) &&
		validateYear(inputYear);
	if (!isValid) return;

	// If input values are valid, create a new Date object based on the input values
	const birth = new Date(
		`${inputYear.value}-${inputMonth.value}-${inputDay.value}`
	);
	// Get today's date
	const today = new Date();

	// Check if the birth date is in the future, if so, show an error message and exit the function
	if (birth > today) {
		extreamError.textContent = "Date of birth can't be in the future";
		return;
	}

	// Calculate the difference in years, months, and days between today's date and the birthdate entered by the user
	let years = today.getFullYear() - birth.getFullYear();
	let months = today.getMonth() - birth.getMonth();
	let days = today.getDate() - birth.getDate();

	// If the difference in months is negative, it means the birthday has not yet occurred this year.
	// In this case, we subtract one from the year and add 12 to the number of months difference.
	if (months < 0 || (months === 0 && days < 0)) {
		years--;
		months += 12;
	}

	// If the difference in days is negative, it means that the birthday occurred in the previous month.
	// We need to add the number of days in the current month to the number of days remaining in the birth month,
	// and subtract one month from the total number of months difference.
	if (days < 0) {
		const lastDayOfMonth = new Date(
			today.getFullYear(),
			today.getMonth(),
			0
		).getDate();
		days = lastDayOfMonth - birth.getDate() + today.getDate();
		months--;
		if (months < 0) {
			months += 12;
			years--;
		}
	}

	// Scaling down and hiding the output elements
	[
		outputYear.parentElement,
		outputMonth.parentElement,
		outputDay.parentElement,
	].forEach((output) => {
		output.style.transform = "scale(.8)";
		output.style.opacity = "0";
	});

	// Updating the output elements with the calculated years, months and days,
	// then scaling up and showing them after a delay of 300ms
	setTimeout(() => {
		outputYear.textContent = years;
		outputMonth.textContent = months;
		outputDay.textContent = days;

		[
			outputYear.parentElement,
			outputMonth.parentElement,
			outputDay.parentElement,
		].forEach((output) => {
			output.style.transform = "scale(1)";
			output.style.opacity = "1";
		});
	}, 300);

	// let c = document.querySelector(".counter");
	// function count() {
	// 	var counter = { var: 0 };
	// 	TweenMax.to(counter, 3, {
	// 		var: 100,
	// 		onUpdate: function () {
	// 			var number = Math.ceil(counter.var);
	// 			c.textContent = number;
	// 			if (number === counter.var) {
	// 				count.kill();
	// 			}
	// 		},
	// 		onComplete: function () {
	// 			count();
	// 		},
	// 		ease: Circ.easeOut,
	// 	});
	// }
	// count();

	// Clearing the input fields after calculating the age
	// inputDay.value = "";
	// inputMonth.value = "";
	// inputYear.value = "";
});
