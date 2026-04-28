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