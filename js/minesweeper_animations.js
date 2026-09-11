function createParticle(x, y, content, className, options = {}) {
    const particle = document.createElement("div");

    particle.className = `physics_particle ${className}`;
    particle.textContent = content;

    document.body.appendChild(particle);

    let px = x;
    let py = y;

    let vx = options.vx ?? (Math.random() - 0.5) * 8;
    let vy = options.vy ?? (-Math.random() * 8 - 2);

    let gravity = options.gravity ?? 0.45;
    let friction = options.friction ?? 0.99;

    let rotation = options.rotation ?? 0;
    let rotationSpeed =
        options.rotationSpeed ??
        (Math.random() - 0.5) * 12;

    let lastTime = performance.now();

    particle.style.left = "0px";
    particle.style.top = "0px";

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

    particle.style.transform =
        `translate3d(${px}px, ${py}px, 0) rotate(${rotation}deg)`;

    requestAnimationFrame(update);

    return particle;
}

function createPixelBurst(element, amount = 12) {
    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < amount; i++) {
        const pixelSize = Math.floor(Math.random() * 5) + 3;

        const particle = createParticle(
            centerX - pixelSize / 2,
            centerY - pixelSize / 2,
            "",
            "pixel_particle",
            {
                vx: (Math.random() - 0.5) * 10,
                vy: -Math.random() * 8 - 1,
                gravity: 0.65,
                friction: 0.985,
                rotation: Math.random() * 360
            }
        );

        particle.style.width = `${pixelSize}px`;
        particle.style.height = `${pixelSize}px`;
    }
}