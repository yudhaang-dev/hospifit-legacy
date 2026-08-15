import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboboxOption = {
    value: string;
    label: string;
};

type ComboboxProps = {
    id?: string;
    options: ComboboxOption[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    onSearchChange?: (query: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    loadingText?: string;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
};

/**
 * A searchable combobox for pickers over datasets expected to grow large
 * (see the project convention this follows — Client/Site/Location pickers
 * use this instead of a preloaded `<Select>`). Search is controlled by the
 * caller via `onSearchChange`/`options`/`loading` so it can be backed by a
 * server-side typeahead endpoint — `Command`'s built-in client-side
 * filtering is disabled (`shouldFilter={false}`) since `options` already
 * arrives pre-filtered from the server.
 */
export function Combobox({
    id,
    options,
    value,
    onValueChange,
    onSearchChange,
    placeholder = 'Pilih...',
    searchPlaceholder = 'Cari...',
    emptyText = 'Tidak ditemukan.',
    loadingText = 'Memuat...',
    loading = false,
    disabled = false,
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const selected = options.find((option) => option.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'w-full justify-between font-normal',
                        !selected && 'text-muted-foreground',
                        className,
                    )}
                >
                    {selected ? selected.label : placeholder}
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        onValueChange={onSearchChange}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {loading ? loadingText : emptyText}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onValueChange(
                                            currentValue === value
                                                ? null
                                                : currentValue,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            value !== option.value &&
                                                'opacity-0',
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
