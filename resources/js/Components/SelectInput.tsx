import React from 'react';

interface SelectInputProps {
    id: string;
    name: string;
    options: Array<{ id: number; name: string }>;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    renderOption: (option: { id: number; name: string }) => React.ReactNode;
    default_select_text?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ id, name, options, value, onChange, renderOption, default_select_text = 'Select Option' }) => {
    return (
        <select
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block w-full"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
        >
            <option value="">{default_select_text}</option>
            {options.map((option) => renderOption(option))}
        </select>
    );
};

export default SelectInput;