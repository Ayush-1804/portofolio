const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
 });

 document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value,
      user_email: form.user_email.value,
      message: form.message.value
    };

    try {
      const response = await fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Email sent successfully!');
        form.reset();
      } else {
        alert('Failed to send email.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  });
});

// Always start at the top on page reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Ensure the page scrolls to top on load
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
