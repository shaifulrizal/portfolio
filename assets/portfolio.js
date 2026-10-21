'use strict';

document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-menu');
const closeMenu = () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(isOpen));
  navigation.classList.toggle('open', isOpen);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.navigation')) closeMenu();
});
const mobileLayout = window.matchMedia('(max-width: 640px)');
mobileLayout.addEventListener('change', closeMenu);

const filters = Array.from(document.querySelectorAll('.filter'));
const collections = Array.from(document.querySelectorAll('.work-card'));
const collectionStatus = document.querySelector('.collection-status');
filters.forEach(filter => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  let count = 0;
  filters.forEach(button => {
    const selected = button === filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  collections.forEach(collection => {
    const visible = category === 'all' || collection.dataset.category === category;
    collection.hidden = !visible;
    if (visible) count += 1;
  });
  collectionStatus.textContent = `Showing ${count} collection${count === 1 ? '' : 's'}`;
}));

const collectionDetails = {
  design: { title: 'Corporate Storytelling', subtitle: 'Design & creative direction', tags: ['Communication design', 'Campaign visuals', 'Creative direction'] },
  motion: { title: 'Film & Motion', subtitle: 'Video & motion graphics', tags: ['Video production', 'Motion graphics', 'Visual storytelling'] },
  digital: { title: 'Digital Experiences', subtitle: 'Web, UI/UX & information design', tags: ['Web experiences', 'UI/UX', 'Content hierarchy'] },
  photo: { title: 'Through My Lens', subtitle: 'Photography & visual observation', tags: ['Photography', 'Light & composition', 'Visual narratives'] }
};
const dialog = document.querySelector('#collection-dialog');
let dialogTrigger = null;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const collection = collectionDetails[button.dataset.project];
  document.querySelector('#collection-title').textContent = collection.title;
  document.querySelector('#collection-subtitle').textContent = collection.subtitle;
  const tags = document.querySelector('#collection-tags');
  tags.replaceChildren(...collection.tags.map(text => {
    const tag = document.createElement('span');
    tag.textContent = text;
    return tag;
  }));
  dialogTrigger = button;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.querySelector('.dialog-close').focus();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  if (dialogTrigger) dialogTrigger.focus({ preventScroll: true });
});
document.querySelector('.dialog-experience').addEventListener('click', () => dialog.close());
document.querySelector('.print-button').addEventListener('click', () => window.print());
document.querySelector('#year').textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window) {
  const menuLinks = Array.from(navigation.querySelectorAll('a[href^="#"]'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      menuLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('#home, #work, #about, #experience, #contact').forEach(section => observer.observe(section));
}
