
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const dashboard = document.getElementById("dashboard");

const message = document.getElementById("message");
const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");

// Get registered users from localStorage.
function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem("secureAuthUsers") || "[]"
        );

        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

// Display success or error messages.
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

function clearMessage() {
    message.textContent = "";
    message.className = "message";
}

// Switch between login and registration forms.
function showLogin() {
    loginForm.hidden = false;
    registerForm.hidden = true;
    dashboard.hidden = true;

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    clearMessage();
}

function showRegister() {
    loginForm.hidden = true;
    registerForm.hidden = false;
    dashboard.hidden = true;

    loginTab.classList.remove("active");
    registerTab.classList.add("active");

    clearMessage();
}

loginTab.addEventListener("click", showLogin);
registerTab.addEventListener("click", showRegister);

// Register a new user.
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document
        .getElementById("registerUsername")
        .value.trim();

    const email = document
        .getElementById("registerEmail")
        .value.trim()
        .toLowerCase();

    const password = document.getElementById("registerPassword").value;

    // Validate password requirements.
    if (password.length < 8 || !/\d/.test(password)) {
        showMessage(
            "Password must be at least 8 characters long and contain at least one number.",
            "error"
        );
        return;
    }

    const users = getUsers();

    // Check for duplicate usernames or email addresses.
    const userExists = users.some(function (user) {
        return (
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email
        );
    });

    if (userExists) {
        showMessage(
            "This username or email is already registered. Please use another.",
            "error"
        );
        return;
    }

    // Save the account for this learning demo.
    users.push({ username, email, password });

    try {
        localStorage.setItem("secureAuthUsers", JSON.stringify(users));
    } catch {
        showMessage(
            "Unable to save your account. Please check your browser storage.",
            "error"
        );
        return;
    }

    registerForm.reset();
    showLogin();

    document.getElementById("loginUsername").value = email;

    showMessage(
        "Registration successful! Please log in with your new account.",
        "success"
    );
});

// Log in an existing user.
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const identifier = document
        .getElementById("loginUsername")
        .value.trim()
        .toLowerCase();

    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const matchedUser = users.find(function (user) {
        return (
            (
                user.username.toLowerCase() === identifier ||
                user.email.toLowerCase() === identifier
            ) && user.password === password
        );
    });

    // Use one error message for all incorrect credentials.
    if (!matchedUser) {
        showMessage(
            "Invalid username/email or password. Please try again.",
            "error"
        );
        return;
    }

    // Save the current demo login session.
    try {
        sessionStorage.setItem(
            "secureAuthSession",
            matchedUser.username
        );
    } catch {
        showMessage("Unable to start your session.", "error");
        return;
    }

    loginForm.reset();
    clearMessage();

    loginForm.hidden = true;
    registerForm.hidden = true;
    dashboard.hidden = false;

    loginTab.classList.remove("active");
    registerTab.classList.remove("active");

    welcomeMessage.textContent =
        `Welcome, ${matchedUser.username}! You are now logged in.`;
});

// Log out.
logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("secureAuthSession");

    showLogin();
    loginForm.reset();

    showMessage("You have successfully logged out.", "success");
});

// Restore a valid demo session after refreshing the page.
function restoreSession() {
    const username = sessionStorage.getItem("secureAuthSession");

    if (!username) {
        showLogin();
        return;
    }

    const user = getUsers().find(function (item) {
        return item.username === username;
    });

    if (!user) {
        sessionStorage.removeItem("secureAuthSession");
        showLogin();
        return;
    }

    loginForm.hidden = true;
    registerForm.hidden = true;
    dashboard.hidden = false;

    loginTab.classList.remove("active");
    registerTab.classList.remove("active");

    welcomeMessage.textContent =
        `Welcome, ${user.username}! You are now logged in.`;
}

restoreSession();
