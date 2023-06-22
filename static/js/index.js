import { BACK_BASE_URL, FRONT_BASE_URL, getProductslist, getProductListAPIView } from './api.js'

window.onload = async function () {
    const product = await getProductListAPIView();

    const choco = document.getElementById("chocobanner")
    choco.addEventListener("click", function () {
        window.location.href = "subscriptioninfo.html";
    })

    getProductslist(product);
}