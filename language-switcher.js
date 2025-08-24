class LanguageSwitcher {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        try {
            console.log('LanguageSwitcher: Starting initialization...');
            
            // Load translations
            const response = await fetch('./translations.json');
            this.translations = await response.json();
            console.log('LanguageSwitcher: Translations loaded successfully:', Object.keys(this.translations));
            
            // Set initial language from localStorage or default to English
            this.currentLanguage = localStorage.getItem('language') || 'en';
            console.log('LanguageSwitcher: Initial language set to:', this.currentLanguage);
            
            // Create language switcher UI
            this.createLanguageSwitcher();
            
            // Apply initial language
            this.switchLanguage(this.currentLanguage);
            
            // Ensure initial language class is applied to body
            document.body.classList.remove('rtl', 'ltr');
            if (this.currentLanguage === 'ar') {
                document.body.classList.add('rtl');
            } else {
                document.body.classList.add('ltr');
            }
            
            // Add event listeners
            this.addEventListeners();
            
            console.log('LanguageSwitcher: Initialization completed successfully');
            
        } catch (error) {
            console.error('LanguageSwitcher: Error during initialization:', error);
        }
    }

    createLanguageSwitcher() {
        // Find the dark mode toggle button
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;

        // Create language switcher container
        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'relative ml-2';
        languageSwitcher.innerHTML = `
            <button id="languageToggle" class="p-2 rounded-lg bg-gray-200 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${this.getCurrentLanguageName()}</span>
            </button>
            <div id="languageDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div class="py-2">
                    <button class="language-option w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" data-lang="en">
                        <span class="flag mr-2">🇺🇸</span> English
                    </button>
                    <button class="language-option w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" data-lang="ar">
                        <span class="flag mr-2">🇩🇿</span> العربية
                    </button>
                    <button class="language-option w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" data-lang="fr">
                        <span class="flag mr-2">🇫🇷</span> Français
                    </button>
                </div>
            </div>
        `;

        // Insert after the dark mode toggle
        darkModeToggle.parentNode.insertBefore(languageSwitcher, darkModeToggle.nextSibling);
    }

    addEventListeners() {
        // Language toggle
        const languageToggle = document.getElementById('languageToggle');
        const languageDropdown = document.getElementById('languageDropdown');
        
        if (languageToggle && languageDropdown) {
            languageToggle.addEventListener('click', () => {
                languageDropdown.classList.toggle('hidden');
            });

            // Language options
            const languageOptions = document.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const lang = e.target.closest('.language-option').dataset.lang;
                    this.switchLanguage(lang);
                    languageDropdown.classList.add('hidden');
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.relative.ml-2')) {
                    languageDropdown.classList.add('hidden');
                }
            });
        }
    }

    getCurrentLanguageName() {
        const names = {
            'en': 'EN',
            'ar': 'عربي',
            'fr': 'FR'
        };
        return names[this.currentLanguage] || names['en'];
    }

    switchLanguage(lang) {
        console.log('LanguageSwitcher: Attempting to switch to language:', lang);
        
        if (!this.translations[lang]) {
            console.error(`LanguageSwitcher: Language ${lang} not found in translations`);
            return;
        }

        console.log('LanguageSwitcher: Language found, switching...');
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update language switcher display
        const languageName = document.querySelector('#languageToggle .text-sm');
        if (languageName) {
            languageName.textContent = this.getCurrentLanguageName();
            console.log('LanguageSwitcher: Updated language switcher display to:', this.getCurrentLanguageName());
        }

        // Update document direction for RTL languages
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        console.log('LanguageSwitcher: Updated document direction to:', document.documentElement.dir);

        // Add language-specific body classes for consistent styling
        document.body.classList.remove('rtl', 'ltr');
        if (lang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.add('ltr');
        }
        console.log('LanguageSwitcher: Updated body classes to:', document.body.classList.toString());

        // Apply translations
        this.updateContent();
        
        // Update CSS classes for RTL support
        this.updateRTLStyles();
        
        console.log('LanguageSwitcher: Language switch completed for:', lang);
    }

    updateContent() {
        console.log('LanguageSwitcher: Starting content update for language:', this.currentLanguage);
        const t = this.translations[this.currentLanguage];
        console.log('LanguageSwitcher: Translations object:', t);
        
        // Navigation (both desktop and mobile)
        this.updateAllText('.nav-link[href="#hero"]', t.nav.home);
        this.updateAllText('.nav-link[href="#about"]', t.nav.about);
        this.updateAllText('.nav-link[href="#experience"]', t.nav.experience);
        this.updateAllText('.nav-link[href="#portfolio"]', t.nav.portfolio);
        this.updateAllText('.nav-link[href="#news"]', t.nav.news);
        this.updateAllText('.nav-link[href="#contact"]', t.nav.contact);

        // Hero Section
        console.log('LanguageSwitcher: Updating hero section...');
        this.updateText('#hero h1', `${t.hero.title} `);
        this.updateText('#hero h1 .text-blue-400', t.hero.name);
        this.updateText('#hero h2', t.hero.subtitle);
        this.updateText('#hero p', t.hero.description);
        this.updateText('#hero .bg-blue-600', t.hero.downloadCV);
        this.updateText('#hero .border-2', t.hero.moreInfo);
        console.log('LanguageSwitcher: Hero section updated');

        // About Section
        console.log('LanguageSwitcher: Updating about section...');
        this.updateText('#about h2 span:first-child', t.about.title);
        this.updateText('#about h2 span:last-child', t.about.titleHighlight);
        this.updateText('#about h3', t.about.headline);
        this.updateText('#about p', t.about.bio);
        this.updateText('#about h4', t.about.skills);
        console.log('LanguageSwitcher: About section updated');

        // Personal Details
        console.log('LanguageSwitcher: Updating personal details...');
        this.updateText('#about .space-y-6 div:nth-child(1) .font-bold', t.about.personalDetails.fullName);
        this.updateText('#about .space-y-6 div:nth-child(1) span:last-child', t.about.values.fullName);
        this.updateText('#about .space-y-6 div:nth-child(2) .font-bold', t.about.personalDetails.age);
        this.updateText('#about .space-y-6 div:nth-child(2) span:last-child', t.about.values.age);
        this.updateText('#about .space-y-6 div:nth-child(3) .font-bold', t.about.personalDetails.language);
        this.updateText('#about .space-y-6 div:nth-child(3) span:last-child', t.about.values.language);
        this.updateText('#about .space-y-6 div:nth-child(4) .font-bold', t.about.personalDetails.phone);
        this.updateText('#about .space-y-6 div:nth-child(4) span:last-child', t.about.values.phone);
        this.updateText('#about .space-y-6 div:nth-child(5) .font-bold', t.about.personalDetails.email);
        this.updateText('#about .space-y-6 div:nth-child(5) span:last-child', t.about.values.email);
        this.updateText('#about .space-y-6 div:nth-child(6) .font-bold', t.about.personalDetails.address);
        this.updateText('#about .space-y-6 div:nth-child(6) span:last-child', t.about.values.address);
        console.log('LanguageSwitcher: Personal details updated');

        // Services Section
        this.updateText('#services h2', t.services.title);
        this.updateText('#services .grid div:nth-child(1) h3', t.services.webDesign.title);
        this.updateText('#services .grid div:nth-child(1) p', t.services.webDesign.description);
        this.updateText('#services .grid div:nth-child(1) a', t.services.webDesign.readMore);
        this.updateText('#services .grid div:nth-child(2) h3', t.services.development.title);
        this.updateText('#services .grid div:nth-child(2) p', t.services.development.description);
        this.updateText('#services .grid div:nth-child(2) a', t.services.development.readMore);
        this.updateText('#services .grid div:nth-child(3) h3', t.services.laravel.title);
        this.updateText('#services .grid div:nth-child(3) p', t.services.laravel.description);
        this.updateText('#services .grid div:nth-child(3) a', t.services.laravel.readMore);
        this.updateText('#services .grid div:nth-child(4) h3', t.services.seo.title);
        this.updateText('#services .grid div:nth-child(4) p', t.services.seo.description);
        this.updateText('#services .grid div:nth-child(4) a', t.services.seo.readMore);

        // Experience Section
        this.updateText('#experience h2', t.experience.title);
        this.updateText('#experience h3:first-of-type', t.experience.education);
        this.updateText('#experience h3:last-of-type', t.experience.workExperience);

        // Portfolio Section
        this.updateText('#portfolio h2', t.portfolio.title);
        this.updateText('#portfolio .portfolio-filter[data-filter="all"]', t.portfolio.filters.all);
        this.updateText('#portfolio .portfolio-filter[data-filter="web"]', t.portfolio.filters.web);
        this.updateText('#portfolio .portfolio-filter[data-filter="laravel"]', t.portfolio.filters.laravel);
        this.updateText('#portfolio .portfolio-filter[data-filter="php"]', t.portfolio.filters.php);

        // Portfolio Projects
        const projects = document.querySelectorAll('.portfolio-item');
        if (projects.length >= 6) {
            this.updateText('.portfolio-item:nth-child(1) h3', t.portfolio.projects.ecommerce.title);
            this.updateText('.portfolio-item:nth-child(1) p', t.portfolio.projects.ecommerce.description);
            this.updateText('.portfolio-item:nth-child(1) a:first-child', t.portfolio.projects.ecommerce.liveDemo);
            this.updateText('.portfolio-item:nth-child(1) a:last-child', t.portfolio.projects.ecommerce.github);
            
            this.updateText('.portfolio-item:nth-child(2) h3', t.portfolio.projects.taskManagement.title);
            this.updateText('.portfolio-item:nth-child(2) p', t.portfolio.projects.taskManagement.description);
            this.updateText('.portfolio-item:nth-child(2) a:first-child', t.portfolio.projects.taskManagement.liveDemo);
            this.updateText('.portfolio-item:nth-child(2) a:last-child', t.portfolio.projects.taskManagement.github);
            
            this.updateText('.portfolio-item:nth-child(3) h3', t.portfolio.projects.blog.title);
            this.updateText('.portfolio-item:nth-child(3) p', t.portfolio.projects.blog.description);
            this.updateText('.portfolio-item:nth-child(3) a:first-child', t.portfolio.projects.blog.liveDemo);
            this.updateText('.portfolio-item:nth-child(3) a:last-child', t.portfolio.projects.blog.github);
            
            this.updateText('.portfolio-item:nth-child(4) h3', t.portfolio.projects.portfolio.title);
            this.updateText('.portfolio-item:nth-child(4) p', t.portfolio.projects.portfolio.description);
            this.updateText('.portfolio-item:nth-child(4) a:first-child', t.portfolio.projects.portfolio.liveDemo);
            this.updateText('.portfolio-item:nth-child(4) a:last-child', t.portfolio.projects.portfolio.github);
            
            this.updateText('.portfolio-item:nth-child(5) h3', t.portfolio.projects.crm.title);
            this.updateText('.portfolio-item:nth-child(5) p', t.portfolio.projects.crm.description);
            this.updateText('.portfolio-item:nth-child(5) a:first-child', t.portfolio.projects.crm.liveDemo);
            this.updateText('.portfolio-item:nth-child(5) a:last-child', t.portfolio.projects.crm.github);
            
            this.updateText('.portfolio-item:nth-child(6) h3', t.portfolio.projects.api.title);
            this.updateText('.portfolio-item:nth-child(6) p', t.portfolio.projects.api.description);
            this.updateText('.portfolio-item:nth-child(6) a:first-child', t.portfolio.projects.api.liveDemo);
            this.updateText('.portfolio-item:nth-child(6) a:last-child', t.portfolio.projects.api.github);
        }

        // Achievements Section
        this.updateText('#achievements h2', t.achievements.title);
        this.updateText('#achievements .grid div:nth-child(1) div:last-child', t.achievements.projects);
        this.updateText('#achievements .grid div:nth-child(2) div:last-child', t.achievements.clients);
        this.updateText('#achievements .grid div:nth-child(3) div:last-child', t.achievements.countries);
        this.updateText('#achievements .grid div:nth-child(4) div:last-child', t.achievements.years);

        // News Section
        this.updateText('#news h2', t.news.title);
        this.updateText('#news .grid div:nth-child(1) .text-sm', t.news.items.webDev.date);
        this.updateText('#news .grid div:nth-child(1) h3', t.news.items.webDev.title);
        this.updateText('#news .grid div:nth-child(1) p', t.news.items.webDev.description);
        this.updateText('#news .grid div:nth-child(1) a', t.news.items.webDev.readMore);
        
        this.updateText('#news .grid div:nth-child(2) .text-sm', t.news.items.laravel.date);
        this.updateText('#news .grid div:nth-child(2) h3', t.news.items.laravel.title);
        this.updateText('#news .grid div:nth-child(2) p', t.news.items.laravel.description);
        this.updateText('#news .grid div:nth-child(2) a', t.news.items.laravel.readMore);
        
        this.updateText('#news .grid div:nth-child(3) .text-sm', t.news.items.php.date);
        this.updateText('#news .grid div:nth-child(3) h3', t.news.items.php.title);
        this.updateText('#news .grid div:nth-child(3) p', t.news.items.php.description);
        this.updateText('#news .grid div:nth-child(3) a', t.news.items.php.readMore);

        // Contact Section
        this.updateText('#contact h2', t.contact.title);
        this.updateText('#contact label[for="name"]', t.contact.form.name);
        this.updateText('#contact label[for="email"]', t.contact.form.email);
        this.updateText('#contact label[for="message"]', t.contact.form.message);
        this.updateText('#contact #message', t.contact.form.messagePlaceholder);
        this.updateText('#contact button[type="submit"]', t.contact.form.submit);

        // Footer
        this.updateText('footer p', t.footer.tagline);
        this.updateText('footer .border-t p', t.footer.copyright);
    }

    updateText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`LanguageSwitcher: Updated "${selector}" to "${text}"`);
            element.textContent = text;
        } else {
            console.warn(`LanguageSwitcher: Element not found for selector "${selector}"`);
        }
    }

    updateAllText(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.textContent = text;
        });
    }

    updateRTLStyles() {
        const isRTL = this.currentLanguage === 'ar';
        const body = document.body;
        
        if (isRTL) {
            body.classList.add('rtl');
            // Add RTL-specific styles
            document.documentElement.style.setProperty('--text-align', 'right');
            document.documentElement.style.setProperty('--float-start', 'right');
            document.documentElement.style.setProperty('--float-end', 'left');
        } else {
            body.classList.remove('rtl');
            // Reset to LTR styles
            document.documentElement.style.setProperty('--text-align', 'left');
            document.documentElement.style.setProperty('--float-start', 'left');
            document.documentElement.style.setProperty('--float-end', 'right');
        }
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});
