// Set Hebrew as the default language
let currentLanguage = 'he';

// Initialize the page with Hebrew language
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('he');
});

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update form placeholders
    document.querySelectorAll('input, textarea').forEach(input => {
        const key = input.getAttribute('name');
        if (translations[lang] && translations[lang][key + '_placeholder']) {
            input.placeholder = translations[lang][key + '_placeholder'];
        }
    });
}

// Add any interactive JavaScript here
