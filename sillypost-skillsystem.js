window.addEventListener('load', function() {
    let level_up = () => {
        fetch('/skills', {method: 'POST'}).then(res => {
            if (!res.ok || res.status === 404) {
            } else {
                res.json().then(json => {
                    let levelup_elm = document.createElement("div");
                    levelup_elm.id = "levelup";

                    let header_elm = document.createElement("h1");
                    let part1_span = document.createElement("span");
                    part1_span.innerText = "Congratulation! your ";
                    header_elm.appendChild(part1_span);
                    let icon = document.createElement("img");
                    icon.src = `/static/skills/${json.name}.png`;
                    header_elm.appendChild(icon);
                    let part2_span = document.createElement("span");
                    part2_span.innerText = ` ${json.display_name} has become more advanced!`;
                    header_elm.appendChild(part2_span);

                    levelup_elm.appendChild(header_elm);

                    let p_elm = document.createElement("p");
                    let part3_span = document.createElement("span");
                    part3_span.innerText = "your ";
                    p_elm.appendChild(part3_span);
                    let icon2 = document.createElement("img");
                    icon2.src = `/static/skills/${json.name}.png`;
                    p_elm.appendChild(icon2);
                    let part4_span = document.createElement("span");
                    part4_span.innerText = ` ${json.display_name} level is now ${json.new_level}!`;
                    p_elm.appendChild(part4_span);

                    levelup_elm.appendChild(p_elm);
                    document.body.appendChild(levelup_elm);

                    let fireworks_container = document.createElement("div");

                    let f1 = document.createElement("div");
                    f1.classList.add("fireworks");
                    f1.style.left = "5%";
                    let f2 = document.createElement("div");
                    f2.classList.add("fireworks");
                    f2.style.left = "20%";
                    let f3 = document.createElement("div");
                    f3.classList.add("fireworks");
                    f3.style.left = "50%";
                    let f4 = document.createElement("div");
                    f4.classList.add("fireworks");
                    f4.style.left = "80%";
                    let f5 = document.createElement("div");
                    f5.classList.add("fireworks");
                    f5.style.left = "95%";
                    fireworks_container.appendChild(f1);
                    fireworks_container.appendChild(f2);
                    fireworks_container.appendChild(f3);
                    fireworks_container.appendChild(f4);
                    fireworks_container.appendChild(f5);

                    fireworks_container.id = "fireworks-container";
                    document.body.appendChild(fireworks_container);

                    setTimeout(() => {
                        document.body.removeChild(levelup_elm);
                        document.body.removeChild(fireworks_container);
                        level_up();
                    }, 6000);
                })
            }
        });
    };
    setTimeout(level_up, 1000);
})
