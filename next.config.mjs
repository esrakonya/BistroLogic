/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'aihhyohcvupoohjtjugn.supabase.co',
            port: '',
            pathname: '/storage/v1/object/public/product-images/**',
          },
        ],
    },
};

export default nextConfig;
