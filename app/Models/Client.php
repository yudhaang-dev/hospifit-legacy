<?php

namespace App\Models;

use App\Domain\Client\ClientStatus;
use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A customer organization. Owns one or more Sites and the Client-side Users
 * who log in.
 *
 * @property int $id
 * @property string $name
 * @property ClientStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'status'])]
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return HasMany<Site, $this>
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * Scope a query to only the client(s) the given user is allowed to see.
     *
     * @param  Builder<Client>  $query
     * @return Builder<Client>
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $user->role->isClientRole()
            ? $query->whereKey($user->client_id)
            : $query;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ClientStatus::class,
        ];
    }
}
