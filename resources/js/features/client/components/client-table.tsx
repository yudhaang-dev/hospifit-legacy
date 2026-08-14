import { Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ClientFormDialog } from '@/features/client/components/client-form-dialog';
import type { Client } from '@/features/client/lib/types';
import { show } from '@/routes/backoffice/clients';

type ClientTableProps = {
    clients: Client[];
};

export function ClientTable({ clients }: ClientTableProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <ClientFormDialog
                    trigger={
                        <Button>
                            <PlusIcon data-icon="inline-start" />
                            Tambah Klien
                        </Button>
                    }
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-0" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>
                                <Link
                                    href={show.url(client.id)}
                                    className="font-medium hover:underline"
                                >
                                    {client.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        client.status === 'active'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {client.status === 'active'
                                        ? 'Aktif'
                                        : 'Nonaktif'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <ClientFormDialog
                                    client={client}
                                    trigger={
                                        <Button variant="ghost" size="sm">
                                            Ubah
                                        </Button>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
