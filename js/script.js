window.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("theme-btn");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    toggleBtn?.addEventListener("click", () => {
        const isDark = root.getAttribute("data-theme") === "dark";
        const newTheme = isDark ? "light" : "dark";

        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    prefersDark.addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            const newSystemTheme = e.matches ? "dark" : "light";
            root.setAttribute("data-theme", newSystemTheme);
        }
    });

});
