import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				"primary-content": "#d2e2ff", // Light blue content on primary background
				"muted-foreground": "#d1d5db", // Light gray foreground for muted elements
				"secondary-content": "#150f00", // Dark brown content on secondary background
				"accent-content": "#16150e", // Dark olive content on accent background
				neutral: "#f5f5f4", // Light neutral background
				"neutral-content": "#151514", // Dark content on neutral background
				"base-100": "#111827", // Dark blue-gray base background
				"base-200": "#0d1320", // Darker blue-gray base background
				"base-300": "#090f1a", // Darkest blue-gray base background
				"base-content": "#c9cbcf", // Light gray content on base background
				info: "#a8a29e", // Warm gray for informational elements
				"info-content": "#0a0a09", // Almost black content on info background
				success: "#22c55e", // Green for success messages
				"success-content": "#000e03", // Very dark green content on success background
				warning: "#fbbf24", // Yellow for warnings
				"warning-content": "#150d00", // Dark brown content on warning background
				error: "#dc2626", // Red for error messages
				"error-content": "#ffd9d4", // Light peach content on error background

				border: "hsl(210, 20%, 25%)", // Dark gray for borders
				input: "hsl(210, 20%, 20%)", // Slightly lighter dark gray for inputs
				ring: "hsl(210, 20%, 50%)", // Medium gray for focus rings
				background: "hsl(210, 20%, 10%)", // Very dark blue-gray background
				foreground: "hsl(0, 0%, 100%)", // Pure white text

				primary: {
					DEFAULT: "#2563eb", // Bright blue for primary actions
					foreground: "#ffffff", // White text on primary buttons
				},

				secondary: {
					DEFAULT: "#facc15", // Yellow for secondary actions
					foreground: "#150f00", // Dark brown text on secondary buttons
				},

				destructive: {
					DEFAULT: "#dc2626", // Bright red for destructive actions
					foreground: "#ffffff", // White text on destructive buttons
				},

				muted: {
					DEFAULT: "#4b5563", // Dark gray for muted elements
					foreground: "#d1d5db", // Light gray text on muted elements
				},

				accent: {
					DEFAULT: "#fef9c3", // Pale yellow for accents
					foreground: "#16150e", // Dark olive text on accents
				},

				popover: {
					DEFAULT: "#111827", // Dark blue-gray for popovers
					foreground: "#c9cbcf", // Light gray text in popovers
				},

				card: {
					DEFAULT: "#0d1320", // Darker blue-gray for cards
					foreground: "#c9cbcf", // Light gray text on cards
				},

				borderRadius: {
					lg: "var(--radius)",
					md: "calc(var(--radius) - 2px)",
					sm: "calc(var(--radius) - 4px)",
				},
				keyframes: {
					"accordion-down": {
						from: { height: "0" },
						to: { height: "var(--radix-accordion-content-height)" },
					},
					"accordion-up": {
						from: { height: "var(--radix-accordion-content-height)" },
						to: { height: "0" },
					},
				},
				animation: {
					"accordion-down": "accordion-down 0.2s ease-out",
					"accordion-up": "accordion-up 0.2s ease-out",
				},
			},
		},
	},
	plugins: [require("daisyui"), require("tailwindcss-animate")],
} satisfies Config;

export default config;
