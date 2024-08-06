const $dots = document.querySelectorAll(".slider-dot span");
const $prevBtn = document.querySelector(".prev");
const $nextBtn = document.querySelector(".next");

// 선택된 페이지네이션 인덱스
let sliderNum = 0;

// 이벤트 중첩 금지
let isCliackAble = false;

/**
 * 초기 세팅을 위한 함수입니다.
 **/
function initialSettings() {
    const $sliderUl = document.querySelector(".sliderUl");

    // 반복 요소들 추가
    const newEle = Array.from($sliderUl.children);
    newEle.reverse();
    newEle.forEach((element) => {
        $sliderUl.prepend(element.cloneNode(true));
    });

    // sliderUl 넓이와 위치 조절
    const len = $sliderUl.children.length;
    $sliderUl.style.width = `calc(100% * ${len})`;
    $sliderUl.style.transform = `translate(calc(-100% / ${len} * ${len / 2}))`;

    // slider들 넓이 조절
    const $slides = document.querySelectorAll(".sliderUl .slider");
    $slides.forEach((element) => {
        element.style.cssText = `width: calc(100% / ${len});`;
    });

    // 페이지네이션 1번 span 태그에 "on" 클래스명 추가
    document.querySelector(".dot1").classList.add("on");
}

/**
 * sliderUl과 페이지네이션에 변화를 주는 함수입니다.
 * @param {number} 이동할 인덱스의 거리값을 적으세요. (양수는 오른쪽으로)
 **/
function moveSlider(count) {
    // 예외 처리
    if (count === 0) return;

    const $sliderUl = document.querySelector(".sliderUl");
    const len = $sliderUl.children.length;

    // sliderUl 이동
    $sliderUl.style.transition = "transform 0.3s ease";
    $sliderUl.style.transform = `translate(calc(-100% / ${len} * (${
        len / 2 + count
    })))`;

    // 슬라이드 순서 배치 및 slierUl 위치 재조정
    setTimeout(() => {
        if (count > 0) {
            const newEle = Array.from($sliderUl.children).splice(0, count);
            newEle.forEach((element) => {
                $sliderUl.firstElementChild.remove();
                $sliderUl.append(element.cloneNode(true));
            });
        } else {
            const newEle = Array.from($sliderUl.children).splice(len + count);
            newEle.reverse();
            newEle.forEach((element) => {
                $sliderUl.lastElementChild.remove();
                $sliderUl.prepend(element.cloneNode(true));
            });
        }
        $sliderUl.style.transition = "transform 0s";
        $sliderUl.style.transform = `translate(calc(-100% / ${len} * ${
            len / 2
        }))`;
    }, 400);

    // 새로 선택된 페이지네이션 인덱스 할당
    sliderNum += count;

    // 마이너스 모듈 연산 처리
    sliderNum = (sliderNum + $dots.length) % $dots.length;

    // 페이지네이션 style 재적용
    $dots.forEach((element) => {
        element.classList.remove("on");
    });
    $dots[sliderNum].classList.add("on");
}

// 초기 세팅 함수 실행
initialSettings();

$prevBtn.addEventListener("click", () => {
    // 쓰로틀링 적용1
    if (isCliackAble) return;
    isCliackAble = true;

    // 슬라이더 이동
    moveSlider(-1);

    // 쓰로틀링 적용2
    setTimeout(() => {
        isCliackAble = false;
    }, 500);
});

$nextBtn.addEventListener("click", () => {
    // 쓰로틀링 적용1
    if (isCliackAble) return;
    isCliackAble = true;

    // 슬라이더 이동
    moveSlider(1);

    // 쓰로틀링 적용2
    setTimeout(() => {
        isCliackAble = false;
    }, 500);
});

$dots.forEach((element) => {
    element.addEventListener("click", (e) => {
        // 쓰로틀링 적용1
        if (isCliackAble) return;
        isCliackAble = true;

        // 이전 페이지네이션과 클릭한 페이지네이션의 인덱스 차이 계산
        const indexDif = parseInt(e.target.innerText) - 1 - sliderNum;

        // 슬라이더 이동
        moveSlider(indexDif);

        // 쓰로틀링 적용2
        setTimeout(() => {
            isCliackAble = false;
        }, 500);
    });
});
