type SpinLoadingProps = {
    colorClass?: string; // vd: 'text-white' hoặc 'text-gray-800'
    className?: string;
};

function SpinLoading({ colorClass = 'text-white', className = '' }: SpinLoadingProps) {
    return (
        <span
            className={`w-4 h-4 border-2 border-dotted rounded-full inline-block animate-spin ${colorClass} ${className}`}
            style={{
                borderTopColor: 'currentColor',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
            }}
        ></span>
    );
}

export default SpinLoading;
