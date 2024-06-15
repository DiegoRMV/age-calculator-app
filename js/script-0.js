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
console.log(labels);

let day;
let month;
let year;
let ageDay;
let ageMonth;
let ageYear;

window.addEventListener("load", () => {
	let nowDate = new Date();
	inputYear.setAttribute("max", nowDate.getFullYear());
	day = parseInt(inputDay.value);
	month = parseInt(inputMonth.value) - 1;
	year = parseInt(inputYear.value);
});

function formater(e) {
	return e < 10 ? `0${e}` : `${e}`;
}

function isDateValid(year, month, day) {
	date = new Date(year, month, day);
	if (
		date.getFullYear() == year &&
		date.getMonth() == month &&
		date.getDate() == day
	) {
		return true;
	} else {
		return false;
	}
}

function calculateAge() {
	let dateNow = new Date();
	let nowYear = dateNow.getFullYear();
	let nowMonth = dateNow.getMonth();
	let nowDay = dateNow.getDate();

	ageYear = nowYear - year;

	if (nowMonth < month) {
		ageYear--;
	}
	if (month == nowMonth && nowDay < day) {
		ageYear--;
	}

	if (nowMonth > month && day > nowDay) {
		ageMonth = nowMonth - month - 1;
	} else if (nowMonth > month) {
		ageMonth = nowMonth - month;
	}

	if (nowMonth < month && day < nowDay) {
		ageMonth = 12 - (month - nowMonth);
	} else if (nowMonth < month) {
		ageMonth = 12 - (month - nowMonth + 1);
	}

	if (nowMonth == month && day > nowDay) {
		ageMonth = 11;
	}

	console.log(ageMonth);
	if (nowDay > day) ageDay = nowDay - day;
	if (nowDay < day) {
		let daysMonth = new Date(nowYear, nowMonth - 1, 0);
		ageDay = daysMonth.getDate() - (day - nowDay);
	}
}

inputDay.addEventListener("input", () => {
	day = parseInt(inputDay.value);
	if (Number.isNaN(day) || day > 31) {
		errorDay.innerText = !Number.isNaN(day)
			? "Must be a valid day"
			: "This field is required";
		labels[0].classList.add("error");
		errorDay.classList.add("show-error");
		inputDay.classList.add("error-input");
	} else {
		labels[0].classList.remove("error");
		errorDay.classList.remove("show-error");
		inputDay.classList.remove("error-input");
	}
});

inputMonth.addEventListener("input", () => {
	month = parseInt(inputMonth.value) - 1;
	nowDate = new Date();
	if (
		Number.isNaN(month) ||
		month > 11 ||
		(year == nowDate.getFullYear() && month > nowDate.getMonth())
	) {
		errorMonth.innerText = !Number.isNaN(month)
			? "Must be a valid month"
			: "This field is required";
		labels[1].classList.add("error");
		errorMonth.classList.add("show-error");
		inputMonth.classList.add("error-input");
	} else {
		labels[1].classList.remove("error");
		errorMonth.classList.remove("show-error");
		inputMonth.classList.remove("error-input");
	}
});

inputYear.addEventListener("input", () => {
	year = parseInt(inputYear.value);
	nowDate = new Date();
	if (Number.isNaN(year) || year > nowDate.getFullYear()) {
		errorYear.innerText = !Number.isNaN(year)
			? "Must be in the past"
			: "This field is required";
		labels[2].classList.add("error");
		errorYear.classList.add("show-error");
		inputYear.classList.add("error-input");
	} else {
		labels[2].classList.remove("error");
		errorYear.classList.remove("show-error");
		inputYear.classList.remove("error-input");
	}
});

btn.addEventListener("click", () => {
	console.log(day, month, year);
	if (
		!inputDay.classList.contains("error-input") &&
		!inputMonth.classList.contains("error-input") &&
		!inputYear.classList.contains("error-input") &&
		isDateValid(year, month, day)
	) {
		inputDay.classList.remove("error-input");
		errorDay.classList.remove("show-error");
		labels[0].classList.remove("error");
		calculateAge();
		outputDay.textContent = ageDay;
		outputMonth.textContent = ageMonth;
		outputYear.textContent = ageYear;
	} else {
		errorDay.innerText = "Must be a valid day";
		inputDay.classList.add("error-input");
		errorDay.classList.add("show-error");
		labels[0].classList.add("error");
	}
});
