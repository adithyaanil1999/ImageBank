window.onload = () => {
    //global namespace

    const loadingCont = document.querySelector('.loading-cont');
    const splashMain = document.querySelector('.login-cont');
    const signUpBtn = document.querySelector('#signup-button');
    const forgotBtn = document.querySelector('#forgot-button');
    const loginBox = document.querySelector('.login-form-wrap');
    const signupBox = document.querySelector('.signup-form-wrap');
    const forgotBox1 = document.querySelector('.forgot-form-wrap');
    const newPasswordBox = document.querySelector('.new_password-form-wrap');
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
    const confirmEmailBtn = document.querySelector('#forgot-email-btn-conf');
    const confBtn = document.querySelector('#new_password-btn-conf');




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
        regBtn.addEventListener('click', handleSignUp.bind(null));
        confirmEmailBtn.addEventListener('click', setNewPassword.bind(null));
        confBtn.addEventListener('click', updatePass.bind(null));

    }

    async function init() {
        var flag = await verify_login();
        var w = window.screen.width * window.devicePixelRatio;
        var h = window.screen.height * window.devicePixelRatio
        if (flag) {
            const splashBgUrl = `https://source.unsplash.com/${h}x${w}/?nature,asthetic,city`;
            getSplashScreenBackground(splashBgUrl);
            // exitLoadingAnimationHandle();
            handleLogin();
        }

    }

    async function verify_login() {
        var checkToken = getCook('token');
        if (checkToken != "") {
            let token = getCook('token');
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
                    deleteCookies();
                } else {
                    window.location = '/dashBoard';
                }

            }
        }
        return true;
    }

    async function updatePass() {
        const password = document.querySelector('#new_password_conf').value;
        const username = getCook('username')
        const res = await fetch('/updatePass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })
        if (res.ok) {
            const json_main = await res.json();
            if (json_main.message === "Changed") {
                location.reload();
            }
        }
    }

    async function setNewPassword() {
        const code = document.querySelector('#code').value;
        var username = getCook('username');
        const res = await fetch('/verifyCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'username': username,
                'code': code
            })
        })
        if (res.ok) {
            const json_main = await res.json();
            if (json_main.message === "verified") {
                animateCSS(emailBox, 'slideOutLeft faster', () => {
                    emailBox.style.display = 'none';
                    newPasswordBox.style.display = 'flex';
                    animateCSS(newPasswordBox, 'slideInRight faster');

                });
                confBtn.disabled = true;
                const password1 = document.querySelector('#new_password');
                const password2 = document.querySelector('#new_password_conf');
                const error = document.querySelector('#error-new_password-forgot-email');
                document.querySelector('#back-forgot-3').addEventListener('click', handleBackToLogin.bind(null, 'newpass'));
                password1.addEventListener('keyup', verifyPasswords.bind(null));
                password2.addEventListener('keyup', verifyPasswords.bind(null));

                function verifyPasswords() {
                    if (password1.value === undefined || password1.value === "" ||
                        password2.value === undefined || password2.value === "") {
                        error.innerText = "Fields cannot be empty";
                        confBtn.disabled = true;

                    } else if (password1.value !== password2.value) {
                        error.innerText = "Passwords Do not match";
                        confBtn.disabled = true;
                    } else {
                        error.innerText = "";
                        confBtn.disabled = false;
                    }

                }
            } else {
                const error = document.querySelector('#error-forgot-email');
                error.innerText = "Incorrect Code";
            }

        }


    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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
        } else if (!validateEmail(signUpEmail.value)) {
            error.innerText = "Enter a valid email";
            regBtn.disabled = true;
        } else if (signUpPassword.value !== signUpPasswordConfirm.value) {
            error.innerText = "Passwords do not match";
            regBtn.disabled = true;
        } else {
            regBtn.disabled = false;
            error.innerText = "";
        }

    }

    async function handleSignUp() {
        let error = document.querySelector('#error-signUp');
        var username = signUpUsername.value;
        var email = signUpEmail.value;
        var password = signUpPasswordConfirm.value;
        document.querySelector('.signUp-spinner').style.display = 'flex';
        const res = await fetch('/reg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'username': username,
                'password': password,
                'email': email
            })
        })
        if (res.ok) {
            document.querySelector('.signUp-spinner').style.display = 'none';
            const json_main = await res.json();
            if (json_main.message === "registered") {
                location.reload();
            } else {
                error.innerText = "Username Is Taken";
            }
        }

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
        forgotEmailBtn.disabled = true;
        confirmEmailBtn.disabled = true;
        animateCSS(loginBox, 'slideOutLeft faster', () => {
            loginBox.style.display = 'none';
            forgotBox1.style.display = 'flex';
            animateCSS(forgotBox1, 'slideInRight faster');

        });

        async function verifyusername(e) {
            if (e == null) {
                const res = await fetch('/verifyUserExist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        'username': username.value
                    })
                });
                if (res.ok) {
                    document.querySelector('.email-spinner').style.display = 'flex';
                    const json_main = await res.json();
                    if (json_main.message === "NotFound") {
                        error.innerText = "User Not found";
                        forgotEmailBtn.disabled = true;
                        document.querySelector('.email-spinner').style.display = 'none';
                    } else {
                        error.innerText = "User Found";
                        document.cookie = `username=${json_main.message}`;
                        forgotEmailBtn.disabled = false;
                        document.querySelector('.email-spinner').style.display = 'none';
                    }
                }
            }
        }
        const username = document.querySelector('#username_forgot');
        const error = document.querySelector('#error-forgot');
        username.addEventListener('keyup', verifyusername.bind(null, null));
    }

    async function handleEmailAnimation() {
        forgotEmailBtn.disabled = true;
        var username = getCook('username');
        document.querySelector('.email-spinner').style.display = 'block';
        const res = await fetch('/sendCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'username': username
            })
        })
        if (res.ok) {
            document.querySelector('.email-spinner').style.display = 'none';
            const json_main = await res.json();
            if (json_main.message === "Sent") {
                animateCSS(forgotBox1, 'slideOutLeft faster', () => {
                    forgotBox1.style.display = 'none';
                    emailBox.style.display = 'flex';
                    animateCSS(emailBox, 'slideInRight faster');
                });
                confirmEmailBtn.disabled = true;
                const code = document.querySelector('#code');
                const error = document.querySelector('#error-forgot');
                code.addEventListener('keyup', () => {
                    if (code.value.length != 4) {
                        error.innerHTML = "Incorrect Format";
                        confirmEmailBtn.disabled = true;
                    } else {
                        error.innerHTML = "";
                        confirmEmailBtn.disabled = false;
                    }
                })
            }
        }
    }

    function handleBackToLogin(currentPage) {
        var inputs = document.querySelectorAll('input');
        var error = document.querySelectorAll('.error-messages');
        for (var i of inputs) {
            i.value = "";
        }
        for (var i of error) {
            i.innerText = "";
        }
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
        } else if (currentPage === 'newpass') {
            animateCSS(newPasswordBox, 'slideOutLeft faster', () => {
                newPasswordBox.style.display = 'none';
                loginBox.style.display = 'flex';
                animateCSS(loginBox, 'slideInLeft faster');
            });
        }

    }

    function getSplashScreenBackground(url) {
        document.querySelector('.splash_screen-cont').style.background = `url(${url})`;
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