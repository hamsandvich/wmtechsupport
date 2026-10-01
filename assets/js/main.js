/* WMTechsupport — interactive bits */
// ---- mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// ---- testimonial slider
(function () {
  const slider = document.querySelector('.t-slider');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.t-slide')];
  const dots = [...slider.querySelectorAll('.t-dot')];
  const counter = slider.querySelector('#tCur');
  let i = 0, timer = null;
  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    if (counter) counter.textContent = i + 1;
    restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(i + 1), 7000);
  }
  slider.querySelector('.t-prev').addEventListener('click', () => go(i - 1));
  slider.querySelector('.t-next').addEventListener('click', () => go(i + 1));
  dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.i)));
  restart();
})();

// ---- faq accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    q.setAttribute('aria-expanded', open);
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
  });
});

// ---- gallery lightbox
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.g-item img').forEach((im) => {
    im.addEventListener('click', () => {
      lbImg.src = im.src;
      lbImg.alt = im.alt;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ---- contact form
// Self-hosting: no backend. Set FORM_ENDPOINT to a form service URL
// (e.g. a Formspree endpoint like "https://formspree.io/f/xxxx") to have
// submissions emailed to you. Leave empty to fall back to the visitor's
// email app via a pre-filled message to the shop.
const FORM_ENDPOINT = '';

document.querySelectorAll('.contact-form').forEach((form) => {
  const note = form.querySelector('#formNote');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) {
      note.textContent = 'Please fill in your name, email, and message.';
      return;
    }
    if (FORM_ENDPOINT) {
      try {
        const r = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ ...data, _subject: 'Website contact: ' + data.name }),
        });
        if (!r.ok) throw new Error('send failed');
        note.textContent = 'Thanks! Your message was sent. We\u2019ll be in touch soon.';
        form.reset();
      } catch {
        note.textContent = 'Something went wrong sending your message. Please call us at (780) 263-4258.';
      }
      return;
    }
    const subject = encodeURIComponent('Website inquiry from ' + data.name);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n${data.phone ? 'Phone: ' + data.phone + '\n' : ''}\n${data.message}`
    );
    note.textContent = 'Opening your email app to send the message\u2026';
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });
});
