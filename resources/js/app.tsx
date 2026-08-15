import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

type FlashProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};

// Global flash-message → toast bridge. Any backend redirect that flashes
// `success`/`error` to the session (shared as `flash` in
// HandleInertiaRequests) surfaces here automatically — wired once, for
// every current and future page, no per-page/per-layout plumbing needed.
router.on('success', (event) => {
    const { flash } = event.detail.page.props as FlashProps;

    if (flash?.success) {
        toast.success(flash.success);
    }

    if (flash?.error) {
        toast.error(flash.error);
    }
});

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
        createRoot(el).render(
            <>
                <App {...props} />
                <Toaster richColors />
            </>,
        );
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
