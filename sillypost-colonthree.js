function non_sillycode_text_length(text) {
    let counter = 0;

    let start_tag = false;
    let escape = false;
    let tag = "";
    for (let i = 0; i < text.length; i++) {
        if (escape) {
            escape = false;
            counter++;
        } else if (start_tag) {
            if (text[i] === "]") {
                const EMOTICONS = [":)", ":(", ":D", ":3", "D:", "B)", ";(", ";)"];
                if (EMOTICONS.includes(tag)) {
                    counter += 1;
                } else {
                    let starting_slash = "";
                    if (tag.startsWith("/")) {
                        tag = tag.slice(1);
                        starting_slash = "/";
                    }
                    if (tag === "b" || tag === "i" || tag === "u" || tag === "s" || tag === "url" || tag === "color" || (tag.startsWith("color") && tag.length === "color=#000000".length && starting_slash === "")) {
                        // valid tag
                        console.log(tag);
                    } else {
                        counter += ("[" + starting_slash + tag + "]").length;
                    }
                }
                start_tag = false;
                tag = "";
            } else {
                tag += text[i];
            }
        } else if (text[i] === "[") {
            start_tag = true;
        } else if (text[i] === "\\") {
            escape = true;
        } else {
            counter++;
        }
    }

    return counter;
}

function setupCounter() {
    let post_form = document.getElementById("new-post");
    let text_elm = post_form.getElementsByTagName("textarea")[0];
    text_elm.removeAttribute("maxlength");

    let counter_elm = document.createElement("span");
    counter_elm.innerText = "0/64";
    counter_elm.classList.add("message-counter");
    text_elm.parentNode.insertBefore(counter_elm, text_elm.nextSibling);

    text_elm.onkeyup =
        () => {
            let counter = non_sillycode_text_length(text_elm.value);
            counter_elm.innerText = `${counter}/64`;
            counter_elm.classList.remove("counter-too-long");
            if (counter > 64) {
                counter_elm.classList.add("counter-too-long");
            }
        };
}

window.addEventListener("load", function() {
    if (document.getElementById("new-post") !== null) {
        setupCounter();
    }

    // find all ctforms
    let ctforms = document.getElementsByClassName("ctform");
    for (let i = 0; i < ctforms.length; i++) {
        let ctform = ctforms[i];
        let action = ctform.action;
        let ctcount_elm = ctform.getElementsByTagName("span")[0];
        let button = ctform.getElementsByTagName("button")[0];
        ctform.onsubmit = (e) => {
            e.preventDefault();
            if (!button.disabled) {
                fetch(action, {method: "POST"}).then(res => {
                    if (!res.ok) {
                        console.log("FAILED TO CT");
                    } else {
                        button.disabled = true;
                        let count = parseInt(ctcount_elm.innerText);
                        ctcount_elm.innerText = (count + 1).toString();
                    }
                })
            }
        };
    }
})
