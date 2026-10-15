const body = document.body;
const opening = document.getElementById('opening');
const reveal = document.getElementById('reveal');
const giftButton = document.getElementById('giftButton');
const openingSubtitle = document.getElementById('opening-subtitle');
const titleLine = document.querySelector('.title-line');
const giftMonogram = document.querySelector('.gift-monogram');
const arrivalTitle = document.getElementById('arrival-title');
const arrivalKicker = document.querySelector('.arrival-copy .section-kicker');
const giftPortal = document.getElementById('giftPortal');
const portalBoxMount = document.getElementById('portalBoxMount');
let revealTimer;
let portalCleanupTimer;

const conceptCopy = {
  a: {
    title: 'we couldn\'t fit this<br>in a card.',
    subtitle: 'Tap the bow to open it.',
    monogram: 'A <i>✦</i> J',
    arrival: 'Dinner is at<br><em>Apéritif.</em>',
    kicker: '03 / ONE EVENING'
  },
  b: {
    title: 'we got you<br>something.',
    subtitle: 'Open it together.',
    monogram: 'FOR YOU',
    arrival: 'Dinner is at<br><em>Apéritif.</em>',
    kicker: '03 / ONE EVENING'
  }
};

function resetReveal(scroll = true) {
  clearTimeout(revealTimer);
  clearTimeout(portalCleanupTimer);
  opening.classList.remove('opened');
  giftButton.classList.remove('opened');
  giftButton.setAttribute('aria-expanded', 'false');
  reveal.hidden = true;
  giftPortal.hidden = true;
  giftPortal.classList.remove('leaving');
  portalBoxMount.replaceChildren();
  body.classList.remove('portal-active');
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setConcept(concept) {
  const selected = concept === 'b' ? 'b' : 'a';
  resetReveal(true);
  body.dataset.concept = selected;
  titleLine.innerHTML = conceptCopy[selected].title;
  openingSubtitle.textContent = conceptCopy[selected].subtitle;
  giftMonogram.innerHTML = conceptCopy[selected].monogram;
  arrivalTitle.innerHTML = conceptCopy[selected].arrival;
  arrivalKicker.textContent = conceptCopy[selected].kicker;
  document.querySelectorAll('[data-switch]').forEach(button => {
    const active = button.dataset.switch === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const url = new URL(window.location.href);
  url.searchParams.set('concept', selected);
  window.history.replaceState({}, '', url);
}

document.querySelectorAll('[data-switch]').forEach(button => button.addEventListener('click', () => setConcept(button.dataset.switch)));
giftButton.addEventListener('click', () => {
  if (opening.classList.contains('opened')) return;
  opening.classList.add('opened');
  giftButton.classList.add('opened');
  giftButton.setAttribute('aria-expanded', 'true');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveal.hidden = false;
    reveal.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }
  const gift = giftButton.querySelector('.gift-box');
  const rect = gift.getBoundingClientRect();
  giftPortal.style.setProperty('--from-x', `${rect.left + rect.width / 2 - window.innerWidth / 2}px`);
  giftPortal.style.setProperty('--from-y', `${rect.top + rect.height / 2 - window.innerHeight / 2}px`);
  portalBoxMount.replaceChildren(gift.cloneNode(true));
  giftPortal.classList.remove('leaving');
  giftPortal.hidden = false;
  body.classList.add('portal-active');
  revealTimer = window.setTimeout(() => {
    reveal.hidden = false;
    body.classList.remove('portal-active');
    reveal.scrollIntoView({ behavior: 'auto', block: 'start' });
    giftPortal.classList.add('leaving');
    portalCleanupTimer = window.setTimeout(() => {
      giftPortal.hidden = true;
      giftPortal.classList.remove('leaving');
      portalBoxMount.replaceChildren();
    }, 550);
  }, 1550);
});
document.getElementById('replay').addEventListener('click', () => resetReveal(true));

const photos = [
  { src: 'assets/pool-suite-outdoor.webp', caption: 'Your private heated plunge pool', alt: 'Pool Suite terrace and private heated plunge pool' },
  { src: 'assets/pool-suite-bedroom.webp', caption: 'The Pool Suite bedroom', alt: 'Bedroom in a Viceroy Bali Pool Suite' },
  { src: 'assets/suite-interior.webp', caption: 'Inside the Pool Suite', alt: 'Interior of the Pool Suite at Viceroy Bali' },
  { src: 'assets/suite-living.webp', caption: 'Space to lounge', alt: 'Living area inside the Pool Suite' },
  { src: 'assets/suite-bathroom.webp', caption: 'The marble bathroom', alt: 'Semi-outdoor bathroom in a Pool Suite' },
  { src: 'assets/pool-suite-daybed.webp', caption: 'Your covered daybed', alt: 'Covered daybed in a Pool Suite with jungle view' },
  { src: 'assets/hotel-panorama.webp', caption: 'Viceroy Bali above the valley', alt: 'Viceroy Bali on a ridge above the jungle valley' },
  { src: 'assets/hotel-main-pool.webp', caption: 'The resort infinity pool', alt: 'Resort main infinity pool overlooking the valley' },
  { src: 'assets/aperitif-romantic.webp', caption: 'Apéritif Restaurant', alt: 'Romantic table for two at Apéritif Restaurant' },
  { src: 'assets/couples-spa.webp', caption: 'Akoya Spa', alt: 'Couples massage at Akoya Spa' }
];
let photoIndex = 0;
const galleryImage = document.getElementById('galleryImage');
const galleryCount = document.getElementById('galleryCount');
const galleryCaption = document.getElementById('galleryCaption');
const photoDialog = document.getElementById('photoDialog');
const photoDialogImage = document.getElementById('photoDialogImage');
const photoDialogCaption = document.getElementById('photoDialogCaption');
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const photo = photos[photoIndex];
  galleryImage.src = photo.src;
  galleryImage.alt = photo.alt;
  galleryCount.textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  galleryCaption.textContent = photo.caption;
  photoDialogImage.src = photo.src;
  photoDialogImage.alt = photo.alt;
  photoDialogCaption.textContent = photo.caption;
}
document.getElementById('galleryPrev').addEventListener('click', () => showPhoto(photoIndex - 1));
document.getElementById('galleryNext').addEventListener('click', () => showPhoto(photoIndex + 1));
document.getElementById('galleryOpen').addEventListener('click', () => { showPhoto(photoIndex); photoDialog.showModal(); });
document.getElementById('photoClose').addEventListener('click', () => photoDialog.close());
document.getElementById('photoPrev').addEventListener('click', () => showPhoto(photoIndex - 1));
document.getElementById('photoNext').addEventListener('click', () => showPhoto(photoIndex + 1));
photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });

