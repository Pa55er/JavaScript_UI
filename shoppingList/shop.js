const $itemInput = document.getElementById("itemInput");
const $addBtn = document.getElementById("addBtn");
const $items = document.getElementById("items");

let id = -1;
let shopList = JSON.parse(localStorage.getItem("shopList")) || [];

$itemInput.focus();

const saveToLocalStorage = () => {
    localStorage.setItem("shopList", JSON.stringify(shopList));
};

const createItem = (item) => {
    const $li = document.createElement("li");
    $li.setAttribute("class", "item");
    $li.setAttribute("data-num", item.id);
    $li.innerHTML = `
    <span>${item.text}</span>
    <i class="deleteBtn fa-solid fa-trash-can" data-id="${item.id}"></i>
    `;
    return $li;
};

const onAdd = () => {
    const text = $itemInput.value.trim();
    if (text === "") {
        $itemInput.focus();
        return;
    }

    // [{id:id++, text: text},{},{},...]
    const newItem = { id: id++, text: text };
    shopList.push(newItem);
    saveToLocalStorage();

    const item = createItem(newItem);
    $items.appendChild(item);
    item.scrollIntoView({ block: "end" });

    $itemInput.value = "";
    $itemInput.focus();
};

$addBtn.addEventListener("click", () => {
    onAdd();
});

$itemInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") onAdd();
});

$items.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    if (id) {
        shopList = shopList.filter((item) => item.id !== parseInt(id));

        saveToLocalStorage();
        document.querySelector(`.item[data-num='${id}']`).remove();
    }
});

const loadItems = () => {
    $items.innerHTML = ``;
    shopList.forEach((item) => {
        const itemElm = createItem(item);
        $items.appendChild(itemElm);
        id = id < item.id ? item.id : id;
    });
    if (id === -1) id = 0;
    else id++;
};
loadItems();
