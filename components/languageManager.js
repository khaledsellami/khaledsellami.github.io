class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferred-language') || 'en';
        this.translations = {};
        this.supportedLanguages = ['en', 'fr'];
        this.observers = new Set();
        this.initialized = false;
        // this.languageSwitcher = null;

        // Create a promise that will resolve when initialization is complete
        this.initializationPromise = null;
    }

    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = (async () => {
            // Load all translations
            for (const lang of this.supportedLanguages) {
                try {
                    const response = await fetch(`assets/translations/${lang}.json`);
                    this.translations[lang] = await response.json();
                } catch (error) {
                    console.error(`Failed to load ${lang} translations:`, error);
                }
            }

            // Set initial language
            await this.switchLanguage(this.currentLanguage);
            // this.setupLanguageSwitcher();
            // this.languageSwitcher = this.setupLanguageSwitcher();

            this.initialized = true;

            // Update any components that might have registered before initialization
            this.notifyObservers();
        })();

        return this.initializationPromise;
    }

    async switchLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }

        this.currentLanguage = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('preferred-language', lang);

        this.notifyObservers();
    }

    notifyObservers() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            this.updateElement(element);
        });
        document.querySelectorAll('[data-i18n-href]').forEach(element => {
            this.updateElementHref(element);
        });

        // Notify all observers (components) about the language change
        this.observers.forEach(observer => {
            if (typeof observer.onLanguageChange === 'function') {
                observer.onLanguageChange(this.currentLanguage);
            }
        });
    }

    updateElementHref(element) {
        // Handle href translations
        const hrefKeys = element.getAttribute('data-i18n-href').split('.');
        let hrefValue = this.translations[this.currentLanguage];
        
        for (const key of hrefKeys) {
            hrefValue = hrefValue?.[key];
            if (hrefValue === undefined) {
                console.warn(`Translation missing for href key: ${element.getAttribute('data-i18n-href')}`);
                return;
            }
        }
        element.href = hrefValue;
    }

    updateElement(element) {
        const keys = element.dataset.i18n.split('.');
        let value = this.translations[this.currentLanguage];

        for (const key of keys) {
            value = value?.[key];
            if (value === undefined) {
                console.warn(`Translation missing for key: ${element.dataset.i18n}`);
                return;
            }
        }
        element.innerHTML = value;
    }

    translate(key) {
        if (!this.initialized) {
            console.warn('Trying to translate before initialization');
            return key;
        }

        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation missing for key: ${key}`);
                return key;
            }
        }

        return value;
    }

    async register(component) {
        this.observers.add(component);

        // If not initialized, wait for initialization
        if (!this.initialized) {
            await this.initializationPromise;
        }

        // Update the component once registered
        if (typeof component.onLanguageChange === 'function') {
            component.onLanguageChange(this.currentLanguage);
        }
    }

    unregister(component) {
        this.observers.delete(component);
    }

    // setupLanguageSwitcher() {
    //     const switcherContainer = document.createElement('div');
    //     switcherContainer.className = 'navbar-nav language-switcher ml-3';

    //     this.supportedLanguages.forEach(lang => {
    //         const listItem = document.createElement('li');
    //         listItem.className = 'nav-item';
            
    //         const button = document.createElement('button');
    //         button.className = `nav-link language-btn ${this.currentLanguage === lang ? 'active' : ''}`;
    //         button.textContent = lang.toUpperCase();
    //         button.onclick = () => this.switchLanguage(lang);
            
    //         listItem.appendChild(button);
    //         switcherContainer.appendChild(listItem);
    //     });

    //     return switcherContainer;
    // }
}

// Create a global instance
window.languageManager = new LanguageManager();

export default LanguageManager;