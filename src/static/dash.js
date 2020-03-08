window.onload = () => {
    const logoutbtn = document.querySelector('#logout');


    {
        logoutbtn.addEventListener('click', handleLogout.bind(null));
        verifylogin();
        inactivity_handler();
    }

    function inactivity_handler() {

        window.onload = count();

        function count() {
            document.onmousemove = resetTimer;
            document.onkeypress = resetTimer;
            var inactiveTime = 0;
            var totalToken = 0;
            var tokenLifespan = 60 * 15;
            var inactivityThreshold = 60 * 15;

            setInterval(async() => {
                totalToken++;
                if (totalToken === (tokenLifespan - 60)) {
                    let token = getCook('token');
                    console.log(token)
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
                            deleteCookies();
                            window.location = '/';
                        } else {
                            let token = json_main[1][1].jwtToken;
                            console.log(token);
                            document.cookie = `token=${token}`;
                            resetTokenTimer();
                        }
                    }

                }
            }, 1000 * 1);
            setInterval(() => {
                inactiveTime++;
                if (inactiveTime === inactivityThreshold) {
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

    async function verifylogin() {
        console.log('verifying token');
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
        console.log('check')
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
                console.log('here');
                deleteCookies();
                window.location = '/';
            }
        }
    }
}