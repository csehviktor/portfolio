const REPO = "csehviktor/portfolio"

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

window.addEventListener("DOMContentLoaded", () => {
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

});
