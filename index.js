class NewTab {
    constructor() {
        this.backgroundH = getHue();
        this.backgroundS = 90   // Math.floor(Math.random() * 15 + 80);
        this.backgroundL = 80   // Math.floor(Math.random() * 15 + 80);
        this.backgroundColor = () => `hsl(${this.backgroundH}, ${this.backgroundS}%, ${this.backgroundL}%)`;
        this.backgroundColorHex = () => hslToHex(this.backgroundH, this.backgroundS, this.backgroundL);
        this.backgroundColorSecondary = () => `hsl(${this.backgroundH}, ${this.backgroundS - 15}%, ${this.backgroundL - 15}%)`;

        this.searchbar = new SearchBar();
        this.links = new Links()

        this.lightShown = () => getStorage('lightShown');
        this.hexShown = () => getStorage('hexShown');
        this.inputShown = () => getStorage('inputShown');
        this.linksShown = () => getStorage('linksShown');
        this.quoteShown = () => getStorage('quoteShown');
        this.themeShown = () => getStorage('themeShown');
        this.leftOpen = false;
        this.rightOpen = false;
        this.leftShown = false;
        this.rightShown = false;
        this.gameStarted = false;

        document.querySelector('.quote-text').textContent = `"${quotes[Math.floor(Math.random() * quotes.length - 1)][0]}"`;
        document.querySelector('.quote-author').textContent = `- ${quotes[Math.floor(Math.random() * quotes.length - 1)][1]} -`;
    };

    setup() {
        console.log('%c' + this.backgroundColor(), 'color:' + this.backgroundColor());

        document.querySelector('.color.red').onclick = () => this.choseColor(0);
        document.querySelector('.color.orange').onclick = () => this.choseColor(25);
        document.querySelector('.color.yellow').onclick = () => this.choseColor(50);
        document.querySelector('.color.green').onclick = () => this.choseColor(95);
        document.querySelector('.color.aqua').onclick = () => this.choseColor(165);
        document.querySelector('.color.purple').onclick = () => this.choseColor(260);
        document.querySelector('.color.pink').onclick = () => this.choseColor(285);

        document.querySelector('.option.theme').onclick = () => this.toggleElement('light');
        document.querySelector('.option.global-theme').onclick = async () => {
            if (this.themeShown()) {
                const response = await confirm("This feature is experimental & may result in your current theme being lost. Are you sure you wish to continue?")
                response && this.toggleElement('theme');
            } else {
                this.toggleElement('theme');
            }
        };
        document.querySelector('.option.hex').onclick = () => this.toggleElement('hex');
        document.querySelector('.option.input').onclick = () => this.toggleElement('input');
        document.querySelector('.option.links').onclick = () => this.toggleElement('links');
        document.querySelector('.option.quotes').onclick = () => this.toggleElement('quote');


        document.querySelector('.sidebar-left-dock').onclick = () => this.toggleDock('left');
        document.querySelector('.sidebar-right-dock').onclick = () => this.toggleDock('right');

        document.querySelector('.sidebar-left-dock').addEventListener('mouseenter', () => this.showDock('left'))
        document.querySelector('.sidebar-right-dock').addEventListener('mouseenter', () => this.showDock('right'))

        document.querySelector('.sidebar-left').addEventListener('mouseenter', () => this.showDock('left'))
        document.querySelector('.sidebar-right').addEventListener('mouseenter', () => this.showDock('right'))

        document.querySelector('.sidebar-left-dock-mousearea').addEventListener('mouseenter', () => this.showDock('left'))
        document.querySelector('.sidebar-right-dock-mousearea').addEventListener('mouseenter', () => this.showDock('right'))

        document.querySelector('.background').addEventListener('mouseover', () => { this.startHide('left'); this.startHide('right'); });

        this.searchbar.setup();
        this.links.setup();
        this.update();
    };

    showDock(type) {
        clearTimeout(this[`${type}Timeout`]);
        !(this.gameStarted) && document.querySelector(`.sidebar-${type}-dock`).classList.remove('collapsed');

        this[`${type}Shown`] = true;

        if (this.leftShown && this.rightShown && !this.leftOpen && !this.rightOpen && !this.gameStarted) {
            clearTimeout(this.leftTimeout);
            clearTimeout(this.rightTimeout);

            this.gameStarted = true;

            initiateGame();

            document.querySelector('.ball').addEventListener('gameOver', () => {
                this.leftShown = false;
                this.rightShown = false;

                this.startHide('left');
                this.startHide('right');

                this.gameStarted = false
            });
        };
    };

    startHide(type) {
        clearTimeout(this[`${type}Timeout`]);
        !(this.leftShown && this.rightShown && !this.leftOpen && !this.rightOpen) && !this[`${type}Open`] && (this[`${type}Timeout`] = setTimeout(() => this.hideDock(type), 300));
    };

    hideDock(type) {
        clearTimeout(this[`${type}Timeout`]);
        !this[`${type}Open`] && !(this.leftShown && this.rightShown) && document.querySelector(`.sidebar-${type}-dock`).classList.add('collapsed');
        !this[`${type}Open`] && (this[`${type}Shown`] = false);
    };

    choseColor(hue) {
        localStorage.setItem('hue', hue); 
        this.backgroundH = hue; 

        this.leftOpen = false;
        this.leftShown = false;

        document.querySelector('.sidebar-left-dock').classList.remove('reveal'); 
        document.querySelector('.sidebar-left').classList.remove('reveal');

        this.update(); 
    };

    toggleDock(type) {
        clearTimeout(this[`${type}Timeout`]);

        if (this.gameStarted) {
            reset();
        };

        this[`${type}Open`] = this[`${type}Open`] ? false : true
        document.querySelector(`.sidebar-${type}-dock`).classList.toggle('reveal'); 
        document.querySelector(`.sidebar-${type}`).classList.toggle('reveal');
    };

    toggleElement(element) {
        localStorage.setItem(`${element}Shown`, !this[`${element}Shown`]());

        this.rightOpen = false;
        this.rightShown = false;

        document.querySelector('.sidebar-right-dock').classList.remove('reveal'); 
        document.querySelector('.sidebar-right').classList.remove('reveal');

        this.update(); 
    }

    setElement(element, value) {
        value ? document.querySelector(element).classList.remove('hidden') : document.querySelector(element).classList.add('hidden');
    };

    async update() {
        document.querySelector('.color-code').textContent = this.backgroundColorHex();
        document.querySelector('.color-code').onclick = () => navigator.clipboard.writeText(this.backgroundColorHex());

        if (!(this.themeShown())) {
            const color110 = `hsl(${this.backgroundH}, ${this.backgroundS + 5}%, ${this.backgroundL + 5}%)`;
            const color100 = `hsl(${this.backgroundH}, ${this.backgroundS}%, ${this.backgroundL}%)`;
            const color90 = `hsl(${this.backgroundH}, ${this.backgroundS - 10}%, ${this.backgroundL - 10}%)`;
            const color80 = `hsl(${this.backgroundH}, ${this.backgroundS - 20}%, ${this.backgroundL - 20}%)`;
            const color70 = `hsl(${this.backgroundH}, ${this.backgroundS - 25}%, ${this.backgroundL - 25}%)`;
            typeof browser !== "undefined" && browser.theme.update({
                colors: {
                    accentcolor: color80,
                    frame: color80,
                    toolbar: color100,
                    toolbar_text: 'black',
                    tab_background_text: 'white',
                    toolbar_field: color80,
                    toolbar_field_text: 'white',
                    tab_line: color110,
                    tab_selected: color100,
                    popup: color90,
                    popup_text: 'white',
                    button_background_hover: color100,
                    frame_inactive: color70,
                    icons_attention: color100,
                    icons: 'rgba(0, 0, 0, 0.9)',
                    ntp_background: color100,
                    ntp_text: 'rgba(0, 0, 0, 0.9)',
                    popup_border: color100,
                    popup_highlight_text: 'rgba(0, 0, 0, 0.9)',
                    popup_highlight: color100,
                    sidebar_border: color100,
                    sidebar: color100,
                    sidebar_highlight_text: color100,
                    sidebar_highlight: color100,
                    sidebar_text: color100,
                    tab_loading: color90
                }
            });
        } else {
            typeof browser !== "undefined" && browser.theme.reset();
        }

        if (this.lightShown()) {
            document.body.style.backgroundColor = this.backgroundColor();
            document.querySelector(':root').style.setProperty('--color', '#00000033');
            document.querySelector(':root').style.setProperty('--color2', '#00000050');
        } else {
            document.body.style.backgroundColor = '#000';
            document.querySelector(':root').style.setProperty('--color', this.backgroundColor());
            document.querySelector(':root').style.setProperty('--color2', this.backgroundColorSecondary());
        }

        this.setElement('.color-code', this.hexShown());
        this.setElement('.search-title', this.inputShown());
        this.setElement('.search-input', this.inputShown());
        this.setElement('.top-links', this.linksShown());
        this.setElement('.quote', this.quoteShown());

        this.quoteShown() ? document.querySelector('.top-links').classList.remove('bottom') : document.querySelector('.top-links').classList.add('bottom');
    };
};

tab = new NewTab;
tab.setup();
