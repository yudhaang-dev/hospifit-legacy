import { MapIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DeleteLocationDialog } from '@/features/client/components/delete-location-dialog';
import { LocationFormDialog } from '@/features/client/components/location-form-dialog';
import { resolveMaintenanceIntervalDays } from '@/features/client/lib/location-tree';
import type { LocationNode } from '@/features/client/lib/types';

type LocationTableProps = {
    siteId: number;
    locations: LocationNode[];
};

export function LocationTable({ siteId, locations }: LocationTableProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end-safe justify-between">
                <div>
                    <h2 className="text-lg font-medium">Lokasi</h2>
                    <p className="text-sm text-muted-foreground">
                        Susunan ruang fisik dalam Site ini (Gedung/Area/Ruang,
                        sedalam apa pun yang dibutuhkan).
                    </p>
                </div>
                <LocationFormDialog
                    siteId={siteId}
                    locations={locations}
                    trigger={
                        <Button>
                            <PlusIcon data-icon="inline-start" />
                            Tambah Lokasi
                        </Button>
                    }
                />
            </div>

            {locations.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MapIcon />
                        </EmptyMedia>
                        <EmptyTitle>Belum ada Lokasi</EmptyTitle>
                        <EmptyDescription>
                            Bangun struktur ruang untuk Site ini, mulai dari
                            level teratas.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Interval Perawatan</TableHead>
                            <TableHead>Geofence</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map((location) => {
                            const interval = resolveMaintenanceIntervalDays(
                                locations,
                                location,
                            );
                            const isInherited =
                                location.maintenance_interval_days === null &&
                                interval !== null;

                            return (
                                <TableRow key={location.id}>
                                    <TableCell
                                        className="font-medium"
                                        style={{
                                            paddingLeft: `${location.depth * 1.5 + 1}rem`,
                                        }}
                                    >
                                        {location.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {location.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {interval === null ? (
                                            '—'
                                        ) : (
                                            <span>
                                                {interval} hari
                                                {isInherited && (
                                                    <span className="text-muted-foreground">
                                                        {' '}
                                                        (warisan)
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {location.latitude !== null &&
                                        location.longitude !== null &&
                                        location.geofence_radius_m !== null ? (
                                            <Badge variant="outline">
                                                Override{' '}
                                                {location.geofence_radius_m} m
                                            </Badge>
                                        ) : (
                                            '—'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <LocationFormDialog
                                                siteId={siteId}
                                                locations={locations}
                                                location={location}
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <PencilIcon />
                                                    </Button>
                                                }
                                            />
                                            <DeleteLocationDialog
                                                locationId={location.id}
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Trash2Icon />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
