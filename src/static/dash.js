window.onload = () => {
    var updatedLang = "";

    {
        verifylogin();
        handleLang();
        inactivity_handler();
        navhandler(parseJwt(getCook('token')));
        handleSelected(document.querySelector('#default-select'));
        accManNavHander();
        handleUpdatePass();

    }

    function navhandler(name) {
        document.querySelector('#logo-username').innerHTML = capitalizeFirstLetter(name.sub);
        document.querySelector('.logout-btn-i-wrap').addEventListener('click', handleLogout.bind(null));
        document.querySelector('.logout-btn-i-wrap').addEventListener('mouseover', addFocusNavItem.bind(null, document.querySelector('.logout-btn-i-wrap')));
        document.querySelector('.logout-btn-i-wrap').addEventListener('mouseout', removeFocusNavItem.bind(null, document.querySelector('.logout-btn-i-wrap')));

        var navElements = document.querySelector('.nav-main-wrap').querySelectorAll('.navitem-cont');
        for (var i of navElements) {
            i.addEventListener('mouseover', addFocusNavItem.bind(null, i));
            i.addEventListener('mouseout', removeFocusNavItem.bind(null, i));
            i.addEventListener('click', handleSelected.bind(null, i));
        }
    }

    function handleSelected(node) {
        var navElements = document.querySelector('.nav-main-wrap').querySelectorAll('.navitem-cont');
        for (var i of navElements) {
            if (i == node) {
                continue;
            } else {
                let hightLighterBefore = i.querySelector('.hightlight-container');
                let hightLighterAfter = i.querySelector('.selected-container');
                hightLighterAfter.style.display = 'none';
                hightLighterBefore.style.display = 'flex';
                i.classList.remove('selected-nav-item');
            }
        }
        const hightLighterBefore = node.querySelector('.hightlight-container');
        const hightLighterAfter = node.querySelector('.selected-container');
        hightLighterBefore.style.display = 'none';
        hightLighterAfter.style.display = 'block';
        node.classList.add('selected-nav-item');

        //handle opening containers

        function closeAll() {
            var dashElements = document.querySelectorAll('.dash-items');
            for (var i of dashElements) {
                i.style.display = 'none';
            }
        }

        var contName = node.querySelector('.nav-item-i-wrap').querySelector('.nav-header');
        contName = contName.id;
        if (contName === 'gallery-header') {
            closeAll();
            document.querySelector('.photos-cont').style.display = 'grid';
        } else if (contName === 'upload-header') {
            closeAll();
            document.querySelector('.upload-cont').style.display = 'grid';
        } else if (contName === 'settings-header') {
            closeAll();
            document.querySelector('.acc-man-cont').style.display = 'grid';
        } else if (contName === 'loging-act-header') {
            closeAll();
            document.querySelector('.login-act-cont').style.display = 'grid';
        } else if (contName === 'upload-act-header') {
            closeAll();
            document.querySelector('.upload-hist-cont').style.display = 'grid';
        }
    }

    function accManNavHander() {
        var navElements = document.querySelector('.acc-man-flex-wrap').querySelectorAll('.acc-man-option-wrap');
        for (var i of navElements) {
            i.addEventListener('click', handleSelectedAccMan.bind(null, i));
        }
    }

    function handleSelectedAccMan(node) {
        clearChangeFields();
        var accElements = document.querySelector('.acc-man-flex-wrap').querySelectorAll('.acc-man-option-wrap');
        for (var i of accElements) {
            if (i == node) {
                continue;
            } else {
                i.classList.remove('selected-option');
            }
        }
        node.classList.add('selected-option');

        function closeAll() {
            var dashElements = document.querySelectorAll('.acc-man-items');
            for (var i of dashElements) {
                i.style.display = 'none';
            }
        }

        var contName = node.querySelector('.acc-man-options-header');
        contName = contName.id;
        if (contName === 'changepass-header') {
            closeAll();
            document.querySelector('.change-pass-cont').style.display = 'flex';
        } else if (contName === 'lang-header') {
            closeAll();
            document.querySelector('.change-lang-cont').style.display = 'flex';
        } else if (contName === 'delete-header') {
            closeAll();
            document.querySelector('.delete-acc-cont').style.display = 'flex';
        }
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function addFocusNavItem(element) {
        const hightLighter = element.querySelector('.hightlight-container');
        hightLighter.style.opacity = '1';
        element.classList.add('focus-nav-item');
    }


    function removeFocusNavItem(element) {
        const hightLighter = element.querySelector('.hightlight-container');
        hightLighter.style.opacity = '0';
        element.classList.remove('focus-nav-item');
    }

    function inactivity_handler() {

        window.onload = count();

        function count() {
            document.onmousemove = resetTimer;
            document.onkeypress = resetTimer;
            var inactiveTime = 0;
            var totalToken = 0;
            var tokenLifespan = 2 * 60;
            var inactivityThreshold = 60 * 15;

            setInterval(() => {
                totalToken++;
                if (totalToken === (tokenLifespan)) {
                    updateToken();
                    resetTokenTimer();
                }
            }, 1000 * 1);

            setInterval(() => {
                inactiveTime++;
                if (inactiveTime === inactivityThreshold) {
                    handleLogout();
                }
            }, 1000 * 1);

            function resetTimer() {
                inactiveTime = 0;
            }

            function resetTokenTimer() {
                totalToken = 0;
            }

        }

    }

    async function handleLang() {

        let token = getCook('token');
        verifylogin();
        const res = await fetch('/getLang', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'token': token
            })
        })
        if (res.ok) {
            const json_main = await res.json();
            if (json_main.message === "Signature expired. Please log in again." || json_main.message === "Invalid token.") {
                alert('Logged Out due to invalid token');
                handleLogout();
            } else {
                document.cookie = `lang=${json_main.message}`;
                changeLang();
                updateLangElements();
            }
        }
    }

    function updateLangElements() {
        var langObj = {
            'en': {
                'gallery-header': 'My Photos',
                'upload-header': 'Upload',
                'settings-header': 'Account Management',
                'loging-act-header': 'Login Activity',
                'upload-act-header': 'Upload History',
                'logout-header': 'Logout',
                'header-acc-man': 'Account Management:',
                'changepass-header': 'Change Password',
                'lang-header': 'Language',
                'delete-header': 'Delete Account',
                'acc-update-pass-btn': 'Update',
                'lang-title': 'Language',
                'lang-submit-btn': 'Update'
            },
            'hi': {
                'gallery-header': 'मेरा फ़ोटो',
                'upload-header': 'अपलोड',
                'settings-header': 'अकाउंट प्रबंधन',
                'loging-act-header': 'लॉगिन गतिविधि',
                'upload-act-header': 'अपलोड इतिहास',
                'logout-header': 'लॉगआउट',
                'header-acc-man': 'अकाउंट प्रबंधन:',
                'changepass-header': 'पासवर्ड बदलें',
                'lang-header': 'भाषा',
                'delete-header': 'अकाउंट को मिटाएं',
                'acc-update-pass-btn': 'अपडेट',
                'lang-title': 'भाषा',
                'lang-submit-btn': 'अपडेट'
            }
        }

        var lang = getCook('lang');
        if (lang === 'hi') {
            document.querySelector('.dash-wrapper').style.fontFamily = `Poppins, sans-serif`;
            document.querySelector('#change-pass-old-pass').placeholder = 'पुराना पासवर्ड';
            document.querySelector('#change-pass-new-pass').placeholder = 'नया पासवर्ड';
            document.querySelector('#change-pass-new-pass-conf').placeholder = 'नए पासवर्ड की पुष्टि करें';

        } else if (lang === 'en') {
            document.querySelector('.dash-wrapper').style.fontFamily = `Sen, sans-serif`;
            document.querySelector('#change-pass-old-pass').placeholder = 'Old Password';
            document.querySelector('#change-pass-new-pass').placeholder = 'New Password';
            document.querySelector('#change-pass-new-pass-conf').placeholder = 'Confirm New Password';

        }
        var obj = langObj[lang];
        for (var i in obj) {
            document.querySelector(`#${i}`).innerHTML = obj[i];
        }
    }

    function changeLang() {
        //add select classto lang option screen
        var currLang = getCook('lang');
        var updateLangBtn = document.querySelector('#lang-submit-btn');
        updateLangBtn.disabled = true;
        var langElements = document.querySelectorAll('.lang-name');
        for (var i of langElements) {
            i.addEventListener('click', handleLangSelect.bind(null, i));
            i.classList.remove('selected-lang');
        }
        document.querySelector(`#lang-name-${currLang}`).classList.add('selected-lang');

        function handleLangSelect(element, updateLang) {
            for (var i of langElements) {
                i.classList.remove('selected-lang');
            }
            updatedLang = element.id.substring(10, 13);
            if (updatedLang !== currLang) {
                updateLangBtn.disabled = false;
            } else {
                updateLangBtn.disabled = true;
            }

            element.classList.add('selected-lang');
        }
        updateLangBtn.addEventListener('click', handleUpdateLang.bind(null));
    }

    async function handleUpdateLang() {
        let token = getCook('token');
        const res = await fetch('/updateLang', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'token': token,
                'lang': updatedLang
            })
        })
        if (res.ok) {
            const json_main = await res.json();
            if (json_main.message === "Signature expired. Please log in again." || json_main.message === "Invalid token.") {
                alert('Logged Out due to invalid token');
                handleLogout();
            } else {
                handleLang();
            }
        }
    }


    async function updateToken() {
        let token = getCook('token');
        const res = await fetch('/updateToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'token': token
            })
        })
        if (res.ok) {
            const json_main = await res.json();
            if (json_main.message === "Signature expired. Please log in again." || json_main.message === "Invalid token.") {
                alert('Logged Out due to invalid token');
                handleLogout();
            } else {
                let token = json_main[1][1].jwtToken;
                document.cookie = `token=${token}`;
            }
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

    async function verifylogin() {
        var checkToken = getCook('token');
        if (checkToken !== "") {
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
                    alert('Expired Token please relogin');
                    deleteCookies();
                    window.location = '/';
                }
            }
        } else {
            alert("Please login in first");
            window.location = '/';
        }
        updateToken();
        return true;
    }

    function deleteCookies() {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        document.cookie = "";
    }

    function getCook(cookiename) {
        var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
    }

    async function handleLogout() {
        var token = getCook('token');
        const res = await fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'token': token
            })
        })
        if (res.ok) {
            const json_main = await res.json();
            console.log(json_main.message);
            if (json_main.message === "LoggedOut") {
                deleteCookies();
                window.location = '/';
            }
        }
    }

    function handleUpdatePass() {

        const updateBtn = document.querySelector('#acc-update-pass-btn');
        const oldPass = document.querySelector('#change-pass-old-pass');
        const error = document.querySelector('#update-pass-error');

        updateBtn.disabled = true;
        let flag_pass = false;

        oldPass.addEventListener('change', async() => {
            let token = getCook('token');
            const res = await fetch('/verifyOldPass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'token': token,
                    'password': oldPass.value
                })
            })
            if (res.ok) {
                const json_main = await res.json();
                if (json_main.message !== 'PassMatch') {
                    flag_pass = false;
                    verifyPass();

                } else {
                    flag_pass = true;
                    verifyPass();

                }
            }
        });
        const newPass1 = document.querySelector('#change-pass-new-pass');
        const newPass2 = document.querySelector('#change-pass-new-pass-conf');

        newPass1.addEventListener('keyup', verifyPass.bind(null));
        newPass2.addEventListener('keyup', verifyPass.bind(null));

        function verifyPass() {
            if (!flag_pass) {
                error.innerHTML = 'Incorrect Password';
                updateBtn.disabled = true;
            } else if (newPass1.value !== newPass2.value) {
                error.innerHTML = 'Passwords do not match';
                updateBtn.disabled = true;
            } else if (newPass1.value === '' || newPass2.value === '') {
                error.innerHTML = 'Password fields are empty';
                updateBtn.disabled = true;
            } else {
                error.innerHTML = '';
                if (flag_pass)
                    updateBtn.disabled = false;
            }
        }

        updateBtn.addEventListener('click', async() => {
            var pass = newPass1.value;
            var token = getCook('token');
            var inps = document.querySelectorAll('.change-pass-inp');
            for (var i of inps) {
                i.value = '';
            }

            const res = await fetch('/updatePass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'token': token,
                    'password': pass
                })
            })
            if (res.ok) {
                const json_main = await res.json();
                if (json_main.message === "Changed") {
                    error.innerHTML = 'Password Updated';
                } else {
                    error.innerHTML = json_main.message;
                }
            }
            verifylogin();
        })
    }

    function clearChangeFields() {
        var inps = document.querySelectorAll('.change-pass-inp');
        for (var i of inps) {
            i.value = '';
        }
        const error = document.querySelector('#update-pass-error');
        error.innerHTML = '';
    }


}