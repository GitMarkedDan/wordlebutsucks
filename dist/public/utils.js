function setCookie(name, value, mins) {
    var expires;
    if (mins) {
        var date = new Date();
        date.setTime(date.getTime() + (mins * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function clearCookie(name) {
    setCookie(name, "", -10);
}
function update(r, l, data) {
    findLetter(r, l).parentElement.style.backgroundColor = data == 2 ? "green" : data == 1 ? "yellow" : "darkgrey";
}
function anim(object, cless, duration) {
    console.log(object, cless, duration);
    object.classList.add(cless);
    setTimeout(() => {
        object.classList.remove(cless);
    }, duration);
}
let toastElement;
window.onload = function () {
    toastElement = document.getElementById("toast");
};
function toast(info, ms) {
    anim(toastElement, "toast-anim", ms);
    toastElement.getElementsByTagName("p")[0].innerHTML = info;
}
