document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  /* ---------- Sticky header ---------- */
  const header = document.getElementById('siteHeader');
  function updateHeader(){
    if(window.scrollY > 60){ header.classList.add('is-scrolled'); }
    else{ header.classList.remove('is-scrolled'); }
  }
  document.addEventListener('scroll', updateHeader, { passive:true });
  updateHeader();

/* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const mainNavClose = document.getElementById('mainNavClose');

  function openNav(){
    mainNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav(){
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    mainNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  mainNavClose.addEventListener('click', closeNav);
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ---------- Scroll spy ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = document.querySelector(`[data-nav][href="${id}"]`);
      if(!link) return;
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spyObserver.observe(s));
  


  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-point, .why-item, .doctor-card, .journal-card, .journal-feature, .process-step, .vision-card, .faq-item, .video-slide'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if(p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Mouse parallax (hero) ---------- */
  const heroVisual = document.getElementById('heroVisual');
  if(heroVisual && window.matchMedia('(pointer:fine)').matches){
    const frame = heroVisual.querySelector('[data-parallax]');
    const small = heroVisual.querySelectorAll('[data-parallax-sm]');
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if(frame) frame.style.transform = `translate(${x * -12}px, ${y * -12}px)`;
      small.forEach((el, i) => {
        const factor = (i + 1) * 10;
        el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
    heroVisual.addEventListener('mouseleave', () => {
      if(frame) frame.style.transform = '';
      small.forEach(el => el.style.transform = '');
    });
  }

  /* ---------- Custom cursor (desktop) ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if(window.matchMedia('(pointer:fine)').matches){
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    function animateRing(){
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)');
      el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if(window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
  }

  /* ---------- Ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------- Treatment tabs ---------- */
  const tabs = document.querySelectorAll('.treat-tab');
  const panels = document.querySelectorAll('.treat-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
      const target = tab.dataset.tab;
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });
document.querySelectorAll('[data-accordion]').forEach(accordion => {
  accordion.querySelectorAll('.proc-item').forEach(item => {
    const head = item.querySelector('.proc-head');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-active');
      accordion.querySelectorAll('.proc-item').forEach(i => {
        i.classList.remove('is-active');
        i.querySelector('.proc-head').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen){
        item.classList.add('is-active');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
/* ---------- Doctor profile slide-out / accordion ---------- */
  document.querySelectorAll('.doctor-card--expandable').forEach(card => {
    const openBtn = card.querySelector('[data-profile-open]');
    const closeBtn = card.querySelector('[data-profile-close]');
    const panel = card.querySelector('.doctor-bio-panel');
    if(!openBtn || !closeBtn || !panel) return;

    function open(){
      card.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
      openBtn.textContent = 'Hide Profile';
      panel.setAttribute('aria-hidden', 'false');
    }
    function close(){
      card.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.textContent = 'View Full Profile';
      panel.setAttribute('aria-hidden', 'true');
    }

    openBtn.addEventListener('click', () => {
      card.classList.contains('is-open') ? close() : open();
    });
    closeBtn.addEventListener('click', close);
  });
  /* ---------- Achievements slider + lightbox ---------- */
  const achvTrack = document.getElementById('achvTrack');
  const achvPrev = document.getElementById('achvPrev');
  const achvNext = document.getElementById('achvNext');
  if(achvTrack){
    const achvScrollAmount = () => achvTrack.querySelector('.achv-card').offsetWidth + 26;
    achvNext.addEventListener('click', () => achvTrack.scrollBy({ left: achvScrollAmount(), behavior:'smooth' }));
    achvPrev.addEventListener('click', () => achvTrack.scrollBy({ left: -achvScrollAmount(), behavior:'smooth' }));
  }

  const achvModal = document.getElementById('achvModal');
  const achvModalImg = document.getElementById('achvModalImg');
  const achvModalClose = document.getElementById('achvModalClose');

  document.querySelectorAll('[data-achv-open]').forEach(card => {
    card.addEventListener('click', () => {
      achvModalImg.src = card.dataset.img;
      achvModal.classList.add('is-open');
      achvModal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeAchvModal(){
    achvModal.classList.remove('is-open');
    achvModal.setAttribute('aria-hidden', 'true');
    achvModalImg.src = '';
  }
  achvModalClose.addEventListener('click', closeAchvModal);
  achvModal.addEventListener('click', (e) => {
    if(e.target === achvModal) closeAchvModal();
  });
  /* ---------- Video slider ---------- */
  const videoTrack = document.getElementById('videoTrack');
  const videoPrev = document.getElementById('videoPrev');
  const videoNext = document.getElementById('videoNext');
  if(videoTrack){
    const scrollAmount = () => videoTrack.querySelector('.video-slide').offsetWidth + 26;
    videoNext.addEventListener('click', () => videoTrack.scrollBy({ left: scrollAmount(), behavior:'smooth' }));
    videoPrev.addEventListener('click', () => videoTrack.scrollBy({ left: -scrollAmount(), behavior:'smooth' }));
  }

  /* ---------- Video modal ---------- */

const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const closeBtn = document.getElementById("videoModalClose");

document.querySelectorAll(".video-thumb").forEach((thumb) => {

    thumb.addEventListener("click", () => {

        const source = thumb.querySelector("video source");

        if (!source) return;

        modalVideo.src = source.src;

        videoModal.classList.add("is-open");
        videoModal.setAttribute("aria-hidden", "false");

        modalVideo.load();
        modalVideo.play();

    });

});

function closeVideoModal() {

    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.removeAttribute("src");

    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");

}

closeBtn.addEventListener("click", closeVideoModal);

videoModal.addEventListener("click", (e) => {

    if (e.target === videoModal) {

        closeVideoModal();

    }

});

  /* ---------- Testimonial slider ---------- */
  const testiTrack = document.getElementById('testiTrack');
  const testiSlides = testiTrack.querySelectorAll('.testi-slide');
  const testiDotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;
  testiSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    if(i === 0) dot.classList.add('is-active');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.addEventListener('click', () => showTesti(i));
    testiDotsWrap.appendChild(dot);
  });
  function showTesti(i){
    testiSlides.forEach(s => s.classList.remove('is-active'));
    testiDotsWrap.querySelectorAll('button').forEach(d => d.classList.remove('is-active'));
    testiSlides[i].classList.add('is-active');
    testiDotsWrap.children[i].classList.add('is-active');
    testiIndex = i;
  }
  setInterval(() => showTesti((testiIndex + 1) % testiSlides.length), 6000);

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('is-active');
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!isActive){
        item.classList.add('is-active');
        q.setAttribute('aria-expanded','true');
      }
    });
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  document.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 700);
  }, { passive:true });
  backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- Contact form validation ---------- */
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    contactForm.querySelectorAll(".form-field").forEach(field => {
        const input = field.querySelector("input, select, textarea");

        if (!input || !input.hasAttribute("required")) return;

        const ok = input.checkValidity();

        field.classList.toggle("is-invalid", !ok);

        if (!ok) valid = false;
    });

    if (!valid) return;

    // Get form values
    const name = document.getElementById("fName").value.trim();
    const phone = document.getElementById("fPhone").value.trim();
    const email = document.getElementById("fEmail").value.trim();
    const condition = document.getElementById("fCondition").value;
    const message = document.getElementById("fMsg").value.trim();

    // Your WhatsApp Number (without +)
    const whatsappNumber = "918148306070";

    // WhatsApp Message
    const whatsappMessage = `*New Callback Request*

Name: ${name}
Phone: ${phone}
Email: ${email}
Condition: ${condition}

 Message:
${message || "N/A"}
`;

    // Show success message
    formSuccess.classList.add("is-visible");

    // Reset form
    contactForm.reset();

    // Open WhatsApp
    window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank"
    );

    setTimeout(() => {
        formSuccess.classList.remove("is-visible");
    }, 5000);
});

