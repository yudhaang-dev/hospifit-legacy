<?php

namespace App\Http\Requests\AssetType;

use App\Models\AssetType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var AssetType $assetType */
        $assetType = $this->route('assetType');

        return $this->user()?->can('update', $assetType) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var AssetType $assetType */
        $assetType = $this->route('assetType');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('asset_types', 'name')->ignore($assetType->id)],
            'default_maintenance_interval_days' => ['nullable', 'integer', 'min:1'],
            'default_instructions' => ['nullable', 'string'],
        ];
    }
}
