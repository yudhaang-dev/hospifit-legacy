export type ClientStatus = 'active' | 'inactive';

export type Client = {
    id: number;
    name: string;
    status: ClientStatus;
};

export type Site = {
    id: number;
    client_id: number;
    name: string;
    address: string | null;
    latitude: string;
    longitude: string;
    geofence_radius_m: number;
};