// Remove validation error while typing
contactForm.querySelectorAll("input, select, textarea").forEach(el => {
    el.addEventListener("input", () => {
        const field = el.closest(".form-field");
        if (field && el.checkValidity()) {
            field.classList.remove("is-invalid");
        }
    });
});

  /* ---------- Newsletter form ---------- */
  // const newsletterForm = document.getElementById('newsletterForm');
  // const newsletterSuccess = document.getElementById('newsletterSuccess');
  // newsletterForm.addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   newsletterSuccess.classList.add('is-visible');
  //   newsletterForm.reset();
  //   setTimeout(() => newsletterSuccess.classList.remove('is-visible'), 5000);
  // });

  /* ---------- Chatbot ---------- */
//   const chatbotToggle = document.getElementById('chatbotToggle');
//   const chatbotWindow = document.getElementById('chatbotWindow');
//   const chatbotClose = document.getElementById('chatbotClose');
//   const chatbotBody = document.getElementById('chatbotBody');
//   const chatbotForm = document.getElementById('chatbotForm');
//   const chatbotInput = document.getElementById('chatbotInput');
//   const chatbotQuick = document.getElementById('chatbotQuick');

//   function openChat(){
//     chatbotWindow.classList.add('is-open');
//     chatbotWindow.setAttribute('aria-hidden','false');
//   }
//   chatbotToggle.addEventListener('click', () => {
//     chatbotWindow.classList.contains('is-open') ? closeChat() : openChat();
//   });
//   function closeChat(){
//     chatbotWindow.classList.remove('is-open');
//     chatbotWindow.setAttribute('aria-hidden','true');
//   }
//   chatbotClose.addEventListener('click', closeChat);

