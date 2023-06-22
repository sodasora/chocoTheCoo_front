import { BACK_BASE_URL, FRONT_BASE_URL, getProductListAPIView } from './api.js'

export async function productDetail(product_id) {
    window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`
}

window.onload = async function () {
    const choco = document.getElementById("chocobanner")
    choco.addEventListener("click", function () {
        window.location.href = "subscriptioninfo.html";
    })

    const product = await getProductListAPIView();
    console.log(product)

    if ((product.next == null) & (product.previous == null)) {
        if (product.result != "") {
            const list = document.getElementById("product-content");
            const buttons = document.getElementById("product-buttons");

            buttons.setAttribute("style", "display:none;")
            product.results.forEach(e => {
                const newCol = document.createElement("div");
                newCol.setAttribute("class", "col");

                const newCard = document.createElement("div");
                newCard.setAttribute("class", "card");
                newCard.setAttribute("id", e.id);

                newCard.onclick = function () {
                    productDetail(e.id);
                };

                const img = document.createElement("img");
                img.setAttribute("class", "card-img-top");

                if (e.image) {
                    img.setAttribute(
                        "src",
                        `${e.image}`
                    );
                } else {
                    img.setAttribute("src", '/static/images/기본이미지.gif')
                }

                newCard.appendChild(img);

                const newCardBody = document.createElement("div");
                newCardBody.setAttribute("class", "card-body");
                newCard.appendChild(newCardBody);

                const newCardTitle = document.createElement("h5");
                newCardTitle.setAttribute("class", "card-title");
                newCardTitle.innerText = e.name;
                newCardBody.appendChild(newCardTitle);

                const newCardText = document.createElement("p");
                newCardText.setAttribute("class", "card-text");
                newCardText.innerText = "상품가격 : " + e.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
                newCard.appendChild(newCardText)

                const newCardFooter = document.createElement("p");
                newCardFooter.setAttribute("class", "card-footer");
                newCardFooter.innerText = "상품수량 : " + e.amount + "개";
                newCard.appendChild(newCardFooter)
                newCol.appendChild(newCard);
                list.appendChild(newCol);
            })
        } else {
            list.innerText = "정보가 없습니다."
        }
    } else {
        const list = document.getElementById("product-content");
        const buttons = document.getElementById("product-buttons");

        const numOfContent = product.count;
        const maxContent = 6; //한 페이지에 보이는 수
        const maxButton = 5; //보이는 최대 버튼 수
        const maxPage = Math.ceil(numOfContent / maxContent);
        let page = 1;

        product.results.forEach(e => {
            const newCol = document.createElement("div");
            newCol.setAttribute("class", "col");

            const newCard = document.createElement("div");
            newCard.setAttribute("class", "card");
            newCard.setAttribute("id", e.id);

            newCard.onclick = function () {
                productDetail(e.id);
            };

            const img = document.createElement("img");
            img.setAttribute("class", "card-img-top");

            if (e.image) {
                img.setAttribute(
                    "src",
                    `${e.image}`
                );
            } else {
                img.setAttribute("src", '/static/images/기본이미지.gif')
            }

            newCard.appendChild(img);

            const newCardBody = document.createElement("div");
            newCardBody.setAttribute("class", "card-body");
            newCard.appendChild(newCardBody);

            const newCardTitle = document.createElement("h5");
            newCardTitle.setAttribute("class", "card-title");
            newCardTitle.innerText = e.name;
            newCardBody.appendChild(newCardTitle);

            const newCardText = document.createElement("p");
            newCardText.setAttribute("class", "card-text");
            newCardText.innerText = "상품가격 : " + e.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
            newCard.appendChild(newCardText)

            const newCardFooter = document.createElement("p");
            newCardFooter.setAttribute("class", "card-footer");
            newCardFooter.innerText = "상품수량 : " + e.amount + "개";
            newCard.appendChild(newCardFooter)
            newCol.appendChild(newCard);
            list.appendChild(newCol);
        })
    }


    // if (product != "") {
    //     // 페이지네이션 페이지 설정
    //     const numOfContent = product.length;
    //     const maxContent = 6; //한 페이지에 보이는 수
    //     const maxButton = 5; //보이는 최대 버튼 수
    //     const maxPage = Math.ceil(numOfContent / maxContent);
    //     let page = 1;

    //     const Content = (id) => {
    //         const newCol = document.createElement("div");
    //         newCol.setAttribute("class", "col");

    //         const newCard = document.createElement("div");
    //         newCard.setAttribute("class", "card");
    //         newCard.setAttribute("id", product[id].id);

    //         newCard.onclick = function () {
    //             productDetail(product[id].id);
    //         };

    //         const img = document.createElement("img");
    //         img.setAttribute("class", "card-img-top");

    //         if (product[id].image) {
    //             img.setAttribute(
    //                 "src",
    //                 `${product[id].image}`
    //             );
    //         } else {
    //             img.setAttribute("src", '/static/images/기본이미지.gif')
    //         }

    //         newCard.appendChild(img);

    //         const newCardBody = document.createElement("div");
    //         newCardBody.setAttribute("class", "card-body");
    //         newCard.appendChild(newCardBody);

    //         const newCardTitle = document.createElement("h5");
    //         newCardTitle.setAttribute("class", "card-title");
    //         newCardTitle.innerText = product[id].name;
    //         newCardBody.appendChild(newCardTitle);

    //         const newCardText = document.createElement("p");
    //         newCardText.setAttribute("class", "card-text");
    //         newCardText.innerText = "상품가격 : " + product[id].price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
    //         newCard.appendChild(newCardText)

    //         const newCardFooter = document.createElement("p");
    //         newCardFooter.setAttribute("class", "card-footer");
    //         newCardFooter.innerText = "상품수량 : " + product[id].amount + "개";
    //         newCard.appendChild(newCardFooter)
    //         newCol.appendChild(newCard);
    //         return newCol;
    //     }

    //     const makeButton = (id) => {
    //         const button = document.createElement("button");
    //         button.classList.add("button_page");
    //         button.dataset.num = id;
    //         button.innerText = id;
    //         button.addEventListener("click", (e) => {
    //             Array.prototype.forEach.call(buttons.children, (button) => {
    //                 if (button.dataset.num) button.classList.remove("active");
    //             });
    //             e.target.classList.add("active");
    //             renderContent(parseInt(e.target.dataset.num));
    //         });
    //         return button;
    //     }

    //     const renderContent = (page) => {
    //         // 목록 리스트 초기화
    //         while (list.hasChildNodes()) {
    //             list.removeChild(list.lastChild);
    //         }
    //         // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
    //         for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
    //             list.appendChild(Content(id - 1));
    //         }
    //     };

    //     const goPrevPage = () => {
    //         page -= maxButton;
    //         render(page);
    //     };

    //     const goNextPage = () => {
    //         page += maxButton;
    //         render(page);
    //     };

    //     const prev = document.createElement("button");
    //     prev.classList.add("button_page", "prev");
    //     prev.innerHTML = `<ion-icon name="chevron-back-outline"></ion-icon>`;
    //     prev.addEventListener("click", goPrevPage);

    //     const next = document.createElement("button");
    //     next.classList.add("button_page", "next");
    //     next.innerHTML = `<ion-icon name="chevron-forward-outline"></ion-icon>`;
    //     next.addEventListener("click", goNextPage);

    //     const renderButton = (page) => {
    //         // 버튼 리스트 초기화
    //         while (buttons.hasChildNodes()) {
    //             buttons.removeChild(buttons.lastChild);
    //         }
    //         // 화면에 최대 maxButton개의 페이지 버튼 생성
    //         for (let id = page; id < page + maxButton && id <= maxPage; id++) {
    //             buttons.appendChild(makeButton(id));
    //         }
    //         // 첫 버튼 활성화(class="active")
    //         buttons.children[0].classList.add("active");

    //         buttons.prepend(prev);
    //         buttons.appendChild(next);

    //         // 이전, 다음 페이지 버튼이 필요한지 체크
    //         if (page - maxButton < 1) buttons.removeChild(prev);
    //         if (page + maxButton > maxPage) buttons.removeChild(next);
    //     };

    //     const render = (page) => {
    //         renderContent(page);
    //         renderButton(page);
    //     };
    //     render(page);

    // } else {
    //     list.innerText = "정보가 없습니다."
    // }


}