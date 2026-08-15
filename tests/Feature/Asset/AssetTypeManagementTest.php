<?php

use App\Models\Asset;
use App\Models\AssetType;
use App\Models\User;

test('office staff can create an asset type', function () {
    $officeStaff = User::factory()->officeStaff()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.asset-types.store'), [
        'name' => 'AC Split',
        'default_maintenance_interval_days' => 90,
        'default_instructions' => 'Bersihkan filter setiap 3 bulan.',
    ]);

    $response->assertRedirect();
    $assetType = AssetType::where('name', 'AC Split')->first();
    expect($assetType)->not->toBeNull();
    expect($assetType->default_maintenance_interval_days)->toBe(90);
    expect($assetType->default_instructions)->toBe('Bersihkan filter setiap 3 bulan.');
});

test('an asset type name must be unique', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    AssetType::factory()->create(['name' => 'Genset']);

    $response = $this->actingAs($officeStaff)->post(route('backoffice.asset-types.store'), [
        'name' => 'Genset',
    ]);

    $response->assertSessionHasErrors('name');
    expect(AssetType::where('name', 'Genset')->count())->toBe(1);
});

test('admin can update an asset type', function () {
    $admin = User::factory()->admin()->create();
    $assetType = AssetType::factory()->create(['name' => 'Lama']);

    $response = $this->actingAs($admin)->put(route('backoffice.asset-types.update', $assetType), [
        'name' => 'Baru',
        'default_maintenance_interval_days' => 180,
    ]);

    $response->assertRedirect();
    $assetType->refresh();
    expect($assetType->name)->toBe('Baru');
    expect($assetType->default_maintenance_interval_days)->toBe(180);
});

test('updating an asset type can keep its own name', function () {
    $admin = User::factory()->admin()->create();
    $assetType = AssetType::factory()->create(['name' => 'AC Split']);

    $response = $this->actingAs($admin)->put(route('backoffice.asset-types.update', $assetType), [
        'name' => 'AC Split',
    ]);

    $response->assertSessionDoesntHaveErrors();
});

test('admin can delete an asset type with no assets', function () {
    $admin = User::factory()->admin()->create();
    $assetType = AssetType::factory()->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.asset-types.destroy', $assetType));

    $response->assertRedirect();
    expect(AssetType::find($assetType->id))->toBeNull();
});

test('deleting an asset type still referenced by an asset is blocked', function () {
    $admin = User::factory()->admin()->create();
    $assetType = AssetType::factory()->create();
    Asset::factory()->create(['asset_type_id' => $assetType->id]);

    $response = $this->actingAs($admin)->delete(route('backoffice.asset-types.destroy', $assetType));

    $response->assertRedirect();
    expect(AssetType::find($assetType->id))->not->toBeNull();
});

test('asset type list is searchable, sortable, and paginated', function () {
    $admin = User::factory()->admin()->create();
    AssetType::factory()->create(['name' => 'AC Split']);
    AssetType::factory()->create(['name' => 'Genset']);
    AssetType::factory()->count(14)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.asset-types.index', ['search' => 'Genset']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backoffice/asset-type/index')
        ->has('assetTypes.data', 1)
        ->where('assetTypes.data.0.name', 'Genset')
    );
});

test('field staff cannot manage asset types', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();

    $this->actingAs($fieldStaff)
        ->post(route('backoffice.asset-types.store'), ['name' => 'AC Split'])
        ->assertForbidden();
});

test('admin can bulk-delete asset types with no assets', function () {
    $admin = User::factory()->admin()->create();
    $assetTypes = AssetType::factory()->count(3)->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.asset-types.bulk-destroy'), [
        'ids' => $assetTypes->pluck('id')->all(),
    ]);

    $response->assertRedirect();
    expect(AssetType::count())->toBe(0);
});

test('bulk-deleting asset types blocks any still referenced by an asset', function () {
    $admin = User::factory()->admin()->create();
    $deletable = AssetType::factory()->create();
    $blocked = AssetType::factory()->create();
    Asset::factory()->create(['asset_type_id' => $blocked->id]);

    $response = $this->actingAs($admin)->delete(route('backoffice.asset-types.bulk-destroy'), [
        'ids' => [$deletable->id, $blocked->id],
    ]);

    $response->assertRedirect();
    expect(AssetType::find($deletable->id))->toBeNull();
    expect(AssetType::find($blocked->id))->not->toBeNull();
});

test('field staff cannot bulk-delete asset types', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();
    $assetType = AssetType::factory()->create();

    $this->actingAs($fieldStaff)
        ->delete(route('backoffice.asset-types.bulk-destroy'), ['ids' => [$assetType->id]])
        ->assertForbidden();
});
