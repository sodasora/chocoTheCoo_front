export const FRONT_BASE_URL = "http://127.0.0.1:5501"
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

export async function getUserInformationAPI() {
	// 사용자 정보 불러오기
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	return response
}

export async function updateProfileInformationAPI(information) {
	// 사용자 프로필 정보 수정
	const access_token = localStorage.getItem("access")
	const user_id = information.user_id
	const nickname = information.nickName
	const bio = information.bio
	const profile_image = information.profile_image

	const formdata = new FormData();
	formdata.append('nickname', nickname)
	formdata.append('introduction', bio)
	if (profile_image) {
		formdata.append('profile_image', profile_image)
	} else {
		formdata.append('profile_image', '')
	}
	const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: formdata
	})
	return response
}

export async function updateUserInformationAPI(information) {
	// 유저 상세 정보 수정 API
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${information.user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			"email": information.email,
			"password": information.password,
			"new_password": information.new_password
		})
	})
	return response
}

export async function addressSubmitAPI(information) {
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/create/delivery/${information.user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST',
		body: JSON.stringify({
			recipient: information.recipient,
			postal_code: information.postcode,
			address: information.address,
			detail_address: information.detailAddress
		})
	})
	return response
}

export async function addressUpdateAPI(information) {
	// 배송 정보 수정 API
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/delivery/${information.delivery_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			recipient: information.recipient,
			postal_code: information.postcode,
			address: information.address,
			detail_address: information.detailAddress
		})
	})
	return response
}

export async function addressDeleteAPI(delivery_id) {
	// 배송 정보 삭제 API
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/delivery/${delivery_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'DELETE',
	})
	return response
}

export async function createSellerInformationAPI(information) {
	// 판매자 정보 생성 및 권한 신청
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST',
		body: JSON.stringify({
			business_owner_name: information.business_owner_name,
			company_name: information.company_name,
			contact_number: information.contact_number,
			business_number: information.business_number,
			bank_name: information.bank_name,
			account_holder: information.account_holder,
			account_number: information.account_number,
		})
	})
	return response
}

export async function updateSellerInformationAPI(information) {
	// 판매자 정보 수정
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			business_owner_name: information.business_owner_name,
			company_name: information.company_name,
			contact_number: information.contact_number,
			business_number: information.business_number,
			bank_name: information.bank_name,
			account_holder: information.account_holder,
			account_number: information.account_number,
		})
	})
	return response
}

export async function deleteSellerInformationAPI() {
	// 판매자 정보 삭제
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'DELETE',
	})

	return response
}

export async function deleteUserInformationAPI(user_id) {
	// 판매자 정보 삭제
	const access_token = localStorage.getItem("access")
	const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'DELETE',
	})

	return response
}

