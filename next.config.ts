/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '', // Sin puerto, ya que HTTPS usa el predeterminado
        pathname: '/**', // Coincide con las rutas específicas de imágenes
      },
    ],
  },
};

module.exports = nextConfig;
