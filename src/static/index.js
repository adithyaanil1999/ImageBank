window.onload = () => {
    //global namespace

    const loadingCont = document.querySelector('.loading-cont');
    const splashMain = document.querySelector('.login-cont');


    {

        const splashBgUrl = "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=3310&q=80";
        getSplashScreenBackground(splashBgUrl);
        handleLogin();
    }

    function getSplashScreenBackground(url) {
        var img = new Image();
        img.src = url;
        img.onload = () => {
            console.log('loaded');
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

    function handleLogin() {
        const btn = document.querySelector('#login-btn');
        const username = document.querySelector('#username');
        const password = document.querySelector('#password');
        var flag1 = false,
            flag2 = false;

        function checkDisabled() {

            if (username.value.length !== 0 && password.value.length !== 0) {
                btn.disabled = false;
            }
        }

        function handleSubmit() {
            console.log(username.value);
            console.log(password.value);
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