<?php

namespace App\Http\Requests\Location;

use App\Models\Location;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Location $location */
        $location = $this->route('location');

        return $this->user()?->can('update', $location) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Location $location */
        $location = $this->route('location');

        return [
            'type' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'parent_location_id' => [
                'nullable',
                'integer',
                Rule::exists('locations', 'id')->where('site_id', $location->site_id),
            ],
            'maintenance_interval_days' => ['nullable', 'integer', 'min:1'],
            'latitude' => ['nullable', 'required_with:longitude,geofence_radius_m', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'required_with:latitude,geofence_radius_m', 'numeric', 'between:-180,180'],
            'geofence_radius_m' => ['nullable', 'required_with:latitude,longitude', 'integer', 'min:1'],
        ];
    }

    /**
     * Configure the validator instance — guards against a node being
     * reparented under itself or one of its own descendants, which would
     * either orphan or infinitely loop that sub-tree.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $parentId = $this->input('parent_location_id');

            if ($parentId === null) {
                return;
            }

            /** @var Location $location */
            $location = $this->route('location');

            if ((int) $parentId === $location->id) {
                $validator->errors()->add(
                    'parent_location_id',
                    'Lokasi tidak boleh menjadi induk dari dirinya sendiri.',
                );

                return;
            }

            $ancestor = Location::query()->find((int) $parentId);
            $depth = 0;

            // Bounded, not just a `while ($ancestor !== null)` loop — if a
            // parent cycle ever slipped past this same check on a previous,
            // concurrently-processed request, an unbounded walk here would
            // hang forever instead of just missing this particular cycle.
            while ($ancestor !== null && $depth < Location::MAX_ANCESTOR_DEPTH) {
                if ($ancestor->id === $location->id) {
                    $validator->errors()->add(
                        'parent_location_id',
                        'Lokasi tidak boleh dipindahkan ke bawah salah satu turunannya sendiri.',
                    );

                    return;
                }

                $ancestor = $ancestor->parent_location_id !== null
                    ? Location::query()->find((int) $ancestor->parent_location_id)
                    : null;
                $depth++;
            }
        });
    }
}
