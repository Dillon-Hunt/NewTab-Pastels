class Links {
    constructor() {
        this.links = getLinks();
        this.container = document.querySelector('.top-links');
        this.contextMenu = document.querySelector('.top-context-menu');
        this.model = document.querySelector('.model');
    };

    setup() {
        document.querySelector('.background').addEventListener('click', () => { this.contextMenu.classList.add('hidden'); this.model.classList.add('hidden'); });
        document.querySelector('.background').addEventListener('contextmenu', () => { this.contextMenu.classList.add('hidden'); this.model.classList.add('hidden'); });

        this.update();
    };

    deleteLink(link) {
        this.links.splice(this.links.indexOf(link), 1)
        localStorage.setItem('links', JSON.stringify(this.links));
        this.update();
    };

    addLink() {
        this.model.children[0].textContent = 'New Link';
        this.model.children[1].textContent = 'Enter URL';
        this.model.children[2].placeholder = 'DISPLAY NAME';
        this.model.children[3].placeholder = 'https://your-url.com/';
        this.model.onsubmit = (e) => {
            e.preventDefault();
            if (!(this.model.children[2].value === '' || this.model.children[3].value === '')) {
                if (this.model.children[3].value.split('http')[0] !== '') {
                    this.links.push({ name: this.model.children[2].value, url: `https://${this.model.children[3].value}` });
                }  else {
                    this.links.push({ name: this.model.children[2].value, url: this.model.children[3].value });
                };
                localStorage.setItem('links', JSON.stringify(this.links));
                this.model.children[2].value = '';
                this.model.children[3].value = '';
                this.model.classList.add('hidden');
            }
            this.update();
        };

        this.model.classList.remove('hidden');
        this.model.children[2].focus();
    };

    update() {
        while (this.container.lastChild) {
            this.container.removeChild(this.container.lastChild);
        }

        if (this.links.length === 0) {
            const addElement = document.createElement('p');
            addElement.textContent = '+';
            addElement.classList.add('addLink');
            addElement.onclick = () => this.addLink();
            this.container.appendChild(addElement);
        } else {
            this.links.forEach(link => {
                const newLink = document.createElement('a');
                newLink.textContent = link.name;
                newLink.classList.add('link');
                newLink.href = link.url;

                newLink.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.contextMenu.classList.remove('hidden')
                    this.contextMenu.style.setProperty('--x', `${e.clientX + 10}px`)
                    this.contextMenu.style.setProperty('--y', `${e.clientY + 10}px`)
                    this.contextMenu.children[0].onclick = () => {
                        this.deleteLink(link)
                        this.contextMenu.classList.add('hidden')
                    };
                    this.contextMenu.children[1].onclick = () => {
                        this.addLink()
                        this.contextMenu.classList.add('hidden')
                    };
                });

                this.container.appendChild(newLink);
            });
        }
    };
}