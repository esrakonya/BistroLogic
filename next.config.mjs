/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pgbbpxljeaguupofaffo.supabase.co', // Kendi Supabase projenizin hostname'i
            port: '',
            pathname: '/storage/v1/object/public/product-images/**',
          },
        ],
    },
};

export default nextConfig;
