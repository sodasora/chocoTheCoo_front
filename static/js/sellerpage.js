import { getProductListAPIView, getProductslist, viewProductslist, getSellerProductListAPIView, BACK_BASE_URL, FRONT_BASE_URL, getSellerPermissionAPIView } from './api.js';

export async function productDetail(product_id) {
  window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`
}

//등록한 상품들 전체 보기
export async function sellerPageAPI() {

  try {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const user_id = payload_parse.user_id //로그인한 유저id
    console.log(user_id)
    const products = await getSellerProductListAPIView(user_id);
    console.log(products);

    if ((products.next == null) & (products.previous == null)) {
      viewProductslist(products);
    } else {
      getProductslist(products);
    }


  } catch (error) {
    console.error(error)
  }
}

window.onload = async function () {
  sellerPageAPI()
}
