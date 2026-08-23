/**
 * AI & Machine Learning Engineer Portfolio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initScrollSpy();
  initMobileMenu();
  initProjectFilter();
  initProjectModal();
  initEmailCopy();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Clean up legacy key
  if (localStorage.getItem('portfolio-theme')) {
    localStorage.removeItem('portfolio-theme');
  }

  // Dark is the absolute default
  const savedTheme = localStorage.getItem('theme-preference') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);
    
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-sun';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }
}

/* --------------------------------------------------------------------------
   2. Header Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   3. ScrollSpy & Smooth Scrolling
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Mobile Menu Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      if (navMenu.classList.contains('mobile-open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    }
  });

  // Close menu when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

/* --------------------------------------------------------------------------
   5. Projects Category Filter
   -------------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = (btn.getAttribute('data-filter') || 'all').toLowerCase();

      projectCards.forEach(card => {
        const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Project Modal Popup
   -------------------------------------------------------------------------- */
function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const detailBtns = document.querySelectorAll('.project-detail-btn');

  if (!modalOverlay) return;

  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;

      // Extract details from data script tag inside the card
      const dataScript = card.querySelector('.project-data-json');
      if (!dataScript) return;

      try {
        const project = JSON.parse(dataScript.textContent);
        populateModal(project);
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } catch (err) {
        console.error('Failed to parse project data:', err);
      }
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  function populateModal(p) {
    document.getElementById('modal-badge').textContent = p.badge || p.category;
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-subtitle').textContent = `${p.subtitle} (${p.period})`;
    document.getElementById('modal-problem').innerHTML = p.details.problem;
    document.getElementById('modal-solution').innerHTML = p.details.solution;
    document.getElementById('modal-architecture').textContent = p.details.architecture;
    
    // Visual Teaser Figure
    const figureSection = document.getElementById('modal-figure-section');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-image-caption');
    if (figureSection && modalImg && modalCaption) {
      if (p.teaser_image) {
        modalImg.src = p.teaser_image;
        modalImg.alt = p.title;
        modalCaption.textContent = p.teaser_caption || '';
        figureSection.style.display = 'block';
      } else {
        figureSection.style.display = 'none';
      }
    }

    // Results list
    const resultsContainer = document.getElementById('modal-results');
    resultsContainer.innerHTML = '';
    if (p.details.results && p.details.results.length) {
      p.details.results.forEach(res => {
        const li = document.createElement('li');
        li.textContent = res;
        resultsContainer.appendChild(li);
      });
    }

    // Modal Links
    const paperLink = document.getElementById('modal-paper-link');
    if (paperLink) {
      if (p.links && p.links.paper && p.links.paper !== '#' && p.links.paper !== '') {
        paperLink.href = p.links.paper;
        paperLink.style.display = 'inline-flex';
      } else {
        paperLink.style.display = 'none';
      }
    }

    const githubLink = document.getElementById('modal-github-link');
    if (githubLink) {
      if (p.id === 'yeti' && p.links && p.links.github && p.links.github !== '#' && p.links.github !== '') {
        githubLink.href = p.links.github;
        githubLink.style.display = 'inline-flex';
      } else {
        githubLink.style.display = 'none';
      }
    }
  }
}

/* --------------------------------------------------------------------------
   7. Email Copy & Toast Notification
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email') || 'byungwan.lim@gmail.com';
    
    navigator.clipboard.writeText(email).then(() => {
      showToast('이메일 주소가 클립보드에 복사되었습니다! (' + email + ')');
    }).catch(err => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('이메일 주소가 클립보드에 복사되었습니다!');
    });
  });

  function showToast(msg) {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = msg;
    
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}
