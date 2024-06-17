function calculateSettingAsThemeString({
	localStorageTheme,
	systemSettingDark,
}) {
	if (localStorageTheme !== null) {
		return localStorageTheme;
	}

	if (systemSettingDark.matches) {
		return "dark";
	}

	return "light";
}

/**
 * Función de utilidad para actualizar el texto del botón y el aria-label.
 */
function updateButton({ buttonEl, isDark }) {
	const newCta = isDark ? "Light" : "Dark";
	// usa un aria-label si omites el texto en el botón
	// y usas un ícono de sol/luna, por ejemplo
	buttonEl.setAttribute("aria-label", newCta);
	buttonEl.innerText = newCta;
}

/**
 * Función de utilidad para actualizar la configuración del tema en la etiqueta html
 */
function updateThemeOnHtmlEl({ theme }) {
	document.querySelector("html").setAttribute("data-theme", theme);
}

/**
 * Al cargar la página:
 */

/**
 * 1. Obtén lo que necesitamos del DOM y las configuraciones del sistema al cargar la página
 */
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * 2. Determina la configuración actual del sitio
 */
let currentThemeSetting = calculateSettingAsThemeString({
	localStorageTheme,
	systemSettingDark,
});

/**
 * 3. Actualiza la configuración del tema y el texto del botón de acuerdo con la configuración actual
 */
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
 * 4. Agrega un listener de eventos para alternar el tema
 */
button.addEventListener("click", (event) => {
	const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

	localStorage.setItem("theme", newTheme);
	updateButton({ buttonEl: button, isDark: newTheme === "dark" });
	updateThemeOnHtmlEl({ theme: newTheme });

	currentThemeSetting = newTheme;
});
