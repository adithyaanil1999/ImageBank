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
        handleDelete();
        handleFileUpload();
        handileFileDragNDrop();

        let langElements = document.querySelectorAll('.lang-name');
        for (var i of langElements) {
            i.addEventListener('click', handleLangSelect.bind(null, i));
        }

        let updateLangBtn = document.querySelector('#lang-submit-btn');
        updateLangBtn.addEventListener('click', handleUpdateLang.bind(null));

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
            handleGallery();
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
                'lang-submit-btn': 'Update',
                'delete-acc-title': 'Delete this account!',
                'acc-delete-btn': 'Delete',
                'file-box-text': 'Drag and drop files here or',
                'upload-click-me': 'click here',
                'upload-title': 'Upload image:',
                'photo-title': 'My Photo Gallery'

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
                'lang-submit-btn': 'अपडेट',
                'delete-acc-title': 'इस अकाउंट को हटा दें',
                'acc-delete-btn': 'मिटाएं',
                'file-box-text': 'फ़ाइलों को यहां खींचें या छोड़ें या',
                'upload-click-me': 'यहाँ क्लिक करें',
                'upload-title': 'फोटो अपलोड करें:',
                'photo-title': 'मेरी फोटो गैलरी'

            }
        }

        var lang = getCook('lang');
        if (lang === 'hi') {
            document.querySelector('.dash-wrapper').style.fontFamily = `Poppins, sans-serif`;
            document.querySelector('#change-pass-old-pass').placeholder = 'पुराना पासवर्ड';
            document.querySelector('#change-pass-new-pass').placeholder = 'नया पासवर्ड';
            document.querySelector('#change-pass-new-pass-conf').placeholder = 'नए पासवर्ड की पुष्टि करें';
            document.querySelector('#delete-password-inp').placeholder = 'अपना पासवर्ड डालें';

        } else if (lang === 'en') {
            document.querySelector('.dash-wrapper').style.fontFamily = `Sen, sans-serif`;
            document.querySelector('#change-pass-old-pass').placeholder = 'Old Password';
            document.querySelector('#change-pass-new-pass').placeholder = 'New Password';
            document.querySelector('#change-pass-new-pass-conf').placeholder = 'Confirm New Password';
            document.querySelector('#delete-password-inp').placeholder = 'Enter your password';

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
            i.classList.remove('selected-lang');
        }
        document.querySelector(`#lang-name-${currLang}`).classList.add('selected-lang');

    }

    function handleLangSelect(element) {
        var langElements = document.querySelectorAll('.lang-name');
        var updateLangBtn = document.querySelector('#lang-submit-btn');

        var currLang = getCook('lang');
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
                deleteCookies();
                window.location = '/';
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
                    window.location = '/'
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

        oldPass.addEventListener('keyup', async() => {
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
        var lang = getCook('lang');
        newPass1.addEventListener('keyup', verifyPass.bind(null));
        newPass2.addEventListener('keyup', verifyPass.bind(null));

        function verifyPass() {
            if (!flag_pass) {
                if (lang === 'en') {
                    error.innerHTML = 'Incorrect Password';
                } else if (lang === 'hi') {
                    error.innerHTML = 'गलत पासवर्ड ';
                }
                updateBtn.disabled = true;
            } else if (newPass1.value !== newPass2.value) {
                if (lang === 'en') {
                    error.innerHTML = 'Passwords do not match';

                } else if (lang === 'hi') {
                    error.innerHTML = 'पासवर्ड एक जैसे नहीं है';
                }
                updateBtn.disabled = true;
            } else if (newPass1.value === '' || newPass2.value === '') {
                if (lang === 'en') {
                    error.innerHTML = 'Password fields are empty';
                } else if (lang === 'hi') {
                    error.innerHTML = 'पासवर्ड खाली हैं';
                }
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
                    if (lang === 'en') {
                        error.innerHTML = 'Password Updated';
                    } else if (lang === 'hi') {
                        error.innerHTML = 'पासवर्ड अपडेट किया गया';
                    }
                } else {
                    error.innerHTML = json_main.message;
                }
            }
            verifylogin();
        })
    }

    function clearChangeFields() {
        const updateBtn = document.querySelector('#acc-update-pass-btn');
        updateBtn.disabled = true;
        var inps = document.querySelectorAll('.change-pass-inp');
        for (var i of inps) {
            i.value = '';
        }
        const error = document.querySelector('#update-pass-error');
        error.innerHTML = '';
    }

    function handleDelete() {
        var deleteBtn = document.querySelector('#acc-delete-btn');
        var error = document.querySelector('#error-delete-acc');
        var lang = getCook('lang');
        deleteBtn.disabled = true;
        document.querySelector('#delete-password-inp').addEventListener('keyup', checkPass.bind(null));
        deleteBtn.addEventListener('click', handleAccountDelete.bind(null));

        async function checkPass() {
            var pass = document.querySelector('#delete-password-inp').value;
            let token = getCook('token');
            const res = await fetch('/verifyOldPass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'token': token,
                    'password': pass
                })
            })
            if (res.ok) {
                const json_main = await res.json();
                if (json_main.message === 'PassMatch') {
                    deleteBtn.disabled = false
                    if (lang === 'en') {
                        error.innerHTML = "WARNING! DELETED ACCOUNT CANNOT BE RECOVERED";
                    } else if (lang === 'hi') {
                        error.innerHTML = "सावधान! हटाए गए खाते को रद्द नहीं किया जा सकता";
                    }

                } else {
                    if (lang === 'en') {
                        error.innerHTML = "Wrong Password";
                    } else if (lang === 'hi') {
                        error.innerHTML = "गलत पासवर्ड";
                    }
                    deleteBtn.disabled = true;
                }
            }

        }

        async function handleAccountDelete() {
            let token = getCook('token');
            const res = await fetch('/deleteAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'token': token
                })
            })
            if (res.ok) {
                const json_main = await res.json();
                if (json_main.message === 'AccountDeleted') {
                    deleteCookies();
                    window.location = '/';
                } else {
                    alert("ERROR IN DELETING")
                }
            }
        }

    }

    function handileFileDragNDrop() {
        const fileForm = document.querySelector('.file-border');
        // const fileBorder = document.querySelector('.file-border');
        fileForm.addEventListener('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fileForm.classList.add('file-hover');
            console.log('dragenter')
        });
        fileForm.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fileForm.classList.remove('file-hover');
            console.log('dragleave')

        });
        fileForm.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        fileForm.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var dt = e.dataTransfer;
            var filesList = dt.files;
            const inpFile = document.querySelector('#file');
            inpFile.files = filesList;
            handleFileUpload(true);

        });

    }

    function handleFileUpload(dragCheck) {
        verifylogin();
        const inpFile = document.querySelector('#file');
        var token = getCook('token');

        var files = [];

        inpFile.addEventListener('change', handleFile.bind(this));

        if (dragCheck === true) {
            console.log(inpFile.files);
            handleFile(inpFile);
        }

        function handleFile(inp) {
            files = [];
            for (var i of inpFile.files) {
                files.push(i);
            }
            handleFileSubmit();
        }

        async function handleFileSubmit() {
            const uploadScreen = document.querySelector('.uploading-loading-cont');
            const uploadText = document.querySelector('#uploading-desc');
            var lang = getCook('lang');
            uploadScreen.style.opacity = '0';
            uploadScreen.style.display = 'flex';



            animateCSS(uploadScreen, 'fadeIn', () => {
                uploadScreen.style.opacity = '1';
            });

            var uploadedFlag = new Array(files.length);

            for (var k = 0; k < files.length; k++) {
                uploadedFlag[k] = false;
            }

            var j = 0;
            countUploading(0);
            for (var i of files) {

                var fileName = i.name;
                var fileNameTemp = fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
                var fileExtenstion = fileName.substr(fileName.lastIndexOf('.')) || fileName;
                var fileName = fileNameTemp + '_' + parseJwt(getCook('token')).sub + fileExtenstion;


                const res = await fetch('/getSig', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        'token': token,
                        'fileName': fileName,
                        'fileType': i.type
                    })
                })
                if (res.ok) {
                    const json_main = await res.json();
                    if (json_main) {
                        uploadToS3(i, json_main.data, json_main.url, j);
                    }
                }

                j++;
            }

            function countUploading(j) {
                if (lang === 'en') {
                    uploadText.innerHTML = `Uploading ${j+1} of ${files.length}, please wait`;
                } else if (lang === 'hi') {
                    uploadText.innerHTML = `${file.length} में से ${j+1} अपलोड कर रहा है, कृपया प्रतीक्षा करें`;

                }
            }

            async function uploadToS3(file, s3Data, fileurl, j) {
                var postData = new FormData();
                for (key in s3Data.fields) {
                    postData.append(key, s3Data.fields[key]);
                }
                postData.append('file', file);
                const res = await fetch(s3Data.url, {
                    method: 'POST',
                    body: postData
                })
                if (res.ok) {
                    uploadedFlag[j] = true;
                    if (j + 1 <= file.length)
                        countUploading(j + 1);

                    handleUpdateFileDb(fileurl);
                    console.log('uploaded');
                }
            }

            async function handleUpdateFileDb(fileUrl) {
                let token = getCook('token');
                const res = await fetch('/updateFileDb', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        'token': token,
                        'url': fileUrl
                    })
                });
            }

            var intervalCheckFlag = setInterval(() => {
                for (var k = 0; k < files.length; k++) {
                    if (uploadedFlag[k] === false) {
                        break;
                    }
                    if (k === files.length - 1) {
                        animateCSS(uploadScreen, 'fadeOut', () => {
                            uploadScreen.style.display = 'none';
                            clearInterval(intervalCheckFlag);
                            const fileBorder = document.querySelector('.file-border');
                            fileBorder.classList.remove('file-hover');
                            files = [];
                        });
                    }
                }

            }, 500);

        }

    }

    async function handleGallery() {
        verifylogin();
        var token = getCook('token');
        const res = await fetch('/getUserImages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'token': token
            })
        })
        if (res.ok) {
            const json_main = await res.json();
            imgArray = json_main.message;
            const photoBox = document.querySelector('.photo-box');
            photoBox.innerHTML = '';
            imgArray.forEach(e => {
                console.log(e.img_link);
                photoBox.innerHTML += `
                <div class="photo-wrap">
                        <img src="${e.img_link}" alt="">
                </div>
                `;
            });
        }


    }
}