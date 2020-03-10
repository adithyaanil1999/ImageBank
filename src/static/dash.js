window.onload = () => {
    var selectedNavItem = null;

    {
        // logoutbtn.addEventListener('click', handleLogout.bind(null));
        verifylogin();
        inactivity_handler();
        navhandler(parseJwt(getCook('token')));
        handleSelected(document.querySelector('#default-select'));

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
            var tokenLifespan = 60 * 5;
            var inactivityThreshold = 60 * 15;

            setInterval(async() => {
                totalToken++;
                if (totalToken >= (tokenLifespan - 2)) {
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
                            resetTokenTimer();
                        }
                    }

                }
            }, 1000 * 1);
            setInterval(() => {
                inactiveTime++;
                if (inactiveTime === inactivityThreshold) {
                    alert('Logged Out due to inactivity');
                    deleteCookies();
                    window.location = '/';
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
}