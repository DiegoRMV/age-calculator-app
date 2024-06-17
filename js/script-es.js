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

///////////////////////////////////////
// Función de renderizado de errores //
///////////////////////////////////////

// Esta función muestra mensajes de error según el estado de validación de un campo de entrada.
const renderError = function (status, element) {
	const msgError = element.nextElementSibling; // El elemento siguiente  al elemento de entrada
	const labelError = element.previousElementSibling; // El elemento anterior al elemento de entrada
	const fieldName = element.name; // El nombre del campo de entrada

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
//  Funciones de validación    //
////////////////////////////////

//// Validación de año ////

// Valida el valor de entrada para el año y devuelve un booleano
const validateYear = function (element) {
	const inputValue = +element.value;
	const currentYear = new Date().getFullYear();

	// verifica si el valor de entrada está vacío
	if (inputValue == "") {
		renderError("empty", element);
		return false;
	}

	// verifica si el valor de entrada es menor que 1
	if (inputValue < 1) {
		renderError("invalid", element);
		return false;
	}

	// verifica si el valor de entrada es mayor que el año actual
	if (inputValue > currentYear) {
		renderError("future", element);
		return false;
	}

	// Si el valor de entrada es válido, elimina los mensajes de error y devuelve true
	renderError("", element);
	return true;
};

//// Validación de mes ////

// Valida el valor de entrada para el mes y devuelve un booleano
const validateMonth = function (element) {
	const inputValue = +element.value;
	const day = +inputDay.value;
	const lastDayOfMonth = new Date(
		+inputYear.value,
		+inputMonth.value,
		0
	).getDate();

	// verifica si el valor de entrada está vacío
	if (inputValue == "") {
		renderError("empty", element);
		return false;
	}

	// Muestra mensaje de error si el valor de entrada es mayor que 12 o menor que 1
	if (inputValue < 1 || inputValue > 12) {
		renderError("invalid", element);
		return false;
	}

	// Muestra mensaje de error para el día de entrada si el día es mayor que el último día del mes
	if (day > lastDayOfMonth) {
		renderError("invalid", inputDay);
		return false;
	}

	// Si el valor de entrada es válido, elimina los mensajes de error y devuelve true
	renderError("", element);
	renderError("", inputDay);
	return true;
};

//// Validación de día ////

// Valida el valor de entrada para el día y devuelve un booleano
const validateDay = function (element) {
	// Obtener el valor de entrada del día 
	const inputValue = +element.value;
    // Obtener el último día del mes basado en el año y mes de entrada
	const lastDayOfMonth = new Date(
		+inputYear.value,
		+inputMonth.value,
		0
	).getDate();

	// Verifica si el valor de entrada está vacío
	if (inputValue == "") {
		renderError("empty", element);
		return false;
	}

	// Verifica si el valor de entrada no está entre 1 y el último día del mes
	if (inputValue > lastDayOfMonth || inputValue < 1) {
		renderError("invalid", element);
		return false;
	}

	// Si el valor de entrada es válido, elimina cualquier mensaje de error y devuelve true
	renderError("", element);
	return true;
};

///////////////////////////
// Eventos para entradas //
///////////////////////////

//Agregar event listeners a los campos de entrada de año, mes y día
//Cuando cambian los valores de entrada, se llaman sus respectivas funciones de validación
//Además, se borra el mensaje de error extremo
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

////////////////////
// Envío de Datos //
////////////////////

btn.addEventListener("click", function () {
	// Verifica si los valores de entrada son válidos llamando a las respectivas funciones de validación
	validateDay(inputDay);
	validateDay(inputMonth);
	validateDay(inputYear);
    
	// Si alguna función de validación devuelve false, salir de la función y no continuar
	const isValid =
		validateDay(inputDay) &&
		validateMonth(inputMonth) &&
		validateYear(inputYear);
	if (!isValid) return;

	// Si los valores de entrada son válidos, crea un nuevo objeto de fecha basado en los valores de entrada
	const birth = new Date(
		`${inputYear.value}-${inputMonth.value}-${inputDay.value}`
	);
	// Obtener la fecha de hoy
	const today = new Date();

	// Verifica si la fecha de nacimiento está en el futuro, si es así, muestra un mensaje de error y salir de la función
	if (birth > today) {
		extreamError.textContent = "Date of birth can't be in the future";
		return;
	}

	// Calcula la diferencia en años, meses y días entre la fecha de hoy y la fecha de nacimiento ingresada por el usuario
	let years = today.getFullYear() - birth.getFullYear();
	let months = today.getMonth() - birth.getMonth();
	let days = today.getDate() - birth.getDate();

	// Si la diferencia en meses es negativa, significa que el cumpleaños aún no ha ocurrido este año.
	// En este caso, restamos uno del año y sumamos 12 al número de meses de diferencia.
	if (months < 0 || (months === 0 && days < 0)) {
		years--;
		months += 12;
	}

	// Si la diferencia en días es negativa, significa que el cumpleaños ocurrió en el mes anterior.
	// Necesitamos sumar el número de días en el mes actual al número de días restantes en el mes de nacimiento,
	// y restar un mes del número total de meses de diferencia.
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

	// Reducción de escala y ocultación de los elementos de salida
	[
		outputYear.parentElement,
		outputMonth.parentElement,
		outputDay.parentElement,
	].forEach((output) => {
		output.style.transform = "scale(.8)";
		output.style.opacity = "0";
	});

	// Actualiza los elementos de salida con los años, meses y días calculados,
	// luego los escala y los muestra después de un retraso de 300 ms
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

	// Borrar los campos de entrada después de calcular la edad
	// inputDay.value = "";
	// inputMonth.value = "";
	// inputYear.value = "";
});
