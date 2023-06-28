import { BACK_BASE_URL, FRONT_BASE_URL, searchProductAPI} from './api.js'



let EI = 0
let NS = 0
let FT = 0
let PJ = 0

let mbti = ""

// mbti 결과에 따른 cbti 결과 출력
const cbti = {
    ENTJ: ` 
      바나나 초콜릿의 싱그러운 바나나 맛과 진한 초콜릿의 조합은 ENTJ 유형의 창의성과 지도력을 발휘하는 
      데 도움이 될 수 있습니다. 또한 바나나에는 세로토닌이 함유되어 있어서, ENTJ 유형의 스트레스 해소와 기분전환에 좋은 선택이
      됩니다.`,
    
    ESTJ: `  
    다크 초콜릿은 강한 초콜릿 향과 씁쓸한 맛이 특징이며, ESTJ 유형의 목적의식이 강하고 타고난 
    지도력과 분석력을 더욱 높여줄 수 있습니다. 또한, 커피와 함께 즐기면 맛과 향이 더욱 살아나겠죠? 이 밖에 다크 
    초콜릿은 플라보노이드와 카테킨 등이 함유되어 있어 혈관을 확장시키고 혈액순환을 촉진시켜 신체의 건강을 증진합니다.`,

    ENFJ: ` 
    겉은 달콤하고 속은 쫀득한 헤이즐넛과 함께 부드러운 초콜릿 향이 나는 맛이 특징입니다. 
    이는 ENFJ 유형의 사람들이 타인과의 소통과 사회성을 중요시하는 특성과 잘 어울리며, 초콜릿과 헤이즐넛이 함유하고 
    있는 우울증 예방에 효과적인 호르몬인 세로토닌 농도가 높아 몸과 마음 모두에 좋은 선택입니다.`,

    ESFJ:`
    유형에게 추천하는 초콜릿은 밀크 초콜릿입니다. 밀크 초콜릿은 달콤하고 부드러운 맛이 특징이며, ESFJ 유형의
     따뜻하고 친절한 성격과 잘 어울립니다. 또한, 밀크 초콜릿은 코코아 버터가 함유되어 있어, 
    피부 관리에 좋은 성분이며, 신체 및 정신적인 스트레스 해소 및 기분전환에 좋은 호르몬 세로토닌 분비를 촉진시키는데 도움됩니다.`,

    ENTP:`
    해바라기씨 초콜릿은 씁쓸한 초콜릿 맛과 함께 해바라기씨가 씹히는 식감이 특징입니다. 
    이는 ENTP 유형의 창의력과 새로운 아이디어를 만들어내는 능력을 더욱 높여줄 수 있습니다.`,

    ESTP:` 
    이는 ESTP 유형의 적극적이고 활동적인 성격과는 잘 어울리며, 오렌지의 비타민 C 함량이 많아
     피로를 회복시켜줄 수 있습니다. 또한, 오렌지와 초콜릿에 함유된 항산화제가 세포를 보호해줘 건강한 피부와 면역력을 
     유지할 수 있는 데 도움을 줄 수 있습니다.`,

    ENFP:` 
    커피 초콜릿은 진한 커피 향과 청량감 있는 초콜릿 맛이 특징이며, ENFP 유형의 즉흥적이고 유연한 성격과
     잘 어울립니다. 또한, 커피에 함유된 카페인은 에너지를 충전시키고 집중력을 높이는데 도움을 주므로, ENFP 유형이 
     아이디어를 떠올리고 계획을 세우는 과정에서 적극적으로 활용할 수 있습니다.`,
     
    ESFP:` 
    라즈베리 초콜릿은 달콤하고 상큼한 라즈베리 맛과 진한 초콜릿의 맛이 조화롭게 어우러진 맛이
     특징입니다. 이는 ESFP 유형의 사람들이 즐거운 분위기와 따뜻한 인간관계를 중요시하는 성격과 맞아 떨어지며, 라즈베리는
      항산화 작용이 있어 피로 회복에 좋은 성분이며, 초콜릿은 세로토닌 분비를 촉진하여, 스트레스 해소와 기분전환에 좋은 선택입니다.`,

    INTJ:`
    INTJ 유형에게 추천하는 초콜릿은 민트 초콜릿입니다. 민트 초콜릿은 상쾌한 민트향과 진한 초콜릿의 맛이 조화롭게 어우러진 맛이 특징입니다. 
    이는 INTJ 유형이 비판적이고 분석적인 성격과 어우러져, 더욱 집중력과 체력을 높일 수 있습니다.`,
    
    ISTJ:`
    프랄린 초콜릿은 고소하고 달콤한 맛이 특징이며, 
    ISTJ 유형의 규칙적이고 체계적인 성격과 어우러져 잘 어울립니다. 또한, 프랄린은 호두와 아몬드, 헤이즐넛, 크루아상 등 
    다양한 견과류를 함유하고 있어 영양성분이 높고 혈당 노폐물 제거, 혈압조절, 체중감량 등에 도움이 되는데, 이는 실용성을
    중시하는 ISTJ에게 효과적입니다.`,
    
    INFJ:`
    INFJ 유형에게 추천하는 초콜릿은 다크 초콜릿입니다. 다크 초콜릿은 씁쓸하면서도 진한 초콜릿 맛이
    특징이며, INFJ 유형의 집중력과 섬세한 감수성을 더욱 높여줄 수 있습니다. 또한 다크 초콜릿은 비타민이 풍부하고 
    항산화 작용이 있어 면역력을 높이고 심장질환, 당뇨병, 고혈압 등 다양한 질병 예방에 효과적입니다.`,
    
    ISFJ:`
    ISFJ 유형에게 추천하는 초콜릿은 헤이즐넛 블랙 초콜릿입니다. 헤이즐넛 블랙 초콜릿은 겉은 씁쓸하면서 속은 고소하고 달콤한 헤이즐넛 맛이 어우러진 맛이 특징입니다. 
    ]이는 ISFJ 유형의 따뜻하고 부드러운 성격과 잘 어울리며, 헤이즐넛은 다양한 미네랄과 비타민, 
    항산화 작용을 위한 폴리페놀류를 함유하고 있어 건강에 좋으며, 다크 초콜릿의 카카오 함량이 헤이즐넛과 잘 어울려 맛과 건강 모두에 좋은 선택입니다.`,

    INTP:`
    밀크 초콜릿은 달콤한 맛과 진한 초콜릿 향이 좋은 균형을 이루는 맛으로, INTP 유형의 분석력과 통찰력을 높여줄 수 있습니다. 
    특히 밀크 초콜릿은 우유에 함유된 칼슘, 단백질, 미네랄 등이 포함되어 있어 건강한 뼈와 근육을 유지, 강화하는 데 도움을 줄 수 있습니다.`,
    
    ISTP:`
    ISTP 유형에게 추천하는 초콜릿은 다크 초콜릿입니다. 다크 초콜릿은 겉과 속 모두 쌉쌀한 맛이 특징이며, ISTP 유형의 집중력과 활동성을 더욱 높여줄 수 있습니다. 
    또한, 다크 초콜릿에는 다른 초콜릿에 비해 더 많은 카카오 함량이 포함되어 있으며 식이섬유, 미네랄, 비타민 등이 풍부하여, 건강한 심장과 혈액순환에도 도움이 될 수 있습니다.`,
    
    INFP:`
    카페 모카 초콜릿은 진한 커피 향과 부드러운 초콜릿 맛이 어우러져 인상 깊은 맛을 선사합니다. 이는 인티피와 같이 깊은 생각을 하고, 많은 것을 고민하는 성격에게 적합합니다. 
    또한, 커피는 카페인이 함유되어 있는데, 카페인은 대사 속도를 높이고 피로를 줄여주어, 인티피의 지친 몸과 마음을 진정시켜 주는데 도움을 줄 수 있습니다.`,
    
    ISFP:`
    유형에게 추천하는 초콜릿은 화이트 초콜릿입니다. 화이트 초콜릿은 달콤하면서 부드러운 맛과 질감이 특징입니다. 이는 ISFP 유형의 예술적인 취향과 민감한 감수성과 잘 어울립니다. 
    또한 화이트 초콜릿은 다크 초콜릿에 비해 칼로리가 적고 지방 함량도 낮아, 다이어트를 하고 있는 ISFP 유형의 체중 관리에도 도움이 될 수 있습니다.`
  };

