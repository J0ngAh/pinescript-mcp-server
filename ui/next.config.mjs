/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Add any experimental features here
  },
  // Use a different port to avoid conflicts
  devServer: {
    port: 3000, 
  },
};

export default nextConfig; 