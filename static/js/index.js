import { BACK_BASE_URL, FRONT_BASE_URL, sameCategoryProductView, getProductslist, viewProductslist, getCategoryView, getProductListAPIView } from './api.js'

export async function categoryview() {
    const categories = await getCategoryView();
    const categorySelect = document.getElementById("categorymenu");
   
    categories.forEach( category => {
        categorySelect.innerHTML += `<a id=${category.id} href='searchproduct.html?category_id=${category.id}'>\n${category.name}</a>`;
    });
}
window.onload = async function () {
    categoryview()
    const product = await getProductListAPIView();
    const choco = document.getElementById("chocobanner")
    choco.addEventListener("click", function () {
        window.location.href = "subscriptioninfo.html";
    })

    if ((product.next == null) & (product.previous == null)) {
        viewProductslist(product);
    } else {
        getProductslist(product);
    }


}