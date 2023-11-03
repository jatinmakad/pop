/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
	reactStrictMode: false,
	eslint: { ignoreDuringBuilds: true },
	images: {
		unoptimized: true,
	},
};

module.exports = nextConfig;
