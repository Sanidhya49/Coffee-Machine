/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                coffee: {
                    50: '#F3F2F1', // Cream background
                    100: '#E6E2DE',
                    200: '#D5CEC4',
                    500: '#7C6656',
                    600: '#6A5648',
                    700: '#5C4A3D',
                    800: '#4A3B32', // Deep coffee brown
                    900: '#3A2E27',
                }
            }
        },
    },
    plugins: [],
}
