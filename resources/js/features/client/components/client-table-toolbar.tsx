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
import type { ClientIndexFilters } from '@/features/client/lib/types';
import { index } from '@/routes/backoffice/clients';

const PER_PAGE_OPTIONS = [10, 15, 25, 50] as const;

type ClientTableToolbarProps = {
    filters: ClientIndexFilters;
};

export function ClientTableToolbar({ filters }: ClientTableToolbarProps) {
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
                index.url(),
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
            index.url(),
            { ...filters, per_page: Number(value), page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama klien..."
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
