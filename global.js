console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/*
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

currentLink?.classList.add('current');
*/


const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/b-lum.github.io/";         // GitHub Pages repo name


let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contacts' },
  { url: 'https://github.com/b-lum', title: 'GitHub'}
  // add the rest of your pages here
];

let nav = document.createElement('nav');


for (let p of pages) {
  let url = p.url;
  let title = p.title;

  const isExternal = url.startsWith('http');
  url = isExternal ? url : BASE_PATH + url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  if (isExternal) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  nav.append(a);
}

document.body.prepend(nav);

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
		</select>
	</label>`,
);

let select = document.querySelector(".color-scheme select")

const saved = localStorage.colorScheme;

if (saved) {
  document.documentElement.style.setProperty("color-scheme", saved);
  select.value = saved;
}
select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});