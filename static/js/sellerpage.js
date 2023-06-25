import { getProductslist, viewProductslist, getSellerProductListAPIView, BACK_BASE_URL, FRONT_BASE_URL, getSellerPermissionAPIView } from './api.js';

export async function productDetail(product_id) {
  window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`
}

//등록한 상품들 전체 보기
export async function sellerPageAPI() {
  try {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const user_id = payload_parse.user_id //로그인한 유저id
    const product = await getSellerProductListAPIView(user_id);
    // console.log(product)

    if (product.count != 0) {
      if ((product.next == null) & (product.previous == null)) {
        viewProductslist(product);
      } else {
        getProductslist(product);
      }
    } else {
      const container = document.querySelector(".container")
      const content = document.createElement("div")
      content.setAttribute("style", "font-family: 'S-CoreDream-3Light';font-size: 2vw; font-weight:bold; color:white;")
      content.innerText = "등록한 상품이 없습니다."
      container.appendChild(content)
    }
  } catch (error) {
    console.error(error)
  }
}

window.onload = async function () {
  sellerPageAPI()
}
