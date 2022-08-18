function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).toUpperCase().padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

function getStorage(item) {
  return localStorage.getItem(item) === null ? true : JSON.parse(localStorage.getItem(item))
};

function getLinks() {
  return localStorage.getItem('links') === null ? [] : JSON.parse(localStorage.getItem('links'))
};

function getHue() {
    let hue = localStorage.getItem('hue');
    hue < 360 ? hue++ : hue = 0;
    localStorage.setItem('hue', hue);
    return hue;
}

function isValidURL(url) {
  var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  console.log(res !== null)
  return (res !== null)
}