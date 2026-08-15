<?php

namespace App\Http\Requests\Asset;

use App\Models\Asset;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Asset $asset */
        $asset = $this->route('asset');

        return $this->user()?->can('update', $asset) ?? false;
    }

    /**
     * Get the validation rules that apply to the request. `location_id` is
     * deliberately absent — moving an Asset between Locations is out of
     * scope for this ticket.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'asset_type_id' => ['nullable', 'integer', 'exists:asset_types,id'],
            'serial_number' => ['nullable', 'string', 'max:255'],
            'maintenance_interval_days' => ['nullable', 'integer', 'min:1'],
            'instructions_override' => ['nullable', 'string'],
        ];
    }
}
