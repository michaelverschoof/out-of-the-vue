import { AllowedFilters, AllowedModifiers } from '@/v2/functions/model';

/**
 * Base input properties
 */
type InputProps = {
    name: string;
};

/**
 * Properties for the textual-input and textual-area inputs
 */
export type TextualInputProps = InputProps & {
    filters?: AllowedFilters | AllowedFilters[];
    modifiers?: AllowedModifiers | AllowedModifiers[];
};

/**
 * Base input emits
 */
export type InputEmits = {
    focus: [event: FocusEvent];
    blur: [event: FocusEvent];
};
