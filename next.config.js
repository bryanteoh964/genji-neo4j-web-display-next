/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		scrollRestoration: true,  
	},
	redirects,
}

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

module.exports = nextConfig