

type PrimaryButtonProps = {
    text: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export function PrimaryButton({text, onClick, className, disabled=false}: PrimaryButtonProps){

    return (
        <button 
            disabled = {disabled}
            onClick = {onClick}
            className = {`
                ${className} mx-auto
                flex items-center justify-center
                rounded-full border-2
                px-4 py-2
                shadow-sm border-white text-white

                transition-all duration-300 ease-out
                hover:bg-white hover:text-black
                hover:-translate-y-0.5
                hover:shadow-xl cursor-pointer
            `}
        >

            {text}
        </button>
    )

}