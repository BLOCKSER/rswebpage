function physicsCell(element, options = {}) {
    const rect = element.getBoundingClientRect();

    const clone = element.cloneNode(true);

    clone.className = element.className;
    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.margin = "0";
    clone.style.zIndex = "10000";
    clone.style.pointerEvents = "none";
    clone.style.boxSizing = "border-box";

    document.body.appendChild(clone);

    element.style.visibility = "hidden";

    let x = rect.left;
    let y = rect.top;

    let vx = options.vx ?? 0;
    let vy = options.vy ?? 0;

    let gravity = options.gravity ?? 0.65;
    let rotation = 0;
    let rotationSpeed = options.rotationSpeed ?? 0;

    let mode = options.mode || "fall";

    let paneHit = false;
    let slideSpeed = 0;

    let lastTime = performance.now();

    function update(time) {
        const delta = Math.min(
            (time - lastTime) / 16.67,
            2
        );

        lastTime = time;

        if (mode === "fall") {
            vx *= Math.pow(0.995, delta);

            vy += gravity * delta;

            x += vx * delta;
            y += vy * delta;

            rotation += rotationSpeed * delta;
        }

        if (mode === "bomb") {
            if (!paneHit) {
                vx *= Math.pow(0.998, delta);

                vy += gravity * 0.35 * delta;

                x += vx * delta;
                y += vy * delta;

                rotation += rotationSpeed * delta;

                if (y > window.innerHeight * 0.48) {
                    paneHit = true;

                    createGlassBreak(
                        window.innerWidth * 0.5,
                        window.innerHeight * 0.5
                    );

                    vx = 0;
                    vy = 0;
                    slideSpeed = 0.25;
                }
            } else {
                slideSpeed += 0.025 * delta;

                y += slideSpeed * delta;

                rotation += rotationSpeed * 0.15 * delta;

                if (y > window.innerHeight * 0.62) {
                    mode = "fall";

                    vx = -1.2;
                    vy = 1;
                    gravity = 0.7;
                    rotationSpeed = 3;
                }
            }
        }

        clone.style.transform =
            `translate3d(${x - rect.left}px, ${y - rect.top}px, 0)
             rotate(${rotation}deg)`;

        if (
            x + rect.width < -150 ||
            x > window.innerWidth + 150 ||
            y > window.innerHeight + 150
        ) {
            clone.remove();
            return;
        }

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function createGlassBreak(x, y) {
    const pane = document.createElement("div");

    pane.className = "glass_break";

    pane.style.left = `${x}px`;
    pane.style.top = `${y}px`;

    document.body.appendChild(pane);

    const cracks = [
        "M0 0 L-35 -45 L-70 -70",
        "M0 0 L45 -30 L75 -65",
        "M0 0 L60 5 L100 -15",
        "M0 0 L35 45 L65 75",
        "M0 0 L-25 55 L-55 95",
        "M0 0 L-55 10 L-95 35",
        "M0 0 L-10 -65 L10 -110"
    ];

    cracks.forEach(path => {
        const crack = document.createElement("div");

        crack.className = "glass_crack";

        crack.style.setProperty(
            "--crack",
            path
        );

        pane.appendChild(crack);
    });

    pane.animate(
        [
            {
                opacity: 0,
                transform: "translate(-50%, -50%) scale(0.7)"
            },
            {
                opacity: 1,
                transform: "translate(-50%, -50%) scale(1.05)"
            },
            {
                opacity: 1,
                transform: "translate(-50%, -50%) scale(1)"
            }
        ],
        {
            duration: 180,
            easing: "ease-out"
        }
    );

    setTimeout(() => {
        pane.animate(
            [
                {
                    opacity: 1
                },
                {
                    opacity: 0
                }
            ],
            {
                duration: 500,
                easing: "ease-out"
            }
        );

        setTimeout(() => {
            pane.remove();
        }, 500);
    }, 700);
}

function createPixelBurst(element, amount = 10) {
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < amount; i++) {
        const pixel = document.createElement("div");

        pixel.className = "pixel_particle";

        pixel.style.position = "fixed";
        pixel.style.left =
            `${rect.left + rect.width / 2}px`;
        pixel.style.top =
            `${rect.top + rect.height / 2}px`;

        const size = Math.floor(Math.random() * 5) + 2;

        pixel.style.width = `${size}px`;
        pixel.style.height = `${size}px`;

        pixel.style.zIndex = "10001";

        document.body.appendChild(pixel);

        let x = rect.left + rect.width / 2;
        let y = rect.top + rect.height / 2;

        let vx = (Math.random() - 0.5) * 10;
        let vy = -Math.random() * 9;

        let rotation = 0;
        let rotationSpeed =
            (Math.random() - 0.5) * 15;

        let lastTime = performance.now();

        function update(time) {
            const delta = Math.min(
                (time - lastTime) / 16.67,
                2
            );

            lastTime = time;

            vy += 0.6 * delta;

            vx *= Math.pow(0.985, delta);

            x += vx * delta;
            y += vy * delta;

            rotation += rotationSpeed * delta;

            pixel.style.transform =
                `translate3d(${x}px, ${y}px, 0)
                 rotate(${rotation}deg)`;

            if (
                x < -100 ||
                x > window.innerWidth + 100 ||
                y > window.innerHeight + 100
            ) {
                pixel.remove();
                return;
            }

            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }
}

function numberAnimation(element) {
    element.animate(
        [
            {
                transform: "scale(0.2) rotate(-20deg)",
                opacity: 0
            },
            {
                transform: "scale(1.3) rotate(8deg)",
                opacity: 1
            },
            {
                transform: "scale(1) rotate(0deg)",
                opacity: 1
            }
        ],
        {
            duration: 220,
            easing: "cubic-bezier(.2,1.5,.4,1)"
        }
    );

    createPixelBurst(element, 6);

    physicsCell(element, {
        vx: (Math.random() - 0.5) * 5,
        vy: -2,
        gravity: 0.7,
        rotationSpeed:
            (Math.random() - 0.5) * 10,
        mode: "fall"
    });
}

function flagAnimation(element) {
    element.animate(
        [
            {
                transform: "scale(0.2) rotate(-35deg)",
                opacity: 0
            },
            {
                transform: "scale(1.35) rotate(12deg)",
                opacity: 1
            },
            {
                transform: "scale(0.95) rotate(-4deg)"
            },
            {
                transform: "scale(1) rotate(0deg)"
            }
        ],
        {
            duration: 280,
            easing: "cubic-bezier(.2,1.4,.4,1)"
        }
    );

    createPixelBurst(element, 5);
}

function mineExplosion(element) {
    element.animate(
        [
            {
                transform: "scale(1)",
                filter: "brightness(1)"
            },
            {
                transform: "scale(1.7)",
                filter: "brightness(3)"
            },
            {
                transform: "scale(0.7)",
                filter: "brightness(5)"
            },
            {
                transform: "scale(1)",
                filter: "brightness(1)"
            }
        ],
        {
            duration: 400,
            easing: "cubic-bezier(.2,.8,.3,1)"
        }
    );

    createPixelBurst(element, 30);

    setTimeout(() => {
        physicsCell(element, {
            vx: (Math.random() - 0.5) * 5,
            vy: -13,
            gravity: 0.3,
            rotationSpeed:
                (Math.random() - 0.5) * 14,
            mode: "bomb"
        });
    }, 100);
}

function resetAnimation() {
    const grid =
        document.querySelector(".minesweeper_grid");

    if (!grid) {
        return;
    }

    grid.animate(
        [
            {
                opacity: 0,
                transform:
                    "translate(-50%, -50%) scale(0.92)"
            },
            {
                opacity: 1,
                transform:
                    "translate(-50%, -50%) scale(1.03)"
            },
            {
                opacity: 1,
                transform:
                    "translate(-50%, -50%) scale(1)"
            }
        ],
        {
            duration: 350,
            easing: "cubic-bezier(.2,1.3,.4,1)"
        }
    );
}

window.numberAnimation = numberAnimation;
window.flagAnimation = flagAnimation;
window.mineExplosion = mineExplosion;
window.resetAnimation = resetAnimation;