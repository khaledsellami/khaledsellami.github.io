class Header extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    // Wait for languageManager to be available
    if (!window.languageManager) {
        await new Promise(resolve => {
            const checkLanguageManager = () => {
                if (window.languageManager) {
                    resolve();
                } else {
                    setTimeout(checkLanguageManager, 50);
                }
            };
            checkLanguageManager();
        });
    }
    // Register with language manager and wait for initialization
    await window.languageManager?.register(this);

    // Set initial theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme-preference');
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    
    await this.createContent();
    window.languageManager?.notifyObservers();

    // Add theme toggle
    const navbarCollapse = this.querySelector('.navbar-collapse');
    const themeToggle = this.createThemeToggle();
    navbarCollapse.appendChild(themeToggle);
  }

  disconnectedCallback() {
    window.languageManager?.unregister(this);
  }

  onLanguageChange() {
    // this.updateContent();
  }

  createLanguageSwitcher() {
      const switcherContainer = document.createElement('div');
      switcherContainer.className = 'navbar-nav language-switcher ml-3';

     
    // TODO The window.languageManager is usually not defined yet. We will need to make sure it is defined before using it.
    var supportedLanguages =  ['en', 'fr']; 
    var currentLanguage = currentLanguage = localStorage.getItem('preferred-language') || 'en';

      if (window.languageManager !== undefined) {
            supportedLanguages = window.languageManager.supportedLanguages;
            currentLanguage = window.languageManager.currentLanguage;
      }
        

      supportedLanguages.forEach(lang => {
          const listItem = document.createElement('li');
          listItem.className = 'nav-item';
          
          const button = document.createElement('button');
          button.className = `nav-link language-btn ${currentLanguage === lang ? 'active' : ''}`;
          button.textContent = lang.toUpperCase();
          button.onclick = async () => {
            // First remove active class from all buttons
            switcherContainer.querySelectorAll('.language-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            button.classList.add('active');
            await window.languageManager?.switchLanguage(lang);
        };
          listItem.appendChild(button);
          switcherContainer.appendChild(listItem);
      });

      return switcherContainer;
  }

  createThemeToggle() {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'theme-toggle ml-3';
    
    const toggle = document.createElement('button');
    toggle.className = 'btn theme-toggle-btn'; // Removed btn-outline-light class
    toggle.innerHTML = `
        <i class="fas fa-sun light-icon"></i>
        <i class="fas fa-moon dark-icon d-none"></i>
    `;
    
    toggle.addEventListener('click', () => this.toggleTheme());
    toggleContainer.appendChild(toggle);
    
    return toggleContainer;
  }

  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme-preference', newTheme);
    
    // Toggle icons
    const toggle = document.querySelector('.theme-toggle-btn');
    const sunIcon = toggle.querySelector('.light-icon');
    const moonIcon = toggle.querySelector('.dark-icon');
    
    sunIcon.classList.toggle('d-none');
    moonIcon.classList.toggle('d-none');
  }

  async createContent() {
    this.innerHTML = `
            <header>
                <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
                    <div class="container-fluid">
                        <h1><a class="navbar-brand" href="/">Khaled Sellami</a></h1>
                        
                        <!-- Theme toggle button - Always visible -->
                        <div class="theme-toggle-wrapper order-lg-last">
                            <div id="theme-toggle"></div>
                        </div>

                        <!-- Hamburger menu -->
                        <button class="navbar-toggler" type="button" data-toggle="collapse" 
                                data-target="#navbarCollapse" aria-controls="navbarCollapse" 
                                aria-expanded="false" aria-label="Toggle navigation">
                            <i class="fas fa-bars my-fa-navbar-icon"></i>
                        </button>

                        <!-- Collapsible content -->
                        <div class="navbar-collapse collapse" id="navbarCollapse">
                            <ul class="navbar-nav mx-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/" data-i18n="header.nav.home">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/pages/education.html" data-i18n="header.nav.education">Education</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/pages/experience.html" data-i18n="header.nav.experience">Experience</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/pages/publications.html" data-i18n="header.nav.publications">Publications</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/pages/projects.html" data-i18n="header.nav.projects">Projects</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/pages/skills.html" data-i18n="header.nav.skills">Skills</a>
                                </li>
                            </ul>
                            <!-- Language switcher - Collapses with menu -->
                            <div id="language-switcher" class="language-switcher-wrapper"></div>
                        </div>
                    </div>
                </nav>
            </header>
        `;

        const switcherContainer = this.querySelector('#language-switcher');
        if (switcherContainer) {
            switcherContainer.appendChild(this.createLanguageSwitcher());
        }

        // const themeContainer = this.querySelector('#theme-toggle');
        // if (themeContainer) {
        //     themeContainer.appendChild(this.createThemeToggle());
        // }
  }
}

customElements.define('header-component', Header);
// export default Header;