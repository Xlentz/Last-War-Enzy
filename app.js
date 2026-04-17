const translations = {
    de: { hero_title: "Helden-Zentrale", search: "Suche..." },
    en: { hero_title: "Hero Command", search: "Search..." }
};

let currentLang = 'de';

function navigate(page) {
    console.log("Navigiere zu:", page);
    // Hier würde die Logik stehen, um JSON-Inhalte für die Seite zu laden
    updateActiveTab(page);
}

document.getElementById('lang-switch').addEventListener('click', () => {
    currentLang = currentLang === 'de' ? 'en' : 'de';
    document.getElementById('lang-switch').innerText = currentLang.toUpperCase();
    applyTranslations();
});

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = translations[currentLang][key];
    });
}
