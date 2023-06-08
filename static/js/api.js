export const FRONT_BASE_URL = "http://127.0.0.1:5500"
export const BACK_BASE_URL = "http://127.0.0.1:8000"

// 삭제예정
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