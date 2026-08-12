/* ============================================================
   PROJECT FILTERING (original logic, unchanged behavior)
============================================================ */
const searchInput = document.getElementById('searchInput');
const disciplineFilter = document.getElementById('disciplineFilter');
const languageFilter = document.getElementById('languageFilter');
const projectsGrid = document.getElementById('projectsGrid');
const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));
const emptyState = document.getElementById('emptyState');

function filterProjects() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedDiscipline = disciplineFilter.value;
    const selectedLanguage = languageFilter.value;

    let visibleCount = 0;

    projectCards.forEach((card) => {
        const cardDiscipline = card.dataset.discipline;
        const cardLanguage = card.dataset.language;
        const cardSearch = card.dataset.search;

        const matchesSearch = cardSearch.includes(searchValue);
        const matchesDiscipline = selectedDiscipline === 'all' || cardDiscipline === selectedDiscipline;
        const matchesLanguage = selectedLanguage === 'all' || cardLanguage === selectedLanguage;

        const shouldShow = matchesSearch && matchesDiscipline && matchesLanguage;
        card.style.display = shouldShow ? 'block' : 'none';

        if (shouldShow) visibleCount++;
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
}

searchInput.addEventListener('input', filterProjects);
disciplineFilter.addEventListener('change', filterProjects);
languageFilter.addEventListener('change', filterProjects);

/* ============================================================
   RESPECT REDUCED MOTION PREFERENCE
============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   HEADER SHRINK ON SCROLL
============================================================ */
const siteHeader = document.getElementById('siteHeader');

function updateHeaderState() {
    if (!siteHeader) return;
    if (window.scrollY > 12) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
}

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

/* ============================================================
   MOBILE NAV TOGGLE
============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ============================================================
   SCROLL-TRIGGERED REVEAL ANIMATIONS
============================================================ */
const revealTargets = document.querySelectorAll(
    '[data-animate], .project-card, .education-item, .experience-item, .skill-item, .contact-item'
);

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('in-view'));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el, index) => {
        el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
        revealObserver.observe(el);
    });
}

/* ============================================================
   ANIMATED SKILL BARS
============================================================ */
const skillFills = document.querySelectorAll('.skill-fill');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    skillFills.forEach((fill) => {
        fill.style.width = `${fill.dataset.width || 0}%`;
    });
} else {
    const skillObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    fill.style.width = `${fill.dataset.width || 0}%`;
                    observer.unobserve(fill);
                }
            });
        },
        { threshold: 0.4 }
    );

    skillFills.forEach((fill) => skillObserver.observe(fill));
}

/* ============================================================
   HERO ROLE TYPEWRITER
   Cycles through roles already referenced elsewhere on the page
============================================================ */
const roleTyped = document.getElementById('roleTyped');
const roles = ['Software Developer', 'Game Development', 'Web Development', 'Mobile Development'];

if (roleTyped) {
    if (prefersReducedMotion) {
        roleTyped.textContent = roles[0];
    } else {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            roleTyped.textContent = currentRole.substring(0, charIndex);

            let delay = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                delay = 1400;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 400;
            }

            setTimeout(typeLoop, delay);
        }

        typeLoop();
    }
}

/* ============================================================
   CASE STUDY MODAL
============================================================ */
const caseModal = document.getElementById('caseStudyModal');
const caseModalContent = document.getElementById('caseStudyContent');
const caseModalClose = document.getElementById('caseStudyClose');
const caseStudyButtons = document.querySelectorAll('.case-study-btn');

function openCaseStudy(templateId) {
    const template = document.getElementById(templateId);
    if (!template || !caseModal || !caseModalContent) return;

    caseModalContent.innerHTML = '';
    caseModalContent.appendChild(template.content.cloneNode(true));

    caseModal.classList.add('open');
    caseModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeCaseStudy() {
    if (!caseModal || !caseModalContent) return;

    caseModal.classList.remove('open');
    caseModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    caseModalContent.innerHTML = '';
}

caseStudyButtons.forEach((btn) => {
    btn.addEventListener('click', () => openCaseStudy(btn.dataset.caseTarget));
});

if (caseModalClose) {
    caseModalClose.addEventListener('click', closeCaseStudy);
}

if (caseModal) {
    caseModal.addEventListener('click', (event) => {
        if (event.target === caseModal) closeCaseStudy();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && caseModal && caseModal.classList.contains('open')) {
        closeCaseStudy();
    }
});