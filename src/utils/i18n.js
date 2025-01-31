import {createI18n} from 'vue-i18n';
import en from '@/locales/en.json';
import uk from '@/locales/uk.json';
import zh from '@/locales/zh.json';
import ja from '@/locales/ja.json';
import pt from '@/locales/pt.json';
import es from '@/locales/es.json';
import de from '@/locales/de.json';
import ru from '@/locales/ru.json';
import pl from '@/locales/pl.json';

// Все доступные переводы
const messages = {
    en,
    uk,
    zh,
    ja,
    pt,
    es,
    de,
    ru,
    pl
};

const supportedLanguages = Object.keys(messages);

function detectLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage');

    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        return savedLanguage;
    }

    const browserLanguage = navigator.language || navigator.languages[0];
    const languageCode = browserLanguage.split('-')[0];

    localStorage.setItem('preferredLanguage', languageCode);

    return supportedLanguages.includes(languageCode) ? languageCode : 'en';
}

const i18n = createI18n({
    legacy: false,
    locale: detectLanguage(),
    fallbackLocale: 'en',
    messages,
});


export default i18n;

export function setLanguage(language) {
    if (supportedLanguages.includes(language)) {
        i18n.global.locale.value = language;
        localStorage.setItem('preferredLanguage', language);
    } else {
        console.error('Selected language not supported:', language);
    }
}
