import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import type { PaginationLink as PaginationLinkData } from '@/features/client/lib/types';
import { cn } from '@/lib/utils';

type ClientPaginationProps = {
    links: PaginationLinkData[];
};

/**
 * Renders Laravel's ready-made paginator `links` array (prev/next + numbered
 * pages + "..." gaps already resolved server-side) as Inertia navigation
 * styled with the shadcn Pagination look.
 */
export function ClientPagination({ links }: ClientPaginationProps) {
    // Just prev + current + next means there's only a single page.
    if (links.length <= 3) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                {links.map((link, index) => (
                    <PaginationItem key={index}>
                        {link.url === null ? (
                            <span
                                className={cn(
                                    buttonVariants({
                                        variant: 'ghost',
                                        size: 'icon',
                                    }),
                                    'pointer-events-none text-muted-foreground',
                                )}
                            >
                                {stripLabel(link.label)}
                            </span>
                        ) : (
                            <Link
                                href={link.url}
                                preserveScroll
                                className={cn(
                                    buttonVariants({
                                        variant: link.active
                                            ? 'outline'
                                            : 'ghost',
                                        size: 'icon',
                                    }),
                                )}
                            >
                                {stripLabel(link.label)}
                            </Link>
                        )}
                    </PaginationItem>
                ))}
            </PaginationContent>
        </Pagination>
    );
}

/**
 * Laravel's paginator labels arrive as `&laquo; Previous` / `Next &raquo;`
 * (and `...` for gaps) — strip the HTML entities, keep the rest as-is.
 */
function stripLabel(label: string): string {
    return label.replace(/&laquo;|&raquo;/g, '').trim();
}
