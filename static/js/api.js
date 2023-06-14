export const FRONT_BASE_URL = "http://127.0.0.1:5500"
export const BACK_BASE_URL = "http://127.0.0.1:8000"

// 로그인
export async function handleLoginAPI() {
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

// 날짜에 대한 포인트 기록내역
export async function getPointView(day) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/points/${day}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'GET',
	})
	return response_point
}

// 날짜에 대한 포인트 통계
export async function getPointStaticView(day) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/points/${day}/statistic/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'GET',
	})
	return response_point
}

// 출석포인트
export async function getPointAttendanceView(day) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/attendance/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'GET',
	})
	return response_point
}

export async function postPointAttendanceView() {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/attendance/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'POST',
	})
	return response_point
}

//텍스트리뷰 포인트
export async function postTextPointView() {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/text/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'POST',
	})
	return response_point;
}

//포토리뷰 포인트
export async function postPhotoPointView() {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/photo/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'POST',
	})
	return response_point;
}

// 프로필 정보 가져오기
export async function getUserProfileAPIView() {
	const payload = localStorage.getItem("payload");
	const payload_parse = JSON.parse(payload)
	const user_id = payload_parse.user_id
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'GET',
	})
	return response_data.json();
}

// 구독 정보 가져오기
export async function getSubscribeView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/subscribe/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'GET',
	})
	if (response_data.status == 200) {
		return response_data.json();
	} else {
		return [];
	}
}

// 구독 정보 해지(재등록)
export async function patchSubscribeView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/subscribe/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'PATCH',
	})
	return response_data;
}

// 첫 구독하기
export async function postSubscribeView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/subscribe/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'POST',
	})
	return response_data.status;
}

export async function getVerificationCodeAPI(email) {
	// 인증 코드 발급 받기
	const response = await fetch(`${BACK_BASE_URL}/api/users/get/auth_code/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'PUT',
		body: JSON.stringify({
			"email": email,
		})
	})
	return response
}

export async function setUserInformationAPI() {
	// 비밀번호 수정 및 비활성 계정 활성화
	const email = document.getElementById("email").value
	const verificationCode = document.getElementById("verificationCode").value
	const password = document.getElementById("password").value
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'PATCH',
		body: JSON.stringify({
			"email": email,
			"auth_code": verificationCode,
			"password": password
		})
	})
	return response
}

export async function handleSignupAPI(email, nickname, password) {
	// 회원 가입
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			"email": email,
			"nickname": nickname,
			"password": password
		})
	})
	return response

}


export async function VerificationCodeSubmitAPI(email, verificationCode) {
	// 회원 가입시 이메일 인증
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'PUT',
		body: JSON.stringify({
			"email": email,
			"auth_code": verificationCode,
		})
	})
	return response
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

// 판매자 정보 조회
export async function getSellerPermissionAPIView(user_id){
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/permissions/${user_id}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET",
	});
	return response.json();
}
