import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob<ComponentType>('./pages/**/*.tsx', {
                import: 'default',
            }),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// Registers the service worker for PWA installability only — offline
// caching is a deliberate MVP omission (see vite.config.ts's empty
// workbox.globPatterns), so this SW precaches nothing.
if (import.meta.env.PROD) {
    void import('virtual:pwa-register').then(({ registerSW }) => {
        registerSW({ immediate: true });
    });
}
