class Header extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    // Register with language manager and wait for initialization
    await window.languageManager?.register(this);
    this.updateContent();
  }

  disconnectedCallback() {
    window.languageManager?.unregister(this);
  }

  onLanguageChange() {
    this.updateContent();
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

  async updateContent() {
    this.innerHTML = `
            <header>
                <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
                    <h1><a class="navbar-brand" href="/">Khaled Sellami</a></h1>
                    <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" 
                            data-target="#navbarCollapse" aria-controls="navbarCollapse" 
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-collapse collapse" id="navbarCollapse" style="">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item mr-2">
                                <a class="nav-link" href="/" data-i18n="header.nav.home">Home</a>
                            </li>
                            <li class="nav-item mr-2">
                                <a class="nav-link" href="/pages/education.html" data-i18n="header.nav.education">Education</a>
                            </li>
                            <li class="nav-item mr-2">
                                <a class="nav-link" href="/pages/experience.html" data-i18n="header.nav.experience">Experience</a>
                            </li>
                            <li class="nav-item mr-2">
                                <a class="nav-link" href="/pages/publications.html" data-i18n="header.nav.publications">Publications</a>
                            </li>
                            <li class="nav-item mr-2">
                                <a class="nav-link" href="/pages/projects.html" data-i18n="header.nav.projects">Projects</a>
                            </li>
                            <li class="nav-item mr-2">
                                <a class="nav-link" href="/pages/skills.html" data-i18n="header.nav.skills">Skills</a>
                            </li>
                        </ul>
                        <div id="language-switcher"></div>
                    </div>
                </nav>
            </header>
        `;

        // // Wait for language manager initialization
        // await window.languageManager?.initialize();

        // // Add language switcher
        // const languageSwitcher = window.languageManager.languageSwitcher;
        // this.querySelector('#language-switcher').appendChild(languageSwitcher);
        const switcherContainer = this.querySelector('#language-switcher');
        if (switcherContainer) {
            switcherContainer.appendChild(this.createLanguageSwitcher());
        }
  }
}

customElements.define('header-component', Header);