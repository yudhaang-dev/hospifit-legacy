<?php

use App\Models\Asset;
use App\Models\AssetType;
use App\Models\Client;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;

test('office staff can create an asset under a location with an auto-generated unique barcode', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $location = Location::factory()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.locations.assets.store', $location), [
        'name' => 'AC Split Lantai 1',
    ]);

    $response->assertRedirect();
    $asset = Asset::where('location_id', $location->id)->where('name', 'AC Split Lantai 1')->first();
    expect($asset)->not->toBeNull();
    expect($asset->barcode)->toStartWith('AST-');
    expect(strlen($asset->barcode))->toBe(11); // "AST-" + 7 chars
    expect(Asset::where('barcode', $asset->barcode)->count())->toBe(1);
});

test('an asset can be tagged with an asset type', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $location = Location::factory()->create();
    $assetType = AssetType::factory()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.locations.assets.store', $location), [
        'name' => 'Genset A',
        'asset_type_id' => $assetType->id,
    ]);

    $response->assertRedirect();
    $asset = Asset::where('name', 'Genset A')->first();
    expect($asset->asset_type_id)->toBe($assetType->id);
});

test('admin can update an asset name, type, serial number, and overrides', function () {
    $admin = User::factory()->admin()->create();
    $asset = Asset::factory()->create(['name' => 'Lama']);
    $assetType = AssetType::factory()->create();

    $response = $this->actingAs($admin)->put(route('backoffice.assets.update', $asset), [
        'name' => 'Baru',
        'asset_type_id' => $assetType->id,
        'serial_number' => 'SN-12345',
        'maintenance_interval_days' => 30,
        'instructions_override' => 'Periksa filter setiap bulan.',
    ]);

    $response->assertRedirect();
    $asset->refresh();
    expect($asset->name)->toBe('Baru');
    expect($asset->asset_type_id)->toBe($assetType->id);
    expect($asset->serial_number)->toBe('SN-12345');
    expect($asset->maintenance_interval_days)->toBe(30);
    expect($asset->instructions_override)->toBe('Periksa filter setiap bulan.');
});

test('updating an asset does not accept a location_id override', function () {
    $admin = User::factory()->admin()->create();
    $originalLocation = Location::factory()->create();
    $otherLocation = Location::factory()->create();
    $asset = Asset::factory()->forLocation($originalLocation)->create();

    $response = $this->actingAs($admin)->put(route('backoffice.assets.update', $asset), [
        'name' => $asset->name,
        'location_id' => $otherLocation->id,
    ]);

    $response->assertRedirect();
    expect($asset->refresh()->location_id)->toBe($originalLocation->id);
});

test('admin can delete an asset', function () {
    $admin = User::factory()->admin()->create();
    $asset = Asset::factory()->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.assets.destroy', $asset));

    $response->assertRedirect();
    expect(Asset::find($asset->id))->toBeNull();
});

test('assets can be searched by name, barcode, or serial number on the location show page', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $location = Location::factory()->create();
    Asset::factory()->forLocation($location)->create(['name' => 'AC Split Lobi', 'barcode' => 'AST-AAAAAAA', 'serial_number' => 'SN-1']);
    Asset::factory()->forLocation($location)->create(['name' => 'Genset Utama', 'barcode' => 'AST-BBBBBBB', 'serial_number' => 'SN-2']);

    $byName = $this->actingAs($officeStaff)->get(route('backoffice.locations.show', $location).'?search=Lobi');
    $byName->assertInertia(fn ($page) => $page->has('assets.data', 1)->where('assets.data.0.name', 'AC Split Lobi'));

    $byBarcode = $this->actingAs($officeStaff)->get(route('backoffice.locations.show', $location).'?search=BBBBBBB');
    $byBarcode->assertInertia(fn ($page) => $page->has('assets.data', 1)->where('assets.data.0.name', 'Genset Utama'));

    $bySerial = $this->actingAs($officeStaff)->get(route('backoffice.locations.show', $location).'?search=SN-1');
    $bySerial->assertInertia(fn ($page) => $page->has('assets.data', 1)->where('assets.data.0.name', 'AC Split Lobi'));
});

test('field staff cannot manage assets', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();
    $location = Location::factory()->create();

    $this->actingAs($fieldStaff)
        ->post(route('backoffice.locations.assets.store', $location), ['name' => 'Aset'])
        ->assertForbidden();
});

test('a client-role user can only view assets under their own client', function () {
    $ownClient = Client::factory()->create();
    $ownSite = Site::factory()->for($ownClient)->create();
    $ownLocation = Location::factory()->for($ownSite)->create();
    $ownAsset = Asset::factory()->forLocation($ownLocation)->create();

    $otherAsset = Asset::factory()->create();

    $clientUser = User::factory()->clientAdmin($ownClient)->create();

    expect($clientUser->can('view', $ownAsset))->toBeTrue();
    expect($clientUser->can('view', $otherAsset))->toBeFalse();
});

test('an asset resolves its maintenance interval and instructions with own override taking precedence over asset type', function () {
    $assetType = AssetType::factory()->create([
        'default_maintenance_interval_days' => 60,
        'default_instructions' => 'Instruksi tipe.',
    ]);
    $asset = Asset::factory()->create([
        'asset_type_id' => $assetType->id,
        'maintenance_interval_days' => 15,
        'instructions_override' => 'Instruksi khusus aset.',
    ]);

    expect($asset->resolveMaintenanceIntervalDays())->toBe(15);
    expect($asset->resolveInstructions())->toBe('Instruksi khusus aset.');
});

test('an asset resolves its maintenance interval and instructions from its asset type when it has no own override', function () {
    $assetType = AssetType::factory()->create([
        'default_maintenance_interval_days' => 60,
        'default_instructions' => 'Instruksi tipe.',
    ]);
    $asset = Asset::factory()->create([
        'asset_type_id' => $assetType->id,
        'maintenance_interval_days' => null,
        'instructions_override' => null,
    ]);

    expect($asset->resolveMaintenanceIntervalDays())->toBe(60);
    expect($asset->resolveInstructions())->toBe('Instruksi tipe.');
});

test('an asset with no override and no asset type resolves its maintenance interval from its location', function () {
    $site = Site::factory()->create();
    $location = Location::factory()->for($site)->create(['maintenance_interval_days' => 90]);
    $asset = Asset::factory()->forLocation($location)->create([
        'asset_type_id' => null,
        'maintenance_interval_days' => null,
    ]);

    expect($asset->resolveMaintenanceIntervalDays())->toBe(90);
});

test('an asset with no override and no asset type resolves instructions to null', function () {
    $asset = Asset::factory()->create([
        'asset_type_id' => null,
        'instructions_override' => null,
    ]);

    expect($asset->resolveInstructions())->toBeNull();
});
