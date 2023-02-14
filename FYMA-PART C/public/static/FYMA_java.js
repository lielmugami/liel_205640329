const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

/*-------------------------navigation------------------------------*/
const ActivePage = window.location.pathname;
console.log(ActivePage);

const activeNav = document.querySelectorAll('nav a').forEach(
    MyLinks => {
        if (MyLinks.href.includes(`${ActivePage}`)) {
            MyLinks.classList.add('Active');
        }
    }
)

setTimeout(() => {
    if (params?.message) {
        alert(params.message);
    }
}, 0);

/*--------------------function for funding the GEO LOCATION of the User--------------*/

function onSubmit(data) {
    debugger;
    console.log(data);
}
    function useMyLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    document.getElementById('lat').value = position.coords.latitude;
                    document.getElementById('lon').value = position.coords.longitude;
                    console.log('dmivin: ', position.coords);
                },
                function (error) {
                    console.log('dmivin: error', error);
                },
            );
        }
    }

/*--------------function for USE MY LOCATION VS ENTER CITY--------------------*/

function cityOrGeoLocation() {
    if (document.getElementById("checkbox-id").checked) {
      document.getElementById("city").disabled = true;
    }
    if (!document.getElementById("checkbox-id").checked) {
        document.getElementById("city").disabled = false;
    }
}

/*--------------------function for Password validation------------------*/

var inputPassword = document.getElementById("password");
inputPassword.onkeyup = checkPassword

var requirementsBox = document.getElementById("requirements")
requirementsBox.onfocus = () => {
    requirementsBox.style.display = "block"
}

requirementsBox.onblur = () => {
    requirementsBox.style.display = "none"
}

function checkPassword() {

    let validitatePassword = (input, pattern) => {
        if (inputPassword.value.match(pattern)) {
            input.classList.add("valid");
            input.classList.remove("invalid");
        } else {
            input.classList.add("invalid");
            input.classList.remove("valid");
        }
    }

    var lowercase = document.getElementById("letter");
    var uppercase = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");

    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var lengthEight = /.{8,}/g

    validitatePassword(lowercase, lowerCaseLetters)
    validitatePassword(uppercase, upperCaseLetters)
    validitatePassword(number, numbers)
    validitatePassword(length, lengthEight)
}


/*-----------------------------function for slide moving photo------------------*/

function showMySlides() {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace("active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += "active";
        setTimeout(showSlides, 4000); // Change image every 2 seconds
    }
}
