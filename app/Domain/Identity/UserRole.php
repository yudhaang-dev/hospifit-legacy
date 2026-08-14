<?php

namespace App\Domain\Identity;

enum UserRole: string
{
    case Admin = 'admin';
    case OfficeStaff = 'office_staff';
    case FieldStaff = 'field_staff';
    case ClientAdmin = 'client_admin';
    case ClientStaff = 'client_staff';

    /**
     * Roles routed into the backoffice/* area.
     *
     * @return array<int, self>
     */
    public static function backoffice(): array
    {
        return [self::Admin, self::OfficeStaff];
    }

    /**
     * Roles routed into the field/* area.
     *
     * @return array<int, self>
     */
    public static function field(): array
    {
        return [self::FieldStaff];
    }

    /**
     * Roles routed into the client portal area.
     *
     * @return array<int, self>
     */
    public static function portal(): array
    {
        return [self::ClientAdmin, self::ClientStaff];
    }

    /**
     * Whether this role must always be scoped to a Client.
     */
    public function isClientRole(): bool
    {
        return in_array($this, self::portal(), true);
    }

    /**
     * The layout-area route prefix this role lands in after login.
     */
    public function areaPrefix(): string
    {
        return match (true) {
            in_array($this, self::backoffice(), true) => 'backoffice',
            in_array($this, self::field(), true) => 'field',
            default => 'portal',
        };
    }
}
