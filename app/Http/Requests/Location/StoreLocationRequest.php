<?php

namespace App\Http\Requests\Location;

use App\Models\Location;
use App\Models\Site;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Location::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Site $site */
        $site = $this->route('site');

        return [
            'type' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'parent_location_id' => [
                'nullable',
                'integer',
                Rule::exists('locations', 'id')->where('site_id', $site->id),
            ],
            'maintenance_interval_days' => ['nullable', 'integer', 'min:1'],
            'latitude' => ['nullable', 'required_with:longitude,geofence_radius_m', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'required_with:latitude,geofence_radius_m', 'numeric', 'between:-180,180'],
            'geofence_radius_m' => ['nullable', 'required_with:latitude,longitude', 'integer', 'min:1'],
        ];
    }
}
