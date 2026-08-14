import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { SiteIndexFilters } from '@/features/client/lib/types';
import { show } from '@/routes/backoffice/clients';

const PER_PAGE_OPTIONS = [10, 15, 25, 50] as const;

type SiteTableToolbarProps = {
    clientId: number;
    filters: SiteIndexFilters;
};

export function SiteTableToolbar({ clientId, filters }: SiteTableToolbarProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const isFirstRender = useRef(true);

    // Debounced live search — no query/debounce library, matching the
    // project's deliberate "no client-state/query library" stance.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                show.url(clientId),
                {
                    ...filters,
                    search: search || undefined,
                    page: 1,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const setPerPage = (value: string) => {
        router.get(
            show.url(clientId),
            { ...filters, per_page: Number(value), page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama site..."
                className="max-w-sm"
            />
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Baris</span>
                <Select
                    value={String(filters.per_page)}
                    onValueChange={setPerPage}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {PER_PAGE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
