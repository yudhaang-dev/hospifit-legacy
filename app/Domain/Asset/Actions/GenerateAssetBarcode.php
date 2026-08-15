<?php

namespace App\Domain\Asset\Actions;

use App\Models\Asset;
use Illuminate\Support\Str;
use RuntimeException;

class GenerateAssetBarcode
{
    /**
     * Number of attempts to find a barcode not already taken before giving
     * up — collisions are extremely unlikely (36^7 possibilities) so this is
     * just a safety valve, not an expected code path.
     */
    private const int MAX_ATTEMPTS = 20;

    /**
     * Generate a globally-unique Asset barcode: `AST-` followed by 7 random
     * uppercase alphanumeric characters (e.g. `AST-7F3K9Q2`).
     */
    public function handle(): string
    {
        for ($attempt = 0; $attempt < self::MAX_ATTEMPTS; $attempt++) {
            $code = 'AST-'.Str::upper(Str::random(7));

            if (! Asset::where('barcode', $code)->exists()) {
                return $code;
            }
        }

        throw new RuntimeException('Gagal membuat barcode aset yang unik setelah beberapa percobaan.');
    }
}
