import { useEffect, useState } from 'react';
import type { ComboboxOption } from '@/components/ui/combobox';
import { Combobox } from '@/components/ui/combobox';
import { Field, FieldLabel } from '@/components/ui/field';
import { search as searchClients } from '@/routes/backoffice/clients';
import { search as searchLocations } from '@/routes/backoffice/locations';
import { search as searchSites } from '@/routes/backoffice/sites';

export type LocationPickerValue = {
    clientId: number | null;
    siteId: number | null;
    locationId: number | null;
};

type SearchResult = { id: number; name: string; depth?: number };

type LocationPickerProps = {
    value: LocationPickerValue;
    onChange: (value: LocationPickerValue) => void;
    /**
     * Prefixes the three field ids — the filter bar and `CreateAssetDialog`
     * can both have a `LocationPicker` mounted at once (dialog open on top
     * of the filter bar), so each instance needs distinct DOM ids.
     */
    idPrefix?: string;
};

/**
 * Cascading Client → Site → Location searchable-Combobox picker. Backed by
 * the JSON typeahead endpoints added alongside this component — no
 * query/state library, plain debounced `fetch()`, matching this project's
 * deliberate "no client-state/query library" stance. Used both by the
 * global Asset list's filter bar (clicking a selected option again clears
 * it, so "no filter" is always reachable) and `CreateAssetDialog` (which
 * gates the rest of its form behind `locationId !== null` itself — this
 * component doesn't need to know which context it's in).
 */
export function LocationPicker({
    value,
    onChange,
    idPrefix = 'location-picker',
}: LocationPickerProps) {
    const clientOptions = useSearchOptions(
        searchClients.url(),
        {},
        value.clientId,
    );
    const siteOptions = useSearchOptions(
        searchSites.url(),
        value.clientId ? { client_id: value.clientId } : null,
        value.siteId,
    );
    const locationOptions = useSearchOptions(
        searchLocations.url(),
        value.siteId ? { site_id: value.siteId } : null,
        value.locationId,
    );

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field>
                <FieldLabel htmlFor={`${idPrefix}-client`}>Klien</FieldLabel>
                <Combobox
                    id={`${idPrefix}-client`}
                    options={clientOptions.options}
                    value={value.clientId?.toString() ?? null}
                    onValueChange={(next) =>
                        onChange({
                            clientId: next ? Number(next) : null,
                            siteId: null,
                            locationId: null,
                        })
                    }
                    onSearchChange={clientOptions.setQuery}
                    loading={clientOptions.loading}
                    placeholder="Pilih klien..."
                    searchPlaceholder="Cari klien..."
                />
            </Field>
            <Field data-disabled={value.clientId === null}>
                <FieldLabel htmlFor={`${idPrefix}-site`}>Site</FieldLabel>
                <Combobox
                    id={`${idPrefix}-site`}
                    options={siteOptions.options}
                    value={value.siteId?.toString() ?? null}
                    onValueChange={(next) =>
                        onChange({
                            ...value,
                            siteId: next ? Number(next) : null,
                            locationId: null,
                        })
                    }
                    onSearchChange={siteOptions.setQuery}
                    loading={siteOptions.loading}
                    disabled={value.clientId === null}
                    placeholder={
                        value.clientId === null
                            ? 'Pilih klien dahulu'
                            : 'Pilih site...'
                    }
                    searchPlaceholder="Cari site..."
                />
            </Field>
            <Field data-disabled={value.siteId === null}>
                <FieldLabel htmlFor={`${idPrefix}-location`}>Lokasi</FieldLabel>
                <Combobox
                    id={`${idPrefix}-location`}
                    options={locationOptions.options}
                    value={value.locationId?.toString() ?? null}
                    onValueChange={(next) =>
                        onChange({
                            ...value,
                            locationId: next ? Number(next) : null,
                        })
                    }
                    onSearchChange={locationOptions.setQuery}
                    loading={locationOptions.loading}
                    disabled={value.siteId === null}
                    placeholder={
                        value.siteId === null
                            ? 'Pilih site dahulu'
                            : 'Pilih lokasi...'
                    }
                    searchPlaceholder="Cari lokasi..."
                />
            </Field>
        </div>
    );
}

/**
 * Debounced (300ms, matching `ClientTableToolbar`'s existing debounce
 * convention) typeahead fetch against one of the JSON search endpoints,
 * plus an id-resolve fetch to re-hydrate the currently selected option's
 * label (e.g. when filters are restored from the URL on page load) — the
 * selected record might otherwise fall outside the first page of
 * name-sorted results.
 */
function useSearchOptions(
    endpointUrl: string,
    /** Extra scoping params (e.g. `client_id`), or `null` while disabled. */
    scopeParams: Record<string, number> | null,
    selectedId: number | null,
) {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<ComboboxOption[]>([]);
    const [loading, setLoading] = useState(false);
    const scopeKey = scopeParams === null ? null : JSON.stringify(scopeParams);

    // Re-hydrate the selected option's label if it isn't already present
    // (e.g. right after `value` is set from a URL filter on first load).
    useEffect(() => {
        if (scopeParams === null || selectedId === null) {
            return;
        }

        if (options.some((option) => option.value === selectedId.toString())) {
            return;
        }

        const params = new URLSearchParams({
            ...toStringRecord(scopeParams),
            id: selectedId.toString(),
        });

        fetch(`${endpointUrl}?${params.toString()}`, {
            headers: { Accept: 'application/json' },
        })
            .then((response) => response.json())
            .then((results: SearchResult[]) => setOptions(toOptions(results)))
            .catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId, scopeKey]);

    // Debounced live search — no query/debounce library, matching the
    // project's deliberate "no client-state/query library" stance.
    useEffect(() => {
        if (scopeParams === null) {
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);

            const params = new URLSearchParams({
                ...toStringRecord(scopeParams),
                ...(query ? { q: query } : {}),
            });

            fetch(`${endpointUrl}?${params.toString()}`, {
                headers: { Accept: 'application/json' },
            })
                .then((response) => response.json())
                .then((results: SearchResult[]) =>
                    setOptions(toOptions(results)),
                )
                .catch(() => {})
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, scopeKey]);

    // Disabled levels (no scope yet, e.g. Site before a Client is chosen)
    // show no options — derived here rather than reset via a synchronous
    // `setOptions([])` inside the effect above, which would trigger a
    // cascading render.
    return {
        options: scopeParams === null ? [] : options,
        setQuery,
        loading,
    };
}

function toStringRecord(
    params: Record<string, number>,
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, value.toString()]),
    );
}

function toOptions(results: SearchResult[]): ComboboxOption[] {
    return results.map((result) => ({
        value: result.id.toString(),
        label:
            result.depth !== undefined
                ? `${'—'.repeat(result.depth)} ${result.name}`.trim()
                : result.name,
    }));
}
