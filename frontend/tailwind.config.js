/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./frontend/src/**/*.{js,jsx,ts,tsx}", // Adjust to your source files location
    ],
    theme: {
        extend: {
            keyframes: {
                "fade-in": {
                    from: {
                        opacity: "0",
                    },
                    to: {
                        opacity: "1",
                    },
                },
                "slide-in": {
                    from: {
                        opacity: "0",
                        transform: "translateY(-10px) scale(0.95)",
                    },
                    to: {
                        opacity: "1",
                        transform: "translateY(0) scale(1)",
                    },
                },
            },
            animation: {
                "fade-in": "fade-in 0.2s ease-out",
                "slide-in": "slide-in 0.2s ease-out",
            },
        },
    },
    plugins: [],
};
