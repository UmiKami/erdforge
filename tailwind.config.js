/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // "palette-100": "#C3E8BD",
                // "palette-200": "#9DDBAD",
                // "palette-300": "#8EB897",
                // "palette-400": "#5B7553",
                // "palette-500": "#040403",
                "palette-100": "#C1F6ED",
                "palette-200": "#3FD0C9",
                "palette-300": "#2EAF7D",
                "palette-400": "#449342",
                "palette-500": "#02353C",
            },
        },
    },
    plugins: [],
};

