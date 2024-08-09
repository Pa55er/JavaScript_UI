const API_KEY = "bd1e997ad9834af4a4c317ead052f7a6";

const $nav = document.getElementById("gnb");
const $searchBtn = document.querySelector(".searchBtn");
const $inputArea = document.querySelector(".inputArea input");

let url = new URL(`https://newsapi.org/v2/top-headlines`);
let pageSize = 3;
let page = 1;
let totalResults = 0;
let groupSize = 5;
let currentPage = 1;

// 페이지네이션을 위한 변수
let currentCategory = "general";
let currentQuery = null;

const fetchNews = async (category = "general", query = null, pageNum = 1) => {
    try {
        url.searchParams.delete("category");
        url.searchParams.delete("q");

        url.searchParams.set("apiKey", API_KEY);
        url.searchParams.set("country", "kr");
        url.searchParams.set("pageSize", pageSize);
        url.searchParams.set("page", pageNum);

        if (query) {
            url.searchParams.set("q", query);
            currentQuery = query;
            currentCategory = null;
        } else {
            url.searchParams.set("category", category);
            currentQuery = null;
            currentCategory = category;
        }

        const res = await fetch(url);
        const data = await res.json();
        newsList = data.articles;
        page = pageNum;
        currentPage = pageNum;
        renderNews(newsList);

        totalResults = data.totalResults;
        pagination();
    } catch (e) {
        console.error(e);
    }
};

const movePage = (pageNum) => {
    // page = pageNum;
    // currentPage = pageNum;
    fetchNews(currentCategory, currentQuery, pageNum);
};

const pagination = () => {
    let pageGroup = Math.ceil(page / groupSize);
    let totalPage = Math.ceil(totalResults / pageSize);
    let lastPage = Math.min(totalPage, pageGroup * groupSize);
    let firstPage = (pageGroup - 1) * groupSize + 1;
    let prevGroup = (pageGroup - 2) * groupSize + 1;
    let nextGroup = pageGroup * groupSize + 1;

    let paginationHtml = `<button class="prev" ${
        pageGroup === 1 ? "disabled" : ""
    } onClick='movePage(${prevGroup})'>이전페이지그룹</button>`;

    paginationHtml += `<button class="prev" ${
        currentPage === 1 ? "disabled" : ""
    } onClick='movePage(${currentPage - 1})'>이전</button>`;

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHtml += `<button class="${
            i === currentPage ? "on" : ""
        }" onClick='movePage(${i})'>${i}</button>`;
    }

    paginationHtml += `<button class="next" ${
        currentPage === totalPage ? "disabled" : ""
    } onClick='movePage(${currentPage + 1})'>다음</button>`;

    paginationHtml += `<button class="next" ${
        pageGroup * groupSize >= totalPage ? "disabled" : ""
    } onClick='movePage(${nextGroup})'>다음페이지그룹</button>`;

    document.querySelector(".pgCon").innerHTML = paginationHtml;
};

const createHtml = (news) => {
    let urlToImage = news.urlToImage || "./No_Image.jpg";
    let title = news.title || "제목없음";
    let description = news.description
        ? news.description.length > 100
            ? news.description.substring(0, 100) + "..."
            : news.description
        : "내용이 없어요";
    let author = news.author || "작성자없음";
    let publishedAt = news.publishedAt
        ? new Date(news.publishedAt).toISOString().slice(0, 10)
        : "";
    let source = news.source ? news.source.name || "출처없음" : "출처없음";
    return `
	<li>
        <div class="newsImg">
            <img src="${urlToImage}" alt="" />
        </div>
        <p class="title">${title}</p>
        <p class="desc">${description}</p>
        <p class="source">${author}</p>
        <p class="source">${source}</p>
        <p class="date">${publishedAt}</p>
        <a class="more" href="${news.url}">자세히보기</a>
    </li>
	`;
};

const renderNews = (newsList) => {
    console.log(newsList);
    const newsHtml = newsList.map((news) => createHtml(news)).join("");
    document.getElementById("listCon").innerHTML = newsHtml;
};

$nav.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;
    let category = e.target.dataset.cate;
    // page = 1;
    // currentPage = 1;
    fetchNews(category);
});

const searchFn = () => {
    const searchWord = $inputArea.value;
    $inputArea.value = "";
    // page = 1;
    // currentPage = 1;
    fetchNews(null, searchWord);
};

$searchBtn.addEventListener("click", () => {
    searchFn();
});

$inputArea.addEventListener("keyup", (e) => {
    if (e.key !== "Enter") return;
    searchFn();
});

fetchNews();
