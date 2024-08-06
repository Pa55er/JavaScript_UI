const loader = document.createElement("div");
loader.classList.add("loader");
loader.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
document.querySelector(".wrap").appendChild(loader);

const $postsCon = document.getElementById("posts-con");
const $loader = document.querySelector(".loader");
const $filter = document.getElementById("filter");

let limit = 5;
let page = 1;
let isLoading = false;
let currentTerm = "";
let isCheckingScroll = false;
let noMore = false; // 더이상 불러올 데이터가 없을 경우를 확인하기 위한 플래그

const getPosts = async (searchTerm = "") => {
    let url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`;
    if (searchTerm) {
        url += `&q=${encodeURIComponent(searchTerm)}`;
    }
    const res = await fetch(url);
    const data = await res.json();

    // 데이터가 0일 때
    if (data.length === 0) {
        noMore = true;
    }
    return data;
};

const showPosts = async () => {
    const posts = await getPosts(currentTerm);
    console.log(posts);

    posts.forEach((post) => {
        const postElm = document.createElement("li");
        postElm.classList.add("post");
        postElm.innerHTML = `
            <span class="post-number">${post.id}</span>
            <div class="post-info">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-body">${post.body}</p>
            </div>
            `;
        $postsCon.appendChild(postElm);
    });
};

const newLoading = () => {
    console.log(1);
    if (isLoading) return;
    isLoading = true;
    $loader.classList.add("show");
    setTimeout(async () => {
        page++;
        await showPosts();
        isLoading = false;
        $loader.classList.remove("show");
        checkScrollable();
    }, 1000);
};

const checkScrollable = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !noMore) {
        // 새로운 데이터를 호출
        newLoading();
    }
};

window.addEventListener("scroll", checkScrollable);

const filterPosts = () => {
    const searchTerm = $filter.value.trim();
    if (searchTerm !== currentTerm) {
        currentTerm = searchTerm;
        page = 1;
        $postsCon.innerHTML = "";
        showPosts();
        noMore = false;
    }
};

//   입력폼에서 엔터로 마무리 했을 때 검색 함수 시작
$filter.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        filterPosts();
        checkScrollable();
    }
});

// 수정된 부분: 초기 로드 시 checkScrollable 함수 호출
showPosts().then(() => {
    checkScrollable();
});
