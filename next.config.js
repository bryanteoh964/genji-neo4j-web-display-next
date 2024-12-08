/** @type {import('next').NextConfig} **/

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const nextConfig = (phase) => ({
	output: 'standalone',
	experimental: {
		scrollRestoration: true,
		appDir: true
	},
	pageExtensions: ['js', 'jsx']
		.map((extension) => {
			const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
			const prefixes = isDevServer ? ["dev", "prod"] : ["prod"];
			return prefixes.map((prefix) => `${prefix}.${extension}`);
		}).flat(),
	// allow next.js to load user avatar from google
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'googleusercontent.com'
		],
	}
})

module.exports = (phase) => (
	nextConfig(phase)
)
