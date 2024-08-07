const $addBtn = document.querySelector(".addBtn");
const $empty = document.querySelector(".empty");
const $clearBtn = document.querySelector(".clearBtn");
const $sliderUl = document.querySelector(".sliderUl");
const $bot = document.querySelector(".bot");
let list = JSON.parse(localStorage.getItem("memoryCards")) || [];
let index = 0;

const loadList = () => {
    $sliderUl.innerHTML = ``;
    list.forEach((element) => {
        const newEle = document.createElement("li");
        newEle.setAttribute("class", "slider");
        newEle.innerHTML = `
        <div class="front">
            <span class="quest">${element.quest}</span>
            <span class="not">클릭하면 뒤집혀요</span>
        </div>
        <div class="back">
            <span>${element.ans}</span>
        </div>
        `;
        newEle.addEventListener("click", () => {
            newEle.querySelector(".front").classList.add("reverse");
            newEle.querySelector(".back").classList.add("reverse");
        });
        newEle.addEventListener("mouseleave", () => {
            newEle.querySelector(".front").classList.remove("reverse");
            newEle.querySelector(".back").classList.remove("reverse");
        });
        $sliderUl.appendChild(newEle);
    });
    $sliderUl.style.width = `calc(100% * ${list.children.length})`;
    const $slides = document.querySelectorAll(".sliderUl .slider");
    $slides.forEach((element) => {
        element.style.cssText = `width: calc(100% / ${list.children.length});`;
    });
    $bot.querySelector("span").innerHTML = `${
        list.length === 0 ? 0 : index + 1
    }/${list.length}`;
};

list.length === 0
    ? ($sliderUl.innerHTML = `
    <div class="empty">
        <span>항목을 추가해 주세요</span>
    </div>
    `)
    : loadList();

const displayModal = () => {
    const $modal = document.createElement("section");
    $modal.classList.add("modal");

    const $inner = document.createElement("div");
    $inner.classList.add("inner");
    $inner.innerHTML = `
	<div class="sec">
        <div class="mtop">
            <span>새로운 항목 추가</span>
            <button class="closeBtn">닫기</button>
        </div>
        <div class="mmid">
            <span>질문</span>
            <input id="quest" type="text" placeholder="질문을 적어주세요" />
        </div>
        <div class="mmid">
            <span>답변</span>
            <input id="ans" type="text" placeholder="내용을 적어주세요" />
        </div>
        <button class="listAddBtn">추가하기</button>
    </div>
	`;

    $modal.appendChild($inner);
    document.body.appendChild($modal);

    const $closeBtn = document.querySelector(".closeBtn");
    $closeBtn.addEventListener("click", () => {
        $modal.remove();
    });

    const $listAddBtn = document.querySelector(".listAddBtn");
    $listAddBtn.addEventListener("click", () => {
        $quest = document.getElementById("quest");
        $ans = document.getElementById("ans");
        $quest.value !== "" && $ans.value !== ""
            ? (list.push({ quest: $quest.value, ans: $ans.value }),
              ($quest.value = ""),
              ($ans.value = ""),
              localStorage.setItem("memoryCards", JSON.stringify(list)),
              alert("추가되었습니다"),
              loadList())
            : alert("빈칸없이 채워주세요");
    });
};

$addBtn.addEventListener("click", displayModal);
$clearBtn.addEventListener("click", () => {
    list = [];
    localStorage.setItem("memoryCards", JSON.stringify(list));
    $sliderUl.innerHTML = `
    <div class="empty">
        <span>항목을 추가해 주세요</span>
    </div>
    `;
    index = 0;
    $bot.querySelector("span").innerHTML = `${
        list.length === 0 ? 0 : index + 1
    }/${list.length}`;
});