const cbtiName = {
    ENTJ:  "바나나 초콜렛",
    ESTJ:  "다크 초콜렛",
    ENFJ:  "헤이즐넛 초콜렛",
    ESFJ:  "밀크 초콜렛",
    ENTP:  "해바라기씨 초콜렛",
    ESTP:  "오렌지 초콜렛",
    ENFP:  "커피 초콜렛",
    ESFP:  "라즈베리 초콜렛",
    INTJ:  "민트 초콜렛",
    ISTJ:  "다크 초콜렛",
    INFJ:  "아몬드 초콜렛",
    ISFJ:  "밀크 초콜렛",
    INTP:  "밀크 초콜렛",
    ISTP:  "다크 초콜렛",
    INFP:  "커피 초콜렛",
    ISFP:  "화이트 초콜렛"
}

export async function cbtiResult() {
    // E일 때 1, I일 때 0
    const EI_one_1 = document.getElementById("EI_one_1").checked ? 1 : 0;
    const EI_two_1 = document.getElementById("EI_two_1").checked ? 1 : 0;
    const EI_three_1 = document.getElementById("EI_three_1").checked ? 1 : 0;

    EI = EI_one_1 + EI_two_1 + EI_three_1;

    // N일때 1, S일 때 0
    const NS_one_1 = document.getElementById("NS_one_1").checked ? 1 : 0;
    const NS_two_1 = document.getElementById("NS_two_1").checked ? 1 : 0;
    const NS_three_1 = document.getElementById("NS_three_1").checked ? 0 : 1;

    NS = NS_one_1 + NS_two_1 + NS_three_1;
    // T일때 1, F일 때 0
    const FT_one_1 = document.getElementById("FT_one_1").checked ? 0 : 1;
    const FT_two_1 = document.getElementById("FT_two_1").checked ? 1 : 0;
    const FT_three_3 = document.getElementById("FT_three_3").checked ? 0 : 1;

    FT = FT_one_1 + FT_two_1 + FT_three_3;

    // P일때 1, J일때 0
    const PJ_one_1 = document.getElementById("PJ_one_1").checked ? 1 : 0;
    const PJ_two_1 = document.getElementById("PJ_two_1").checked ? 1 : 0;
    const PJ_three_1 = document.getElementById('PJ_three_1').checked ? 1 : 0;

    PJ = PJ_one_1 + PJ_two_1 + PJ_three_1;

    mbti += EI >= 2 ? "E" : "I";
    mbti += NS >= 2 ? "N" : "S";
    mbti += FT >= 2 ? "T" : "F";
    mbti += PJ >= 2 ? "P" : "J";

    printCBTIResult(mbti)
}
 
export async function printCBTIResult(mbti) {
    const title = cbtiName[mbti] || "다른 MBTI 타입";
    const result = cbti[mbti] || "다른 MBTI 타입";
    const response = await searchProductAPI(title);
    console.log(title)
    const productId = response.results[0].id;
    const imageUrl = response.results[0].image; 

    const imgElement = document.createElement('img'); 
    imgElement.setAttribute("id", "cbti-image");
    imgElement.src = imageUrl; 

    document.getElementById("cbti-result").appendChild(imgElement); 
    document.getElementById("cbti-result-title").innerText = title;
    document.getElementById("cbti-result-description").innerText = result;

    imgElement.addEventListener("click", () => {
        const targetUrl = `${FRONT_BASE_URL}/productdetail.html?product_id=${productId}`;
        window.open(targetUrl, "_blank");
      })
  }   


export async function setEventListener() {
    // 이벤트 리스너 추가
    const EI_button = document.getElementById("CBTI-result-btn").addEventListener("click", cbtiResult)
}

window.onload = async () => {
    setEventListener()
}