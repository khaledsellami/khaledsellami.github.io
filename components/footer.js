class Footer extends HTMLElement {

  constructor() {
    super();
    this.updateContent = this.updateContent.bind(this);
  }

  async connectedCallback() {
    try {
      // Register with language manager and wait for initialization
      await window.languageManager?.register(this);
      this.updateContent();
    } catch (error) {
      console.error('Error initializing footer:', error);
    }
  }

  disconnectedCallback() {
    window.languageManager?.unregister(this);
  }

  onLanguageChange() {
    // this.updateContent();
  }

  updateContent() {
    const translate = key => window.languageManager?.translate(key) ?? key;

    this.innerHTML = `
            <div class="footer-lemos mt-5">
                <div class="py-3 px-md-5 container-fluid">
                    <div class="row">
                        <div class="col-auto col-md-5 align-middle">
                            <p class="mb-0" style="color: var(--light-gray);">© 2025 Khaled Sellami</p>
                            <p class="my-0 pt-0"><a class="" href="mailto:khaled.sellami.1@ulaval.ca">khaled.sellami.1@ulaval.ca</a></p>
                        </div>
                        <div class="col col-md-7 text-right">
                            <p class="mb-0" style="color: var(--light-gray);" data-i18n="footer.quickLinks"> Quick Links
                            </p>
                            <p class="my-0 pt-0">
                                <a href="/index.html"><i class="mr-3 footer-icons fa-solid fa-house" aria-hidden="true"></i></a>
                                <a href="https://www.linkedin.com/in/khaled-sellami/" target="_blank"><i class="mr-3 fab footer-icons fa-linkedin" aria-hidden="true"></i></a>
                                <a href="https://github.com/khaledsellami" target="_blank"><i class="mr-3 fab footer-icons fa-github" aria-hidden="true"></i></a>
                                <a href="https://scholar.google.ca/citations?user=oUZl5aUAAAAJ&hl=en&oi=ao" target="_blank"><i class="mr-3 footer-icons fa-brands fa-google-scholar" aria-hidden="true"></i></a>
                                <a href="https://orcid.org/0000-0002-6595-2489" target="_blank"><i class="footer-icons fa-brands fa-orcid" aria-hidden="true"></i></a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define('footer-component', Footer);