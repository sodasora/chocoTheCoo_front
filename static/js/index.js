import { BACK_BASE_URL, FRONT_BASE_URL, searchProductAPI, sameCategoryProductView, getProductslist, viewProductslist, getCategoryView, getProductListAPIView } from './api.js'

export async function goEditReview(keyword) {
    window.location.href = `${FRONT_BASE_URL}/index.html?search=${keyword}`;
}

export async function categoryview() {
    const categories = await getCategoryView();
    const categorySelect = document.getElementById("categorymenu");
   
    categories.forEach( category => {
        categorySelect.innerHTML += `<a id=${category.id} href='index.html?category_id=${category.id}'>\n${category.name}</a>`;
    });
}

export async function keywordSeachView() {
    const answer = document.getElementById("search-keyword");
    const keyword = answer.value;
    goEditReview(keyword)
}

export async function showSameCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');
    console.log(categoryId);
    const response = await sameCategoryProductView(categoryId);

    const product = response.results;
    if ((product.next == null) & (product.previous == null)) {
      viewProductslist(response)
  } else {
      getProductslist(response)
  }

}

export async function showSearchKeywordProduct(){
  const urlParams = new URLSearchParams(window.location.search);
  const keyword = urlParams.get('search');
  const products = await searchProductAPI(keyword);
  const product = products.results;

  console.log(product)
  if ((product.next == null) & (product.previous == null)) {
    viewProductslist(products)
} else {
    getProductslist(products)
}


}


export async function setEventListener() {
    document.getElementById("search-btn").addEventListener("click", keywordSeachView)
}
window.onload = async function () {
    categoryview()
    setEventListener()
    const product = await getProductListAPIView();
    const choco = document.getElementById("chocobanner")
    choco.addEventListener("click", function () {
        window.location.href = "subscriptioninfo.html";
    })

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');
    const search = urlParams.get('search');
    if(categoryId){
        showSameCategory()
    }else if(search){
        showSearchKeywordProduct()
    }else if((product.next == null) & (product.previous == null)){
        viewProductslist(product);
    } else {
        getProductslist(product);
    }
    

    // if ((product.next == null) & (product.previous == null)) {
    //     viewProductslist(product);
    // } else {
    //     getProductslist(product);
    // }
    


}