const stories = {
  dinner: {
    kicker: 'Part of your reservation', title: 'The Apéritif evening',
    text: 'Your reservation includes one Borderless Degustation Dinner for two. Apéritif pairs its Art Deco dining room with a multi-course menu. Your exact dining time is being arranged.',
    image: 'assets/aperitif-romantic.webp', alt: 'Romantic Apéritif restaurant setup',
    link: 'https://www.viceroybali.com/en/treat-me/7-course-dinner-in-aperitif/'
  },
  spa: {
    kicker: 'Direct-booking benefit', title: 'Massage for two',
    text: 'Your stay includes one 60-minute Balinese massage for two adults at Akoya Spa. The treatment time can be arranged with the hotel.',
    image: 'assets/akoya-spa.webp', alt: 'Treatment room at Akoya Spa',
    link: 'https://www.viceroybali.com/en/wellness-experiences/'
  },
  cocktail: {
    kicker: 'Direct-booking benefit', title: 'A drink each at Pinstripe',
    text: 'One cocktail or mocktail for each of you is included per stay at Pinstripe Bar.',
    image: 'assets/aperitif-dining.webp', alt: 'Guests toasting during dinner at Apéritif',
    link: 'https://www.pinstripebar.com/'
  },
  minibar: {
    kicker: 'Direct-booking benefit', title: 'The minibar',
    text: 'Soft drinks and snacks in the villa minibar are complimentary and replenished once a day during your stay.',
    image: 'assets/pool-suite-bedroom.webp', alt: 'Pool Suite bedroom',
    link: 'https://www.viceroybali.com/en/room/pool-suite/'
  },
  dining: {
    kicker: 'Direct-booking benefit', title: '10% off dining',
    text: 'The standard direct-booking benefit includes 10% off eligible food and beverage bills at Apéritif and CasCades, except during special events. Ask the hotel about any exclusions when you dine.',
    image: 'assets/aperitif-dining.webp', alt: 'Dining at Apéritif',
    link: 'https://www.viceroybali.com/en/bali-restaurants/'
  }
};
const storyDialog = document.getElementById('storyDialog');
document.querySelectorAll('[data-open-story]').forEach(button => button.addEventListener('click', () => {
  const story = stories[button.dataset.openStory];
  document.getElementById('storyKicker').textContent = story.kicker;
  document.getElementById('storyTitle').textContent = story.title;
  document.getElementById('storyText').textContent = story.text;
  document.getElementById('storyImage').src = story.image;
  document.getElementById('storyImage').alt = story.alt;
  document.getElementById('storyLink').href = story.link;
  storyDialog.showModal();
}));
document.getElementById('storyClose').addEventListener('click', () => storyDialog.close());
storyDialog.addEventListener('click', event => { if (event.target === storyDialog) storyDialog.close(); });
document.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  if (photoDialog.open) showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
});


