window.onload = () => {
    //global namespace

    const loadingCont = document.querySelector('.loading-cont');
    const splashMain = document.querySelector('.login-cont');
    const signUpBtn = document.querySelector('#signup-button');
    const forgotBtn = document.querySelector('#forgot-button');
    const loginBox = document.querySelector('.login-form-wrap');
    const signupBox = document.querySelector('.signup-form-wrap');
    const forgotBox1 = document.querySelector('.forgot-form-wrap');
    const backBtn = document.querySelector('#back-signUp');
    const backBtnForgot = document.querySelector('#back-forgot');
    const backBtnEmail = document.querySelector('#back-forgot-2');
    const regBtn = document.querySelector('#signup-btn-conf');
    const forgotEmailBtn = document.querySelector('#forgot-btn-conf');
    const emailBox = document.querySelector('.email_code-form-wrap');
    const signUpUsername = document.querySelector('#username_req');
    const signUpEmail = document.querySelector('#email');
    const signUpPassword = document.querySelector('#password_req');
    const signUpPasswordConfirm = document.querySelector('#password_req_confirm');




    {
        init();
        signUpBtn.addEventListener('click', handleSignUpAnimation.bind(null));
        forgotBtn.addEventListener('click', handleForgotAnimation.bind(null));
        backBtn.addEventListener('click', handleBackToLogin.bind(null, 'signUp'));
        forgotEmailBtn.addEventListener('click', handleEmailAnimation.bind(null));
        backBtnForgot.addEventListener('click', handleBackToLogin.bind(null, 'forgot'));
        backBtnEmail.addEventListener('click', handleBackToLogin.bind(null, 'email'));
        signUpUsername.addEventListener('keyup', verifySignUp.bind(null));
        signUpEmail.addEventListener('keyup', verifySignUp.bind(null));
        signUpPassword.addEventListener('keyup', verifySignUp.bind(null));
        signUpPasswordConfirm.addEventListener('keyup', verifySignUp.bind(null));

    }

    async function init() {
        var flag = await verify_login();
        if (flag) {
            const splashBgUrl = "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=3310&q=80";
            getSplashScreenBackground(splashBgUrl);
            handleLogin();
        }

    }

    async function verify_login() {
        if (document.cookie != "") {
            let token = getCook('token');
            console.log(token);
            const res = await fetch('/verifytoken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'token': token
                })
            })
            if (res.ok) {
                const json_main = await res.json();
                if (json_main.message === "Signature expired. Please log in again." || json_main.message === "Invalid token.") {
                    console.log(json_main.message);
                    deleteCookies();
                } else {
                    window.location = '/dashBoard';
                }

            }
        }
        return true;
    }

    function verifySignUp() {
        let error = document.querySelector('#error-signUp');
        if (signUpUsername.value === undefined || signUpUsername.value === "" ||
            signUpEmail.value === undefined || signUpEmail.value === "" ||
            signUpPassword.value === undefined || signUpPassword.value === "" ||
            signUpEmail.value === undefined || signUpEmail.value === "" ||
            signUpPassword.value === undefined || signUpPassword.value === "" ||
            signUpPasswordConfirm.value === undefined || signUpPasswordConfirm.value === "") {
            error.innerText = "Fields must not be empty";
            regBtn.disabled = true;
        } else {
            regBtn.disabled = false;
            error.innerText = "";
        }
        // signUpEmail.addEventListener('keyup', verifySignUp.bind(null));
        // signUpPassword.addEventListener('keyup', verifySignUp.bind(null));
        // signUpPasswordConfirm.addEventListener('keyup', verifySignUp.bind(null));
    }

    function handleSignUpAnimation() {
        animateCSS(loginBox, 'slideOutLeft faster', () => {
            loginBox.style.display = 'none';
            signupBox.style.display = 'flex';
            regBtn.disabled = true;
            animateCSS(signupBox, 'slideInRight faster');

        });
    }

    function handleForgotAnimation() {
        animateCSS(loginBox, 'slideOutLeft faster', () => {
            loginBox.style.display = 'none';
            forgotBox1.style.display = 'flex';
            // forgotEmailBtn.disabled = true;
            animateCSS(forgotBox1, 'slideInRight faster');

        });
    }

    function handleEmailAnimation() {
        animateCSS(forgotBox1, 'slideOutLeft faster', () => {
            forgotBox1.style.display = 'none';
            emailBox.style.display = 'flex';
            // forgotEmailBtn.disabled = true;
            animateCSS(emailBox, 'slideInRight faster');

        });
    }

    function handleBackToLogin(currentPage) {
        if (currentPage === 'signUp') {
            animateCSS(signupBox, 'slideOutRight faster', () => {
                signupBox.style.display = 'none';
                loginBox.style.display = 'flex';
                animateCSS(loginBox, 'slideInLeft faster');
            });
        } else if (currentPage === 'forgot') {
            animateCSS(forgotBox1, 'slideOutRight faster', () => {
                forgotBox1.style.display = 'none';
                loginBox.style.display = 'flex';
                animateCSS(loginBox, 'slideInLeft faster');
            });
        } else if (currentPage === 'email') {
            animateCSS(emailBox, 'slideOutRight faster', () => {
                emailBox.style.display = 'none';
                loginBox.style.display = 'flex';
                animateCSS(loginBox, 'slideInLeft faster');
            });
        }

    }

    function getSplashScreenBackground(url) {
        var img = new Image();
        img.src = url;
        img.onload = () => {
            exitLoadingAnimationHandle()
        }
    }

    function animateCSS(node, animationName, callback) {
        //Animate.css Animation handler method
        let animatedArr = animationName.split(" ");
        node.classList.add('animated', ...animatedArr)

        function handleAnimationEnd() {
            node.classList.remove('animated', ...animatedArr);
            node.removeEventListener('animationend', handleAnimationEnd);
            if (typeof callback === 'function') callback()
        }
        node.addEventListener('animationend', handleAnimationEnd);
    }

    function exitLoadingAnimationHandle() {
        animateCSS(loadingCont, 'slideOutUp', () => {
            loadingCont.style.display = 'None';
            splashMain.style.display = 'flex';
            splashMain.style.backdropFilter = 'blur(10px)';
            animateCSS(splashMain, 'fadeIn');
        })
    }

    function deleteCookies() {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        document.cookie = "";
    }

    function getCook(cookiename) {
        var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
    }


    function handleLogin() {
        const btn = document.querySelector('#login-btn');
        const username = document.querySelector('#username');
        const password = document.querySelector('#password');
        const spinner = document.querySelector('.login-spinner');
        const error = document.querySelector('#error-login');
        var flag1 = false,
            flag2 = false;

        function checkDisabled() {

            if (username.value.length !== 0 && password.value.length !== 0) {
                btn.disabled = false;
            }
        }

        async function handleSubmit() {


            spinner.style.display = 'block';

            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'username': username.value,
                    'password': password.value,
                })
            })
            if (res.ok) {
                spinner.style.display = 'none';
                const json_main = await res.json();
                if (json_main.message === "UserNotFound") {
                    error.innerText = "Username or password is incorrect";
                } else {
                    let token = json_main[1][1].jwtToken;
                    document.cookie = `token=${token}`;
                    window.location = '/dashBoard';
                }
            }


        }
        username.addEventListener('keyup', () => {
            if (username.value.length !== 0)
                flag1 = true;
            checkDisabled();
        });
        password.addEventListener('keyup', () => {
            if (password.value.length !== 0)
                flag2 = true;
            checkDisabled();

        });

        btn.disabled = true;
        btn.addEventListener('click', handleSubmit.bind(null));



    }
}