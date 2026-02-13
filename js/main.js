// js/main.js
// Temel etkileşimler: smooth scroll ve mobil menü toggle

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        const mm = document.getElementById('mobile-menu');
        if (mm && !mm.classList.contains('hidden')) mm.classList.add('hidden');
      }
    });
  });

  // Basit mobil menü: eğer DOM'da mobil menü yoksa oluştur
  const nav = document.querySelector('nav');
  const menuButtonSvg = document.querySelector('svg.lucide-menu');
  const menuButton = menuButtonSvg ? menuButtonSvg.parentElement : null;

  if (nav && menuButton) {
    let mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.id = 'mobile-menu';
      mobileMenu.className = 'md:hidden absolute top-16 left-0 right-0 bg-white/5 backdrop-blur-sm p-4 space-y-2 z-40 hidden';

      // Klasik linkleri kopyala (aynı sırayla)
      const links = [
        ['Ana Sayfa', '#home'],
        ['Hakkımda', '#about'],
        ['Yetenekler', '#skills'],
        ['Projeler', '#projects'],
        ['Deneyim', '#experience'],
        ['İletişim', '#contact'],
      ];

      links.forEach(function (item) {
        const a = document.createElement('a');
        a.href = item[1];
        a.className = 'block px-3 py-2 rounded-md text-base font-medium hover:text-[#FF6B6B]';
        a.textContent = item[0];
        mobileMenu.appendChild(a);
      });

      nav.appendChild(mobileMenu);
    }

    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Option: active link on scroll
  const sectionIds = ['#home', '#about', '#skills', '#projects', '#experience', '#contact'];
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

  function onScroll() {
    const y = window.scrollY + 200;
    let current = null;
    for (const s of sections) {
      if (s.offsetTop <= y) current = s;
    }
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('text-[#FF6B6B]', 'font-semibold'));
    if (current) {
      const active = document.querySelector(`nav a[href="#${current.id}"]`);
      if (active) active.classList.add('text-[#FF6B6B]', 'font-semibold');
    }

    // Navbar background toggle on scroll
    const scrollThreshold = 40; // px
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  // Contact form handling (mailto fallback)
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    function showInlineMessage() {
      // no-op: kullanıcı istemediği için görünür bildirim gösterilmeyecek
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (contactForm.querySelector('#name') || {}).value || '';
      const email = (contactForm.querySelector('#email') || {}).value || '';
      const subject = (contactForm.querySelector('#subject') || {}).value || '';
      const message = (contactForm.querySelector('#message') || {}).value || '';

      // Basic validation
      if (!name.trim()) return showInlineMessage('Lütfen adınızı girin.', true);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return showInlineMessage('Lütfen geçerli bir email adresi girin.', true);
      if (!subject.trim()) return showInlineMessage('Lütfen konu girin.', true);
      if (!message.trim()) return showInlineMessage('Lütfen mesajınızı yazın.', true);

      // Disable button while processing
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-60', 'cursor-not-allowed');
      showInlineMessage('Varsayılan e-posta istemcisi açılıyor...', false);

      // Build mailto
      const to = 'sakarsema3@gmail.com';
      const body = `İsim: ${name}\nEmail: ${email}\n\n${message}`;
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open mail client
      window.location.href = mailto;

      // After a short delay, show success and reset form
      setTimeout(() => {
        showInlineMessage('E-posta istemciniz açıldı. Mesajınızı gönderdikten sonra iletişimten teşekkür ederim.', false);
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
      }, 1000);
    });
  }

    // Projects: show only first 3 by default, toggle rest with the "Daha Fazla" button
    (function () {
      const projectsGrid = document.querySelector('#projects .grid');
      const btn = document.getElementById('show-more-projects');
      if (projectsGrid && btn) {
          const projectsSection = document.getElementById('projects');

          function setVisible(show) {
            if (!projectsSection) return;
            if (show) projectsSection.classList.remove('collapsed');
            else projectsSection.classList.add('collapsed');
            btn.textContent = show ? 'Daha Az' : 'Daha Fazla';
            btn.dataset.showing = show ? 'true' : 'false';
          }

          // initial state: keep collapsed (section has collapsed class in HTML)
          setVisible(false);

          btn.addEventListener('click', function () {
            const showing = btn.dataset.showing === 'true';
            setVisible(!showing);
          });
      }
    })();

  });