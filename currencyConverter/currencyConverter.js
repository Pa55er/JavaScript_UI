const $currency_one = document.getElementById("currency-one");
const $currency_two = document.getElementById("currency-two");
const $amount_one = document.getElementById("amount-one");
const $amount_two = document.getElementById("amount-two");
const $swap = document.getElementById("swap");
const $rate = document.getElementById("rate");

let target_one = "USD";
let target_two = "KRW";
let list_one;

const getList = async (currency) => {
    let url = `https://open.exchangerate-api.com/v6/latest/${currency}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.rates;
};

const setSelect = (select, list, target) => {
    select.innerHTML = "";
    Object.keys(list).forEach((ele) => {
        const newOpt = document.createElement("option");
        newOpt.value = ele;
        newOpt.dataset.rate = list[ele];
        newOpt.innerHTML = ele;
        if (ele === target) newOpt.selected = true;
        select.appendChild(newOpt);
    });
};

const setLists = async () => {
    list_one = await getList(target_one);

    setSelect($currency_one, list_one, target_one);
    setSelect($currency_two, list_one, target_two);
};

const inputCalc = () => {
    $amount_two.value = $amount_one.value * list_one[target_two].toFixed(5);
    $rate.innerHTML = `1 ${target_one} = ${list_one[target_two]} ${target_two}`;
};

$currency_one.addEventListener("change", async () => {
    target_one = $currency_one.options[$currency_one.selectedIndex].value;
    await setLists();
    inputCalc();
});

$currency_two.addEventListener("change", async () => {
    target_two = $currency_two.options[$currency_two.selectedIndex].value;
    inputCalc();
});

$amount_one.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        $amount_two.value = $amount_one.value * list_one[target_two].toFixed(5);
    }
});

$swap.addEventListener("click", async () => {
    [target_one, target_two] = [target_two, target_one];
    await setLists();
    inputCalc();
});

setLists().then(() => {
    $amount_two.value = list_one[target_two];
    $rate.innerHTML = `1 ${target_one} = ${list_one[target_two]} ${target_two}`;
});
