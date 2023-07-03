import { getProductslist, viewProductslist, getSellerProductListAPIView, BACK_BASE_URL, FRONT_BASE_URL, getSellerPermissionAPIView, payload } from './api.js';

export async function productDetail(product_id) {
  window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`
}

//등록한 상품들 전체 보기
export async function sellerPageAPI() {
  try {
    // 판매자 스토어 페이지 판별
    const getParams = window.location.search;
    const userParams = getParams.split("=")[1];
    let user_id = userParams
    if (!user_id){ // 판매자가 자신의 스토어를 조회할 때
      user_id = payload.user_id // 로그인한 유저id
    }
    const product = await getSellerProductListAPIView(user_id);
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
  // if (payload == null) {
  //   alert("로그인이 필요 합니다.")
  //   window.location.replace(`${FRONT_BASE_URL}/login.html`)
  // } else if (payload.is_seller == false) {
  //   alert("판매 활동 권한이 필요합니다.")
  //   console.log(payload.is_seller)
  //   window.location.replace(`${FRONT_BASE_URL}/user_detail_page.html`)
  // }
  sellerPageAPI()
}
