/** @type {import('next').NextConfig} */

const REDIRECT_PATHS = [
	'/',
	'/about',
]

async function redirects() {
	return [
		{
			source: '/about',
			destination: '/password-protect',
			permanent: false,
		},
	]
}

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const nextConfig = (phase) => ({
	experimental: {
		scrollRestoration: true,  
	},
	pageExtensions: ['js', 'jsx']
		.map((extension) => {
			const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
			const prefixes = isDevServer ? ["dev", "prod"] : ["prod"];
			return prefixes.map((prefix) => `${prefix}.${extension}`);
		}).flat(),
})

module.exports = (phase) => (
	nextConfig(phase)
)