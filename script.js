// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
        navLinks.style.position = '';
        navLinks.style.flexDirection = '';
        navLinks.style.backgroundColor = '';
        navLinks.style.top = '';
        navLinks.style.left = '';
        navLinks.style.width = '';
        navLinks.style.height = '';
        navLinks.style.padding = '';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'fixed';
        navLinks.style.flexDirection = 'column';
        navLinks.style.backgroundColor = 'var(--primary-color)';
        navLinks.style.top = '0';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.height = '100vh';
        navLinks.style.padding = '4rem 2rem';
        navLinks.style.zIndex = '100';
        navLinks.style.justifyContent = 'center';
        navLinks.style.textAlign = 'center';
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    });
});

// Language Toggle
const langSpans = document.querySelectorAll('.lang-selector span');

function setLanguage(lang) {
    // Update active class
    langSpans.forEach(span => {
        if (span.getAttribute('data-lang') === lang) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });

    // Update Text Content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            const translation = translations[lang][key];

            // Toggle visibility for elements that should only appear in certain languages
            const container = element.closest('.i18n-container');
            if (translation === "") {
                if (container) container.style.display = 'none';
                element.style.display = 'none';
            } else {
                if (container) container.style.display = 'block'; // Default to block
                element.style.display = ''; // Restore default display

                // Update content
                if (translation.includes('<')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        }
    });

    // Save preference
    localStorage.setItem('putti-lang', lang);
    document.documentElement.lang = lang;
}

// Event Listeners for Language Toggle
langSpans.forEach(span => {
    span.addEventListener('click', () => {
        const lang = span.getAttribute('data-lang');
        setLanguage(lang);
    });
});

// Initialize Language
const savedLang = localStorage.getItem('putti-lang') || 'pt';
setLanguage(savedLang);

// Form Submission Handling
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentLang = document.documentElement.lang || 'pt';
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;

        // Visual loading state
        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        // Prepare data for FormSubmit AJAX
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        fetch(contactForm.getAttribute('action'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success === "true" || result.success === true) {
                    formResponse.textContent = translations[currentLang]['form-success'];
                    formResponse.className = 'form-response success active';
                    contactForm.reset();
                } else {
                    throw new Error('FormSubmit error');
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                formResponse.textContent = translations[currentLang]['form-error'];
                formResponse.className = 'form-response error active';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Auto hide message after 5 seconds
                setTimeout(() => {
                    formResponse.classList.remove('active');
                }, 5000);
            });
    });
}
