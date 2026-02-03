/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            screens: {
                'xs': '320px',
                'sm-mobile': '360px',
            },
            colors: {
                primary: {
                    DEFAULT: '#3F51B5', // Indigo 500
                    50: '#E8EAF6',
                    100: '#C5CAE9',
                    600: '#3949AB',
                    700: '#303F9F',
                },
                background: {
                    light: '#F6F6F8',
                    dark: '#14161E'
                },
                surface: {
                    light: '#FFFFFF',
                    dark: '#1E212B'
                },
                success: '#4CAF50',
                gray: {
                    300: '#D1D5DB' // Explicitly ensuring this matches user request if needed, though standard gray-300 is this.
                }
            },
            fontFamily: {
                display: ['Manrope', 'sans-serif'],
            },
            borderRadius: {
                'xl': '0.75rem', // 12px
                '2xl': '1rem',    // 16px
            }
        }
    },
    plugins: [],
}
