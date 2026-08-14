<?php

namespace App\Http\Requests\Site;

use App\Models\Site;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Sites are always created underneath an existing Client route-bound model
 * (POST backoffice/clients/{client}/sites) — this is what guarantees a Site
 * can never be created without a parent Client, rather than a `client_id`
 * form field the client could tamper with.
 */
class StoreSiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Site::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'geofence_radius_m' => ['required', 'integer', 'min:1'],
        ];
    }
}
