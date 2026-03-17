document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('auth-modal');
    const userProfileModal = document.getElementById('user-profile-modal');
    const closeModalButton = document.querySelector('.auth-modal-close');
    const profileModalCloseBtn = document.querySelector('.profile-modal-close');

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

    // --- Login Simulation ---
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;
            const errorMsg = loginForm.querySelector('.error-message');

            if (email && password) {
                // Simulate successful login
                sessionStorage.setItem('isLoggedIn', 'true');
                authModal.classList.remove('active');
                if(errorMsg) errorMsg.textContent = '';
                // Optionally, you can dispatch a custom event to notify other parts of the app
                document.dispatchEvent(new CustomEvent('user-logged-in'));
            } else {
                if(errorMsg) {
                    errorMsg.textContent = 'Пожалуйста, введите email и пароль.';
                }
            }
        });
    }

    // --- Registration Simulation ---
    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('#register-name').value;
            const email = registerForm.querySelector('#register-email').value;
            const password = registerForm.querySelector('#register-password').value;
            const confirmPassword = registerForm.querySelector('#register-confirm-password').value;
            const errorMsg = registerForm.querySelector('.error-message');

            if (!name || !email || !password || !confirmPassword) {
                if(errorMsg) errorMsg.textContent = 'Пожалуйста, заполните все поля.';
                return;
            }

            if (password !== confirmPassword) {
                if(errorMsg) errorMsg.textContent = 'Пароли не совпадают.';
                return;
            }

            // Simulate successful registration and login
            sessionStorage.setItem('isLoggedIn', 'true');
            authModal.classList.remove('active');
            if(errorMsg) errorMsg.textContent = '';
            document.dispatchEvent(new CustomEvent('user-registered-and-logged-in'));
        });
    }



    document.addEventListener('open-account-modal', () => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');

        if (isLoggedIn) {
            if (userProfileModal) userProfileModal.classList.add('active');
        } else {
            if (authModal) {
                authModal.classList.add('active');
                showForm(loginForm); // Show login form by default
            }
        }
    });

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (authModal) authModal.classList.remove('active');
        });
    }

    if(profileModalCloseBtn) {
        profileModalCloseBtn.addEventListener('click', () => {
            if (userProfileModal) userProfileModal.classList.remove('active');
        });
    }

    // --- Logout Simulation ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            userProfileModal.classList.remove('active');
            // Optionally, dispatch a custom event to notify other parts of the app
            document.dispatchEvent(new CustomEvent('user-logged-out'));
        });
    }



    // --- Modal Closing Logic ---
    function setupModalClosing(modal) {
        if (!modal) return;
        let mouseDownOnOverlay = false;

        modal.addEventListener('mousedown', (e) => {
            if (e.target === modal) {
                mouseDownOnOverlay = true;
            }
        });

        modal.addEventListener('mouseup', (e) => {
            if (e.target === modal && mouseDownOnOverlay) {
                modal.classList.remove('active');
            }
            mouseDownOnOverlay = false;
        });
    }

    setupModalClosing(authModal);
    setupModalClosing(userProfileModal);



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
