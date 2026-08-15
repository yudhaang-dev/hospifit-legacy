<?php

namespace App\Http\Requests\AssetType;

use App\Models\AssetType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAssetTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', AssetType::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:asset_types,name'],
            'default_maintenance_interval_days' => ['nullable', 'integer', 'min:1'],
            'default_instructions' => ['nullable', 'string'],
        ];
    }
}
