function createParticle(x, y, content, className, options = {}) {
    const particle = document.createElement("div");

    particle.className = `physics_particle ${className}`;
    particle.textContent = content;

    particle.style.position = "fixed";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.margin = "0";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "99999";

    document.body.appendChild(particle);

    let px = 0;
    let py = 0;

    let vx = options.vx ?? 0;
    let vy = options.vy ?? 0;

    let gravity = options.gravity ?? 0.5;
    let friction = options.friction ?? 0.99;

    let rotation = options.rotation ?? 0;
    let rotationSpeed =
        options.rotationSpeed ??
        (Math.random() - 0.5) * 12;

    let lastTime = performance.now();

    function update(time) {
        const delta = Math.min(
            (time - lastTime) / 16.67,
            2
        );

        lastTime = time;

        vx *= Math.pow(friction, delta);
        vy += gravity * delta;

        px += vx * delta;
        py += vy * delta;

        rotation += rotationSpeed * delta;

        particle.style.transform =
            `translate3d(${px}px, ${py}px, 0) rotate(${rotation}deg)`;

        const rect = particle.getBoundingClientRect();

        if (
            rect.bottom < -100 ||
            rect.top > window.innerHeight + 100 ||
            rect.right < -100 ||
            rect.left > window.innerWidth + 100
        ) {
            particle.remove();
            return;
        }

        requestAnimationFrame(update);
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(update);
    });

    return particle;
}

function createPixelBurst(element, amount = 12) {
    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < amount; i++) {
        const size = Math.floor(Math.random() * 5) + 3;

        const particle = createParticle(
            centerX - size / 2,
            centerY - size / 2,
            "",
            "pixel_particle",
            {
                vx: (Math.random() - 0.5) * 14,
                vy: -Math.random() * 10 - 2,
                gravity: 0.65,
                friction: 0.985,
                rotation: Math.random() * 360
            }
        );

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
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

    createPixelBurst(element, 7);
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

function throwNearbyNumbers(element) {
    const grid = document.querySelector(".minesweeper_grid");

    if (!grid) {
        return;
    }

    const explosion = element.getBoundingClientRect();

    const explosionX =
        explosion.left + explosion.width / 2;

    const explosionY =
        explosion.top + explosion.height / 2;

    const cells = grid.querySelectorAll(
        ".mine_cell.revealed"
    );

    cells.forEach(cell => {
        if (
            !cell.textContent ||
            cell.textContent === "💣"
        ) {
            return;
        }

        const rect = cell.getBoundingClientRect();

        const cellX =
            rect.left + rect.width / 2;

        const cellY =
            rect.top + rect.height / 2;

        const dx = cellX - explosionX;
        const dy = cellY - explosionY;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance > 180) {
            return;
        }

        const directionX =
            distance === 0 ? 0 : dx / distance;

        const directionY =
            distance === 0 ? -1 : dy / distance;

        const power =
            Math.max(4, 12 - distance / 20);

        const particle = createParticle(
            cellX - 6,
            cellY - 8,
            cell.textContent,
            "number_particle",
            {
                vx:
                    directionX * power +
                    (Math.random() - 0.5) * 4,

                vy:
                    directionY * power -
                    Math.random() * 5,

                gravity: 0.6,
                friction: 0.985,

                rotation:
                    Math.random() * 30 - 15,

                rotationSpeed:
                    (Math.random() - 0.5) * 15
            }
        );

        particle.style.fontSize =
            `${Math.max(12, rect.width * 0.45)}px`;

        particle.style.fontWeight = "bold";

        cell.style.visibility = "hidden";
    });
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

    createPixelBurst(element, 35);

    throwNearbyNumbers(element);
}

function resetAnimation() {
    const grid = document.querySelector(
        ".minesweeper_grid"
    );

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