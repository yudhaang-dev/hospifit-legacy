import { MapPinIcon, PencilIcon, PlusIcon } from 'lucide-react';
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
import { SiteFormDialog } from '@/features/client/components/site-form-dialog';
import type { Site } from '@/features/client/lib/types';

type SiteTableProps = {
    clientId: number;
    sites: Site[];
};

export function SiteTable({ clientId, sites }: SiteTableProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end-safe justify-between">
                <div>
                    <h2 className="text-lg font-medium">Site</h2>
                    <p className="text-sm text-muted-foreground">
                        Fasilitas yang dimiliki klien ini.
                    </p>
                </div>
                <SiteFormDialog
                    clientId={clientId}
                    trigger={
                        <Button>
                            <PlusIcon data-icon="inline-start" />
                            Tambah Site
                        </Button>
                    }
                />
            </div>
            {sites.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MapPinIcon />
                        </EmptyMedia>
                        <EmptyTitle>Belum ada Site</EmptyTitle>
                        <EmptyDescription>
                            Tambahkan fasilitas pertama untuk klien ini.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>Radius Geofence</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sites.map((site) => (
                            <TableRow key={site.id}>
                                <TableCell className="font-medium">
                                    {site.name}
                                </TableCell>
                                <TableCell>{site.address ?? '—'}</TableCell>
                                <TableCell>
                                    {site.geofence_radius_m} m
                                </TableCell>
                                <TableCell>
                                    <SiteFormDialog
                                        clientId={clientId}
                                        site={site}
                                        trigger={
                                            <Button variant="ghost" size="icon">
                                                <PencilIcon />
                                            </Button>
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
