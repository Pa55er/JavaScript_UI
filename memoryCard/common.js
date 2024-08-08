// elm
const $addContainer = document.getElementById("add-container");
const $cardsContainer = document.getElementById("cards-container");
const $current = document.getElementById("current");
const $question = document.getElementById("question");
const $answer = document.getElementById("answer");

// btns
const $show = document.getElementById("show");
const $hide = document.getElementById("hide");
const $clear = document.getElementById("clear");
const $prev = document.getElementById("prev");
const $next = document.getElementById("next");
const $addCard = document.getElementById("add-card");

let cardData;

// [새로운 카드를 등록 하세요]를 클릭하면 toggleClass(true) 실행 V
// 게시물 관리를 위한 id 생성
// 다음 버튼 클릭하면 카드 이동 함수 실행
// 카드 이동 함수 내부에서 사용될 li 요소 리스트 const cardsEl = [];
// 현재 카드를 인식하기 위한 currentActiveCard = 0 선언

let cardsEl = [];
let currentActiveCard;
let isFirstLoad = true;

// 카드생성
const createCard = (data, i) => {
    const card = document.createElement("li");
    card.classList.add("card");

    const range = isFirstLoad ? 0 : cardData.length - 1;
    if (i === range) {
        card.classList.add("active");
    } else if (i < range) {
        card.classList.add("left");
    }

    card.innerHTML = `
    <div class="inner-card">
        <div class="inner-card-front">
          <p>${data.question}</p>
        </div>
        <div class="inner-card-back">
          <p>${data.answer}</p>
          <button id="deleteCard" class="deleteCard" data-num="${i}">삭제</button>
        </div>
    </div>
  `;

    card.addEventListener("click", () => card.classList.toggle("show-card"));
    card.querySelector(".deleteCard").addEventListener("click", (e) => {
        cardData.splice(e.target.dataset.num, 1);
        localStorage.setItem("cards", JSON.stringify(cardData));
        isFirstLoad = true;
        createCards();
    });

    cardsEl.push(card);
    $cardsContainer.appendChild(card);
};

// ul 로딩
const createCards = () => {
    cardData = JSON.parse(localStorage.getItem("cards")) || [];
    cardsEl = [];
    if (cardData.length === 0) {
        $cardsContainer.innerHTML = `
        <li>새로운 카드를 등록해주세요</li>
        `;
        $cardsContainer.classList.add("nolist");
        currentActiveCard = 0;
        updateCurrentText();
        return;
    }
    $cardsContainer.classList.remove("nolist");
    $cardsContainer.innerHTML = ``;
    cardData.forEach((data, i) => createCard(data, i));
    currentActiveCard = isFirstLoad ? 1 : cardsEl.length;
    updateCurrentText();
    isFirstLoad = false;
};
createCards();

// 요소 추가하기
const addCard = () => {
    const question = $question.value.trim();
    const answer = $answer.value.trim();

    if (question && answer) {
        const newCard = { question, answer };
        cardData.push(newCard);

        localStorage.setItem("cards", JSON.stringify(cardData));
        $question.value = "";
        $answer.value = "";
        toggleClass(false);
        createCards();
    } else {
        alert("내용을 입력해주세요");
    }
};
$addCard.addEventListener("click", () => addCard());

// 모달 열기, 닫기
const toggleClass = (show) => {
    $addContainer.classList.toggle("show", show);
};
$show.addEventListener("click", () => toggleClass(true));
$hide.addEventListener("click", () => toggleClass(false));
document.addEventListener("click", (e) => {
    if (e.target.closest(".nolist")) {
        toggleClass(true);
    }
});

// navigation
const moveCard = (direction) => {
    if (cardData.length === 0) return;
    cardsEl[currentActiveCard - 1].className = `card ${
        direction > 0 ? "left" : ""
    }`;
    currentActiveCard = Math.max(
        1,
        Math.min(currentActiveCard + direction, cardsEl.length)
    );
    cardsEl[currentActiveCard - 1].className = `card active`;
    updateCurrentText();
};
$next.addEventListener("click", () => moveCard(1));
$prev.addEventListener("click", () => moveCard(-1));

// current
function updateCurrentText() {
    $current.innerText = ` ${currentActiveCard}/${cardsEl.length} `;
}

// clear
$clear.addEventListener("click", () => {
    localStorage.clear("cards");
    $cardsContainer.innerHTML = "";
    createCards();
});
