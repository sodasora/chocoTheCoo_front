import { BACK_BASE_URL, FRONT_BASE_URL, getProductslist, viewProductslist, getCategoryView, getProductListAPIView } from './api.js'

export async function categoryview() {
    const categories = await getCategoryView();

    const categorySelect = document.getElementById(`category-select`);

    categories.forEach(category => {
        const option = document.createElement('a');
        option.innerText = `\n` + category.name;
        categorySelect.appendChild(option);
    });
}

window.onload = async function () {
    const product = await getProductListAPIView();
    console.log(product)
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