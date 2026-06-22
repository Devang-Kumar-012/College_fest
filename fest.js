const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('mainNav');
const scrollTopButton = document.getElementById('scrollTop');
const form = document.getElementById('registrationForm');
const countBadge = document.getElementById('participantCount');
const formMessage = document.getElementById('formMessage');
const lastRegistration = document.getElementById('lastRegistration');
const hideEmailBtn = document.getElementById('hideEmailBtn');
const emailRow = document.getElementById('emailRow');
const emailInput = document.getElementById('email');
const navLinks = document.querySelectorAll('.site-nav a');

function toggleNavigation() {
  nav.classList.toggle('open');
}

function setScrollButton() {
  scrollTopButton.classList.toggle('visible', window.scrollY > 360);
}

function updateParticipantCount() {
  const registrations = JSON.parse(localStorage.getItem('technofestRegistrations') || '[]');
  countBadge.textContent = registrations.length;
  if (registrations.length > 0) {
    const latest = registrations[registrations.length - 1];
    lastRegistration.textContent = `${latest.name} registered for ${latest.events.join(', ')}.`;
  } else {
    lastRegistration.textContent = 'No registrations yet. Be the first to join!';
  }
}

function showMessage(text, type = 'success') {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  formMessage.style.opacity = '1';
  clearTimeout(formMessage.hideTimer);
  formMessage.hideTimer = setTimeout(() => {
    formMessage.style.opacity = '0';
  }, 4200);
}

function validateForm(data) {
  const required = {
    name: data.name && data.name.length >= 3,
    email: data.email && /^\S+@\S+\.\S+$/.test(data.email),
    phone: data.phone && /^\d{10,15}$/.test(data.phone.replace(/\D/g, '')),
    college: data.college && data.college.length >= 3,
    participantId: data.participantId && data.participantId.length >= 3,
    events: data.events.length > 0,
  };

  document.querySelectorAll('.registration-form input').forEach((input) => {
    input.classList.remove('invalid');
  });

  if (!required.name) return 'Please enter a valid name.';
  if (!required.email) {
    emailInput.classList.add('invalid');
    return 'Please enter a valid email address.';
  }
  if (!required.phone) return 'Please enter a valid phone number.';
  if (!required.college) return 'Please enter your college name.';
  if (!required.participantId) return 'Please enter a valid participant ID.';
  if (!required.events) return 'Choose at least one event to participate in.';

  return '';
}

function getSelectedEvents() {
  return Array.from(document.querySelectorAll('input[name="event"]:checked')).map((input) => input.value);
}

function buildRegistrationData() {
  return {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    college: document.getElementById('college').value.trim(),
    participantId: document.getElementById('participant-id').value.trim(),
    tshirt: document.querySelector('input[name="tshirt"]:checked')?.value || 'Not selected',
    events: getSelectedEvents(),
    timestamp: new Date().toISOString(),
  };
}

function resetForm() {
  form.reset();
}

function handleRegistration(event) {
  event.preventDefault();
  const data = buildRegistrationData();
  const error = validateForm(data);
  if (error) {
    showMessage(error, 'error');
    return;
  }

  const registrations = JSON.parse(localStorage.getItem('technofestRegistrations') || '[]');
  registrations.push(data);
  localStorage.setItem('technofestRegistrations', JSON.stringify(registrations));
  updateParticipantCount();
  showMessage('Registration successful! See you at Technofest 2026.');
  resetForm();
}

function toggleEmailField() {
  const hidden = emailRow.classList.toggle('hidden-row');
  hideEmailBtn.textContent = hidden ? 'Show Email Field' : 'Hide Email Field';
  if (hidden) {
    emailInput.value = '';
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navToggle?.addEventListener('click', toggleNavigation);
window.addEventListener('scroll', setScrollButton);
form?.addEventListener('submit', handleRegistration);
hideEmailBtn?.addEventListener('click', toggleEmailField);
scrollTopButton?.addEventListener('click', scrollToTop);
window.addEventListener('DOMContentLoaded', updateParticipantCount);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});
