const FRONT_BASE_URL = "http://127.0.0.1:5500"
const BACK_BASE_URL = "http://127.0.0.1:8000"

//판매자의 상품 등록

async function registProduct() {
    
    
    const name = document.getElementById("name").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("formFile").files[0];
    const price = document.getElementById("price").value;
    const amount = document.getElementById("amount").value;
    
    const formdata = new FormData();

    
    formdata.append('name', name)
    formdata.append('content', content)
    formdata.append('price', price)
    formdata.append('amount', amount)

    if(image){
        formdata.append('image', image)
    }
    
    for (const pair of formdata.entries()) {
    console.log(pair[0] + ':', pair[1]);
    }
    
    let token = localStorage.getItem("access")

    try {
        const response = await fetch(`${BACK_BASE_URL}/api/products/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formdata
        })
        
        if (response.status === 201) {
            alert('상품등록 완료!')
            window.location.replace(`${FRONT_BASE_URL}/sellerpage.html`)
        } else {
            alert('상품 등록 실패')
        }
    } catch (error) {
        console.error(error);
    }
}
    