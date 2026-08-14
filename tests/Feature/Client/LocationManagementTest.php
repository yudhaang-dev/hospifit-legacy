<?php

use App\Models\Location;
use App\Models\Site;
use App\Models\User;

test('office staff can create a location directly under a site', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $site = Site::factory()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.sites.locations.store', $site), [
        'type' => 'room',
        'name' => 'Ruang Rawat 1',
    ]);

    $response->assertRedirect();
    expect(Location::where('site_id', $site->id)->where('name', 'Ruang Rawat 1')->exists())->toBeTrue();
});

test('office staff can create a location nested under another location', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $site = Site::factory()->create();
    $building = Location::factory()->for($site)->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.sites.locations.store', $site), [
        'type' => 'room',
        'name' => 'Ruang 202',
        'parent_location_id' => $building->id,
    ]);

    $response->assertRedirect();
    $location = Location::where('name', 'Ruang 202')->first();
    expect($location)->not->toBeNull();
    expect($location->parent_location_id)->toBe($building->id);
});

test('a location cannot use a parent from a different site', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $site = Site::factory()->create();
    $otherSiteLocation = Location::factory()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.sites.locations.store', $site), [
        'type' => 'room',
        'name' => 'Ruang 303',
        'parent_location_id' => $otherSiteLocation->id,
    ]);

    $response->assertSessionHasErrors('parent_location_id');
    expect(Location::where('name', 'Ruang 303')->exists())->toBeFalse();
});

test('admin can update a location', function () {
    $admin = User::factory()->admin()->create();
    $location = Location::factory()->create(['name' => 'Lama']);

    $response = $this->actingAs($admin)->put(route('backoffice.locations.update', $location), [
        'type' => $location->type,
        'name' => 'Baru',
    ]);

    $response->assertRedirect();
    expect($location->refresh()->name)->toBe('Baru');
});

test('a location can be reparented to another location in the same site', function () {
    $admin = User::factory()->admin()->create();
    $site = Site::factory()->create();
    $oldParent = Location::factory()->for($site)->create();
    $newParent = Location::factory()->for($site)->create();
    $location = Location::factory()->childOf($oldParent)->create();

    $response = $this->actingAs($admin)->put(route('backoffice.locations.update', $location), [
        'type' => $location->type,
        'name' => $location->name,
        'parent_location_id' => $newParent->id,
    ]);

    $response->assertRedirect();
    expect($location->refresh()->parent_location_id)->toBe($newParent->id);
});

test('a location cannot be reparented under itself', function () {
    $admin = User::factory()->admin()->create();
    $location = Location::factory()->create();

    $response = $this->actingAs($admin)->put(route('backoffice.locations.update', $location), [
        'type' => $location->type,
        'name' => $location->name,
        'parent_location_id' => $location->id,
    ]);

    $response->assertSessionHasErrors('parent_location_id');
});

test('a location cannot be reparented under its own descendant', function () {
    $admin = User::factory()->admin()->create();
    $site = Site::factory()->create();
    $parent = Location::factory()->for($site)->create();
    $child = Location::factory()->childOf($parent)->create();
    $grandchild = Location::factory()->childOf($child)->create();

    $response = $this->actingAs($admin)->put(route('backoffice.locations.update', $parent), [
        'type' => $parent->type,
        'name' => $parent->name,
        'parent_location_id' => $grandchild->id,
    ]);

    $response->assertSessionHasErrors('parent_location_id');
    expect($parent->refresh()->parent_location_id)->toBeNull();
});

test('admin can delete a location with no children', function () {
    $admin = User::factory()->admin()->create();
    $location = Location::factory()->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.locations.destroy', $location));

    $response->assertRedirect();
    expect(Location::find($location->id))->toBeNull();
});

test('deleting a location with children is blocked', function () {
    $admin = User::factory()->admin()->create();
    $parent = Location::factory()->create();
    Location::factory()->childOf($parent)->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.locations.destroy', $parent));

    $response->assertRedirect();
    expect(Location::find($parent->id))->not->toBeNull();
});

test('a location resolves its maintenance interval from the nearest ancestor', function () {
    $site = Site::factory()->create();
    $building = Location::factory()->for($site)->create(['maintenance_interval_days' => 90]);
    $room = Location::factory()->childOf($building)->create(['maintenance_interval_days' => null]);

    expect($room->resolveMaintenanceIntervalDays())->toBe(90);
    expect($building->resolveMaintenanceIntervalDays())->toBe(90);
});

test('a location with no interval anywhere in its ancestry resolves to null', function () {
    $site = Site::factory()->create();
    $building = Location::factory()->for($site)->create(['maintenance_interval_days' => null]);
    $room = Location::factory()->childOf($building)->create(['maintenance_interval_days' => null]);

    expect($room->resolveMaintenanceIntervalDays())->toBeNull();
});

test('creating a location without a name fails validation', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $site = Site::factory()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.sites.locations.store', $site), [
        'type' => 'room',
    ]);

    $response->assertSessionHasErrors('name');
    expect(Location::count())->toBe(0);
});

test('field staff cannot manage locations', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();
    $site = Site::factory()->create();

    $this->actingAs($fieldStaff)
        ->post(route('backoffice.sites.locations.store', $site), [])
        ->assertForbidden();
});
