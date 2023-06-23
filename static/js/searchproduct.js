import { BACK_BASE_URL, FRONT_BASE_URL, sameCategoryProductView, getCategoryView, getProductListAPIView } from './api.js'
import { categoryview } from './index.js';

export async function showSameCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');
    console.log(categoryId);
    const response = await sameCategoryProductView(categoryId);

    const products = response.results;

    const product_list = document.getElementById("product-list");

    products.forEach((product) => {
        const newCol = document.createElement("div");
        newCol.setAttribute("class", "col");
        
        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
        newCard.setAttribute("id", product.id);
        
        newCard.onclick = function() {
          productDetail(product.id);
        };
  
        const img = document.createElement("img");
        img.setAttribute("class", "card-img-top");
  
        if(product.image){
            img.setAttribute(
                "src",
                `${product.image}`
              );
        }else{
            img.setAttribute("src",'/static/images/기본이미지.gif')
        }
        
        newCard.appendChild(img);
        product_list.appendChild(newCol);
  
        const newCardBody = document.createElement("div");
        newCardBody.setAttribute("class", "card-body");
        newCard.appendChild(newCardBody);
  
        const newCardTitle = document.createElement("h5");
        newCardTitle.setAttribute("class", "card-title");
        newCardTitle.innerText = product.name;
        newCardBody.appendChild(newCardTitle);
  
        const newCardText = document.createElement("p");
        newCardText.setAttribute("class", "card-text");
        newCardText.innerText ="상품가격 : "+ product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
        newCard.appendChild(newCardText)
        
        const newCardFooter = document.createElement("p");
        newCardFooter.setAttribute("class", "card-footer");
        newCardFooter.innerText = "상품수량 : "+ product.amount + "개";
        newCard.appendChild(newCardFooter)
        newCol.appendChild(newCard);
      });
    


}


window.onload = async function () {
    categoryview()
    showSameCategory()
}