const $itemInput = document.getElementById("itemInput");
const $addBtn = document.getElementById("addBtn");
const $items = document.getElementById("items");

let shopList = JSON.parse(localStorage.getItem("shopList")) || [];
let id =
    shopList.length > 0 ? Math.max(...shopList.map((item) => item.id)) + 1 : 0;

$itemInput.focus();

const saveToLoacalStorage = () => {
    localStorage.setItem("shopList", JSON.stringify(shopList));
};

const creatItem = (item) => {
    const $li = document.createElement("li");
    $li.setAttribute("class", "item");
    $li.setAttribute("data-num", item.id);
    $li.innerHTML = `
        <span>${item.text}</span>
        <i class="deletBtn fa-solid fa-trash-can" data-id="${item.id}"></i>
    `;
    return $li;
};

const onAdd = () => {
    const text = $itemInput.value;
    if (text === "") {
        $itemInput.focus();
        return;
    }
    const newItem = { id: id++, text: text };
    shopList.push(newItem);
    saveToLoacalStorage();

    const item = creatItem(newItem);
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
        id = parseInt(id);
        shopList = shopList.filter((item) => item.id !== id);
        saveToLoacalStorage();

        const deleteItem = document.querySelector(`.item[data-num='${id}']`);
        deleteItem.remove();
    }
});

const loadItems = () => {
    $items.innerHTML = "";
    shopList.forEach((item) => {
        const itemElm = creatItem(item);
        $items.appendChild(itemElm);
    });
};
loadItems();
