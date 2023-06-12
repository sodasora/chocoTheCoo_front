export const FRONT_BASE_URL = "http://127.0.0.1:5501"
export const BACK_BASE_URL = "http://127.0.0.1:8000"

// 삭제예정
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