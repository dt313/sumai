type SwitchButtonProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    id?: string;
};

export default function SwitchButton({ checked, onChange, id }: SwitchButtonProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex  h-6 w-11 items-center rounded-full border-[1.5px] border-gray-300  transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full  transition-transform ${
                        checked ? 'translate-x-5 bg-cyan-600' : 'translate-x-1 bg-neutral-700'
                    }`}
                />
            </button>
        </div>
    );
}
