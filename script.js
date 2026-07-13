const REPO = "csehviktor/portfolio"

const STAGGER_MULTIPLIER = 150; // ms per element
const RESET_TIMEOUT = 100;

async function sha() {
    const el = document.getElementById("sha");
    if (!el) return;

    try {
        const res = await fetch(`https://api.github.com/repos/${REPO}/commits?per_page=1`);
        if (!res.ok) throw new Error("repo unavailable");

        const [commit] = await res.json();

        const sha = commit?.sha;
        if (!sha) throw new Error("no commits found");

        el.textContent = sha.slice(0, 7);
    } catch (err) {
        el.textContent = "-";
    }
}
sha();

// theme switching
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-btn");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

toggleBtn?.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

// listen for system changes
prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
        const newSystemTheme = e.matches ? "dark" : "light";
        root.setAttribute("data-theme", newSystemTheme);
    }
});

// reveal animation
const revealEls = document.querySelectorAll(".reveal");

let timer = null;
let delay = 0;
let revealed = 0;

const observerOptions = {
    threshold: 0,
    root: null,
    rootMargin: "0px 0px -10% 0px", // triggers when element is 10% up from the bottom
};

const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // apply staggered delay if part of a batch
            if (delay > 0) entry.target.style.transitionDelay = `${delay * STAGGER_MULTIPLIER}ms`;
            entry.target.classList.add("in");

            // cleanup
            observer.unobserve(entry.target);

            revealed++;
            delay++;

            clearTimeout(timer);
            timer = setTimeout(() => {
                delay = 0;
            }, RESET_TIMEOUT);

            if (revealed === revealEls.length) observer.disconnect();
        }
    });
}, observerOptions);

revealEls.forEach(el => io.observe(el));
