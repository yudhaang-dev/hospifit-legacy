import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type BackofficeBreadcrumbItem = {
    label: string;
    href?: string;
};

/**
 * Collapsible breadcrumb for the backoffice header. The Client → Site →
 * Location hierarchy can nest arbitrarily deep (docs/ERD.md), so once a
 * trail exceeds `maxVisible`, everything except the first crumb and the
 * last two collapses behind a "…" dropdown, and every crumb's text is
 * capped with `truncate` so one long label can't blow out the header
 * width. On mobile the immediate-parent crumb also drops out — root + …
 * + current page is what fits a phone-width header — reachable again via
 * the ellipsis dropdown from `sm` up.
 */
export default function BackofficeBreadcrumb({
    items,
    maxVisible = 4,
}: {
    items: BackofficeBreadcrumbItem[];
    maxVisible?: number;
}) {
    const shouldCollapse = items.length > maxVisible;
    const head = items[0];
    const isHeadOnly = items.length === 1;
    const hidden = shouldCollapse ? items.slice(1, -2) : [];
    const tail = shouldCollapse ? items.slice(-2) : items.slice(1);

    return (
        <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="min-w-0">
                    {isHeadOnly || !head.href ? (
                        <BreadcrumbPage className="inline-block max-w-16 truncate align-bottom sm:max-w-28">
                            {head.label}
                        </BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink
                            asChild
                            className="inline-block max-w-16 truncate align-bottom sm:max-w-28"
                        >
                            <Link href={head.href}>{head.label}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>

                {shouldCollapse && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    aria-label="Tampilkan breadcrumb tersembunyi"
                                    className="flex items-center hover:text-foreground"
                                >
                                    <BreadcrumbEllipsis />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {hidden.map((crumb) => (
                                        <DropdownMenuItem
                                            key={crumb.label}
                                            asChild
                                        >
                                            <Link href={crumb.href ?? '#'}>
                                                {crumb.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </>
                )}

                {tail.map((crumb, index) => {
                    const isLast = index === tail.length - 1;
                    // The second-to-last crumb (the immediate parent) is
                    // dropped below `sm` — on a phone-width header, root + …
                    // + current page is what fits; the parent stays reachable
                    // via the ellipsis dropdown at `sm` and up.

                    return (
                        <Fragment key={crumb.label}>
                            <BreadcrumbSeparator
                                className={cn(!isLast && 'hidden sm:flex')}
                            />
                            <BreadcrumbItem
                                className={cn(
                                    'min-w-0',
                                    !isLast && 'hidden sm:inline-flex',
                                )}
                            >
                                {isLast || !crumb.href ? (
                                    <BreadcrumbPage className="inline-block max-w-28 truncate align-bottom sm:max-w-40">
                                        {crumb.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        asChild
                                        className="inline-block max-w-20 truncate align-bottom sm:max-w-32"
                                    >
                                        <Link href={crumb.href}>
                                            {crumb.label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
