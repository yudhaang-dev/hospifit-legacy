import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia({ ssr: false }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        VitePWA({
            registerType: 'prompt',
            // laravel-vite-plugin serves a Blade entry, not an HTML file Vite
            // transforms, so the plugin's HTML-based auto-injection doesn't
            // apply — the manifest link + registerSW script are added by
            // hand in resources/views/app.blade.php instead.
            injectRegister: false,
            manifest: {
                name: 'Hospifit',
                short_name: 'Hospifit',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#111827',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            // Install-prompt/manifest only — offline caching is a deliberate
            // MVP omission (ARCHITECTURE.md §1/§5), so precache nothing.
            workbox: {
                globPatterns: [],
            },
            devOptions: {
                enabled: false,
            },
        }),
    ],
});
