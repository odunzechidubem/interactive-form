function togglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    if (input && toggle) {
        toggle.addEventListener("click", () => {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            toggle.classList.toggle("fa-eye");
            toggle.classList.toggle("fa-eye-slash");
        });
    }
}

// SIGN UP PAGE LOGIC
const signupForm = document.getElementById("form");

if (signupForm) {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone-input");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const signupErrorMsg = document.getElementById("error-message");

    // Checklist Elements
    const checklist = document.getElementById("password-checklist");
    const reqLength = document.getElementById("req-length");
    const reqUpper = document.getElementById("req-upper");
    const reqLower = document.getElementById("req-lower");
    const reqNumber = document.getElementById("req-number");
    const reqSymbol = document.getElementById("req-symbol");

    togglePassword("password", "toggle-show-password");
    togglePassword("confirm-password", "toggle-confirm-password");

    if(phoneInput){
        phoneInput.addEventListener("input", () => {
            phoneInput.value = phoneInput.value
                .replace(/[^0-9+]/g, "")
                .replace(/(?!^)\+/g, "");
        });
    }

    // REAL-TIME PASSWORD STRENGTH CHECK
    if(passwordInput && checklist) {
        passwordInput.addEventListener("focus", () => {
            checklist.classList.add("visible");
        });
        passwordInput.addEventListener("blur", () => {
            checklist.classList.remove("visible");
        });

        passwordInput.addEventListener("input", () => {
            const val = passwordInput.value;
            
            // Length
            if(val.length >= 8) reqLength.classList.add("valid"); else reqLength.classList.remove("valid");
            
            // Upper
            if(/[A-Z]/.test(val)) reqUpper.classList.add("valid"); else reqUpper.classList.remove("valid");
            
            // Lower
            if(/[a-z]/.test(val)) reqLower.classList.add("valid"); else reqLower.classList.remove("valid");
            
            // Number 
            if(/[0-9]/.test(val)) reqNumber.classList.add("valid"); else reqNumber.classList.remove("valid");
            
            // Symbol
            if(/[!@#$%^&*(),.?":{}|<>]/.test(val)) reqSymbol.classList.add("valid"); else reqSymbol.classList.remove("valid");
        });
    }

    const signupInputs = [usernameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput];
    signupInputs.forEach(input => {
        if(input) {
            input.addEventListener('input', () => {
                if(input.parentElement.classList.contains('incorrect')){
                    input.parentElement.classList.remove('incorrect');
                }
            });
        }
    });

    function getSignupFormErrors(username, email, phone, password, confirmPassword){
        let errorMessages = []
        
        if(username.value.trim() === ""){
            errorMessages.push("Please enter your full name.");
            username.parentElement.classList.add('incorrect');
        } else if(username.value.trim().length < 4){
            errorMessages.push("Full name must be at least 4 characters.");
            username.parentElement.classList.add('incorrect');
        }
        if(email.value.trim() === ""){
            errorMessages.push("Please enter your email.");
            email.parentElement.classList.add('incorrect');
        }
        if(phone.value.trim() === ""){
            errorMessages.push("Please enter your phone number.");
            phone.parentElement.classList.add('incorrect');
        }

        const passVal = password.value;
        const hasLength = passVal.length >= 8;
        const hasUpper = /[A-Z]/.test(passVal);
        const hasLower = /[a-z]/.test(passVal);
        const hasNumber = /[0-9]/.test(passVal);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(passVal);

        if(passVal === ""){    
            errorMessages.push("Please enter your password.");
            password.parentElement.classList.add('incorrect');
        } 
        else if(!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
            errorMessages.push("Password does not meet requirements.");
            password.parentElement.classList.add('incorrect');
            checklist.classList.add("visible");
        }

        if(confirmPassword.value === ""){
            errorMessages.push("Please confirm your password.");
            confirmPassword.parentElement.classList.add('incorrect');
        }
        
        if(password.value !== "" && confirmPassword.value !== "" && password.value !== confirmPassword.value){
            errorMessages.push("Passwords do not match.");
            password.parentElement.classList.add('incorrect');
            confirmPassword.parentElement.classList.add('incorrect');
        }

        return errorMessages;
    }

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();   
        const errors = getSignupFormErrors(usernameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput);
        
        if(errors.length > 0){
            signupErrorMsg.innerText = errors[0]; 
            signupErrorMsg.style.display = 'block';
        } else {
            signupErrorMsg.style.display = 'none';
            alert("Sign Up Successful!");
            signupForm.reset();
            [reqLength, reqUpper, reqLower, reqNumber, reqSymbol].forEach(el => el.classList.remove("valid"));
            window.location.href = "login.html";
        }
    });
}



// LOGIN PAGE LOGIC
const loginForm = document.getElementById("login-form");

if (loginForm) {
    const loginEmailInput = document.getElementById("login-email");
    const loginPasswordInput = document.getElementById("login-password");
    const loginErrorMsg = document.getElementById("error-message");

    togglePassword("login-password", "toggle-show-password");

    // Mock Database
    const registeredUsers = [
        { email: "odunzechidubem73@gmail.com", password: "John123#", phone: "+2347035215601" },
        { email: "admin@test.com", password: "admin", phone: "+2347035215601" }
    ];

    [loginEmailInput, loginPasswordInput].forEach(input => {
        input.addEventListener("input", () => {
            input.parentElement.classList.remove("incorrect");
            loginErrorMsg.style.display = "none";
        });
    });

    function getLoginFormErrors(email, password) {
        let errors = [];

        if (email.value.trim() === "") {
            errors.push("Please enter your email or phone.");
            email.parentElement.classList.add("incorrect");
        }

        if (password.value === "") {
            errors.push("Please enter your password.");
            password.parentElement.classList.add("incorrect");
        }

        return errors;
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const errors = getLoginFormErrors(loginEmailInput, loginPasswordInput);

        if (errors.length > 0) {
            loginErrorMsg.innerText = errors[0];
            loginErrorMsg.style.display = "block";
            return;
        }

        const emailVal = loginEmailInput.value.trim();
        const passVal = loginPasswordInput.value;

        const user = registeredUsers.find(
            user =>
                (user.email === emailVal || user.phone === emailVal) &&
                user.password === passVal
        );

        if (user) {
            alert("Login Successful! Redirecting...");
            loginForm.reset();
            window.location.href = "dashboard.html";
        } else {
            loginErrorMsg.innerText = "Invalid email or password.";
            loginErrorMsg.style.display = "block";

            loginEmailInput.value = "";
    loginPasswordInput.value = "";

    loginEmailInput.parentElement.classList.remove("incorrect");
    loginPasswordInput.parentElement.classList.remove("incorrect");

    loginEmailInput.focus();
        }
    });
}
