document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('auth-modal');
    const accountButton = document.querySelector('.account-button');
    const closeModalButton = document.querySelector('.auth-modal-close');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const recoverForm = document.getElementById('recover-form');

    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const showRecoverLink = document.getElementById('show-recover');
    const backToLoginLink = document.getElementById('back-to-login');

    function showForm(formToShow) {
        [loginForm, registerForm, recoverForm].forEach(form => {
            if (form) form.classList.remove('active');
        });
        if (formToShow) formToShow.classList.add('active');
    }

    if (accountButton) {
        accountButton.addEventListener('click', () => {
            if (authModal) {
                authModal.classList.add('active');
                showForm(loginForm); // Show login form by default
            }
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (authModal) authModal.classList.remove('active');
        });
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
            }
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(registerForm);
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(loginForm);
        });
    }

    if (showRecoverLink) {
        showRecoverLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(recoverForm);
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(loginForm);
        });
    }
});
