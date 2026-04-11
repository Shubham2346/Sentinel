import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import http from 'http'
import https from 'https'

const corsProxyPlugin = () => ({
  name: 'cors-proxy',
  configureServer(server: any) {
    server.middlewares.use('/api/proxy', (req: any, res: any) => {
      const targetUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
      if (!targetUrl) {
        res.statusCode = 400;
        return res.end('Missing url parameter');
      }
      
      try {
        const parsedUrl = new URL(targetUrl.trim());
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        client.get(parsedUrl, (targetRes: any) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          if (targetRes.headers['content-type']) {
            res.setHeader('Content-Type', targetRes.headers['content-type']);
          }
          targetRes.pipe(res);
        }).on('error', (err: any) => {
          console.error("Proxy client error:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end(err.message);
          }
        });
      } catch (err: any) {
        console.error("Invalid proxy target URL:", targetUrl, err);
        res.statusCode = 400;
        res.end('Invalid target URL string');
      }
    });
  }
})

export default defineConfig({
  plugins: [
    react(),
    corsProxyPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sentinel',
        short_name: 'Sentinel',
        description: 'AI-powered assistive vision for accessibility',
        theme_color: '#3b82f6',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})