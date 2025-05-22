// GET https://sillypost.net/static/games/sillyexchange.js?v=27

async function beanCount() {
    const response = await fetch("/beans");
    if (!response.ok) {
        console.log(response);
    }

    return await response.text();
}

async function seState() {
    const response = await fetch("/games/sillyexchange", {method: "POST"});
    if (!response.ok) {
        console.log(response);
        return null;
    }
    return await response.json();
}

async function seOwned() {
    const response = await fetch("/games/sillyexchange/owned", {method: "POST"});
    if (!response.ok) {
        console.log(response);
        return null;
    }
    return await response.text();
}

async function buySilly(count) {
    const response = await fetch(`/games/sillyexchange/buy/${count}`, {method: "POST"});
    if (!response.ok) {
        console.log(response);
        return false;
    }
    return true;
}

async function sellSilly(count) {
    const response = await fetch(`/games/sillyexchange/sell/${count}`, {method: "POST"});
    if (!response.ok) {
        console.log(response);
    }
}

function elmUpdateCount() {
    updateStats();
}

function updateCount(state) {
    let count_elm = document.getElementById("silly-count");
    let buy_elm = document.getElementById("silly-buy");
    let sell_elm = document.getElementById("silly-sell");
    beanCount().then(bc => {
        seOwned().then(owned => {
            // can we afford?
            if (state && owned) {
                let beancount = parseInt(bc);
                let buy_count = count_elm.value;
                let price = state.price;
                let owned_count = parseInt(owned);
                buy_elm.disabled = ((buy_count * price) > beancount) || (owned_count >= 1000);
            }
        })
    })
    seOwned().then(owned => {
        if (owned) {
            let owned_count = parseInt(owned);
            let sell_count = count_elm.value;
            sell_elm.disabled = (sell_count > owned_count);
        }
    })
}

function buy() {
    let count_elm = document.getElementById("silly-count");

    buySilly(count_elm.value).then(result => {
        if (!result) {
            console.log("error!");
        }
        window.location.reload();
    })
}

function sell() {
    let count_elm = document.getElementById("silly-count");

    sellSilly(count_elm.value).then(result => {
        if (!result) {
            console.log("error!");
        }
        window.location.reload();
    })
}

function updateStats() {
    seState().then(state => {
        if (state) {
            updateCount(state);
            let status_elm = document.getElementById("sillymarket-status");
            let text = "error";
            switch (state.status.toLowerCase()) {
                case "soover":
                    text = "its so over D:"
                    break;
                case "inshambles":
                    text = "in shambles!"
                    break;
                case "mid":
                    text = "mid :/"
                    break;
                case "soback":
                    text = "we're so back!!! :D"
                    break;
                case "swag":
                    text = "SWAG!!!! B)"
                    break;
            }
            status_elm.innerText = text;
            status_elm.classList.remove("soover");
            status_elm.classList.remove("inshambles");
            status_elm.classList.remove("mid");
            status_elm.classList.remove("soback");
            status_elm.classList.remove("swag");
            status_elm.classList.add(state.status.toLowerCase());
            let img_elms = document.getElementsByClassName("status-img")
            for (let i = 0; i < img_elms.length; i++) {
                img_elms[i].src = `/static/games/sillyexchange/${state.status.toLowerCase()}.png`;
            }

            let price_elm = document.getElementById("silly-price");
            price_elm.innerText = state.price.toString();

            seOwned().then(owned => {
                if (owned) {
                    let owned_elm = document.getElementById("sillies-owned");
                    owned_elm.innerText = owned;
                }
            })
        } else {
            window.location.href = "/games";
        }
    })
}

window.addEventListener("load", () => {
    updateStats();
    setInterval(updateStats, 20000);
})

