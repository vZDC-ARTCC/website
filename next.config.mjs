const {version} = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '5MB',
        }
    },
    output: 'standalone',
    publicRuntimeConfig: {
        version,
    },
};

export default nextConfig;
