function switchContent() {
    const contentElement = document.getElementById("content");
    const windowWidth = window.innerWidth;

    if (windowWidth <= 768) { // 모바일 화면일 때
        fetch("mobile-index.html")
            .then((response) => response.text())
            .then((html) => (contentElement.innerHTML = html));
    } else { // 데스크탑 화면일 때
        fetch("desktop-index.html")
            .then((response) => response.text())
            .then((html) => (contentElement.innerHTML = html));
    }
}


window.addEventListener("load", switchContent);
window.addEventListener("resize", switchContent);
