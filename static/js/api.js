export const FRONT_BASE_URL = "http://127.0.0.1:5500"
export const BACK_BASE_URL = "http://127.0.0.1:8000"

// 로그인
export async function handleLogin() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const response = await fetch(`${BACK_BASE_URL}/api/users/login/`, {
		headers: {
			"content-type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password
		})
	});
	return response;
}

// 상품 정보 전체 불러오기
// # 상품 전체 조회
export async function getProductListAPIView(product_id) {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/products/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
	}

// 상품별 상세 정보 가져오기
// # 상품 상세 조회
export async function getProductDetailAPIView(product_id) {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
}

// 전체 주문 목록 불러오기
// # 전체 주문 목록 조회
export async function getAllOrderListView() {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
}

// 상품별 주문 목록 불러오기
// # 주문 목록 조회
export async function getOrderListView(product_id) {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/${product_id}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
}

// 찜 등록 유저 불러오기
// # 상품 찜  등록 및 취소, 찜 등록한 유저의 간략한 정보 불러오기
export async function getWishListAPIView(product_id) {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/users/wish/${product_id}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
}

// 특정 상품의 전체 리뷰 불러오기
// # 리뷰 조회, 생성
export async function getReviewView(product_id) {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/reviews/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
}

// 주문상태 이름 조회
// # 주문 상태 조회
export async function getStatusView(status_id) {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/${status_id}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
}
