<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained()->cascadeOnDelete();
            $table->foreignId('asset_type_id')->nullable()
                ->constrained('asset_types')->restrictOnDelete();
            $table->string('name');
            // Globally unique — not scoped per Site/Client — so a future
            // scan-to-identify flow (ticket 09) can resolve an Asset from
            // the code alone without first knowing which Site the visit is at.
            $table->string('barcode')->unique();
            $table->string('serial_number')->nullable();
            $table->unsignedInteger('maintenance_interval_days')->nullable();
            $table->text('instructions_override')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
