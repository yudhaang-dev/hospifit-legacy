<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        User::factory()->officeStaff()->create([
            'name' => 'Office Staff',
            'email' => 'office@example.com',
        ]);

        User::factory()->fieldStaff()->create([
            'name' => 'Field Staff',
            'email' => 'field@example.com',
        ]);

        $client = Client::factory()->create(['name' => 'Acme Hospital']);

        User::factory()->clientAdmin($client)->create([
            'name' => 'Client Admin',
            'email' => 'client-admin@example.com',
        ]);

        User::factory()->clientStaff($client)->create([
            'name' => 'Client Staff',
            'email' => 'client-staff@example.com',
        ]);
    }
}