//   const botReplies = {
//     hours: "We're open Monday to Saturday, 8:00 AM – 8:00 PM, and Sundays by appointment.",
//     book: "You can book by filling in the contact form below, calling +91 98765 43210, or messaging us on WhatsApp.",
//     location: "We're located at 12 Kasturi Estate, 2nd Avenue, Chennai 600028 — see the map in our Contact section.",
//     treatments: "We treat stroke, Parkinson's, vertigo, balance disorders, musculoskeletal pain, and offer home physiotherapy and healthy ageing programmes."
//   };

//   function addMessage(text, who){
//     const div = document.createElement('div');
//     div.className = 'chat-msg chat-msg--' + who;
//     div.textContent = text;
//     chatbotBody.appendChild(div);
//     chatbotBody.scrollTop = chatbotBody.scrollHeight;
//   }

//   function botRespond(userText){
//     const t = userText.toLowerCase();
//     let reply = "Thanks for your message — for anything specific, please call +91 98765 43210 or use the contact form below and our team will get back to you shortly.";
//     if(t.includes('hour') || t.includes('time') || t.includes('open')) reply = botReplies.hours;
//     else if(t.includes('book') || t.includes('appointment')) reply = botReplies.book;
//     else if(t.includes('locat') || t.includes('address') || t.includes('where')) reply = botReplies.location;
//     else if(t.includes('treat') || t.includes('condition') || t.includes('stroke') || t.includes('parkinson') || t.includes('vertigo')) reply = botReplies.treatments;
//     setTimeout(() => addMessage(reply, 'bot'), 500);
//   }

//   chatbotQuick.addEventListener('click', (e) => {
//     const btn = e.target.closest('button[data-q]');
//     if(!btn) return;
//     addMessage(btn.textContent, 'user');
//     const reply = botReplies[btn.dataset.q];
//     setTimeout(() => addMessage(reply, 'bot'), 500);
//   });

//   chatbotForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const val = chatbotInput.value.trim();
//     if(!val) return;
//     addMessage(val, 'user');
//     botRespond(val);
//     chatbotInput.value = '';
//   });

});
