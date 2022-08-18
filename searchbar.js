class SearchBar {
    constructor() {};

    setup() {
        document.querySelector('body').onkeydown = () => { document.querySelector('.model').classList.contains('hidden') && document.querySelector('.search-input').focus() };

        document.querySelector('.search-input').value = '';
        document.querySelector('.search').addEventListener('submit', (e) => { e.preventDefault(); this.search(document.querySelector('.search-input').value) });

        this.update();
    };

    search(input) {
        if (document.querySelector('.search-input').value !== '') {
            if (isValidURL(input)) {
                if (document.querySelector('.search-input').value.split('http')[0] !== '') {
                    window.location.href = `https://${input}`;
                }  else {
                    window.location.href = input;
                };
            } else {
                window.location.href = `https://www.google.com/search?q=${input}`;
            };
        }
    };

    update() {

    };
}