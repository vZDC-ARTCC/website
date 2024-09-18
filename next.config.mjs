import config from './package.json' with {type: 'json'};

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
        },
        serverComponentsExternalPackages: ['mjml'],
    },
    output: 'standalone',
    publicRuntimeConfig: {
        version: config.version,
        author: config.author,
    },
};

export default nextConfig;
