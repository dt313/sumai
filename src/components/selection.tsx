import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useMemo } from 'react';

type SelectionOptionType = {
    label?: string;
    value: string;
    image?: string;
};

type SelectionType = {
    label?: string;
    list: SelectionOptionType[];
    value: string | number;
    onChange: (item: any) => void;
};

const Option = ({ label, value, image, onClick, checked }) => {
    const handleClick = () => {
        onClick(value);
    };
    return (
        <ListboxOption
            value={value}
            onClick={handleClick}
            className="group relative cursor-default py-2 pr-9 pl-3  select-none data-focus:bg-indigo-500 data-focus:outline-hidden hover:bg-neutral-300 hover:cursor-pointer"
        >
            <div className="flex items-center">
                {image && (
                    <img
                        alt=""
                        src={image}
                        className="size-5 shrink-0 rounded-full outline -outline-offset-1 outline-white/10"
                    />
                )}
                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold text-sm">
                    {label}
                </span>
            </div>

            {checked && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-cyan-600 group-not-data-selected:hidden group-data-focus:text-white">
                    <CheckIcon aria-hidden="true" className="size-5" />
                </span>
            )}
        </ListboxOption>
    );
};

export default function Selection({ label, list = [], value, onChange }: SelectionType) {
    const itemLabel = useMemo(() => {
        return list.find((i) => i.value === value).label;
    }, [value]);

    const image = useMemo(() => {
        return list.find((i) => i.value === value)?.image || null;
    }, [value]);
    return (
        <Listbox value={value} onChange={onChange}>
            {label && <Label className="block text-sm/6 font-medium">{label}</Label>}
            <div className="relative">
                <ListboxButton
                    className="
                        relative flex w-full items-center justify-between 
                        gap-2 rounded-md border-[1.5px] border-gray-300 
                        px-3 py-2 text-sm text-gray-800 shadow-sm transition 
                        duration-200 ease-in-out hover:border-gray-400 
                        focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600
                    "
                >
                    <div className="flex items-center gap-2">
                        {image && <img alt="" src={image} className="size-5 rounded-full object-cover" />}
                        <span className="truncate">{itemLabel}</span>
                    </div>

                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="size-5 text-gray-400 transition-transform duration-200 group-data-[open]:rotate-180"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-bg-light border-[1.5px] border-gray-300   shadow-sm
                    outline-1 -outline-offset-1 outline-white/10 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                    {list.map((item) => (
                        <Option
                            key={item.value}
                            label={item.label}
                            image={item?.image}
                            value={item.value}
                            onClick={() => onChange(item)}
                            checked={item.value === value}
                        />
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}
