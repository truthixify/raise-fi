import { Button } from "./ui/button"
import { Progress } from "./ui/progress"


export const AppButton = ({ text, bold, bgColor, textColor, onClick, type }: {
    text: string,
    bold?: boolean,
    bgColor: string, // should be hexcode
    textColor: string,
    onClick?: () => void,
    type: "button" | "submit" | "reset" | undefined
}) => {
    return (
        <Button 
            className={`rounded-4xl ${bold && 'font-semibold cursor-pointer'} w-40 py-4 px-2`}
            style={{ backgroundColor: bgColor, color: textColor }}
            onClick={onClick}
            type={type}
        >
            {text}
        </Button>
    )
}

export const CurveSvg = () => (
    <svg width="1141" height="571" viewBox="0 0 1141 571" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1138 570.5C1138 257.078 883.922 3 570.5 3C257.078 3 3 257.078 3 570.5" stroke="url(#paint0_linear_11_47)"             stroke-width="6" stroke-dasharray="28 28"/>
        <defs>
            <linearGradient id="paint0_linear_11_47" x1="-12.5" y1="583" x2="1138" y2="571" gradientUnits="userSpaceOnUse">
                <stop stop-color="white"/>
                <stop offset="0.149038" stop-color="#78EC95"/>
                <stop offset="0.865385" stop-color="#78EC95"/>
                <stop offset="1" stop-color="white"/>
            </linearGradient>
        </defs>
    </svg>
)

export const Logo = () => {
    return (
        <div className="font-bold text-2xl cursor-pointer">
            <span className="text-[#4E36E9]">Raise</span>
            <span className="text-green-300">Fi</span>
        </div>
    )
}

export const ArrowSvg = () => (
    <svg width="72" height="32" viewBox="0 0 72 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M0.875 16.0002C0.875 16.5195 1.08133 17.0177 1.44858 17.3849L15.1569 31.0932C15.9217 31.858 17.1617 31.858 17.9264 31.0932C18.6911 30.3285 18.6911 29.0885 17.9264 28.3238L7.56116 17.9585H69.1667C70.2483 17.9585 71.125 17.0818 71.125 16.0002C71.125 14.9186 70.2483 14.0418 69.1667 14.0418H7.56116L17.9264 3.67659C18.6911 2.9118 18.6911 1.67186 17.9264 0.907072C17.1617 0.142304 15.9217 0.142304 15.1569 0.907072L1.44858 14.6154C1.08133 14.9826 0.875 15.4808 0.875 16.0002Z" fill="black"/>
    </svg>
)

export const LabeledProgress = ({ value, max }: {
    value: number,
    max: number
}) => {
    const format = (n: number) => `$${n.toLocaleString("en-US")}`;
    
    const progressBarValue = value / max * 100;

    return (
        <div className="relative w-full">
            <div className="absolute left-0 right-0 -top-6 flex justify-between text-sm text-gray-500 px-1">
                <span>{format(0)}</span>
                <span 
                    // className={`absolute ${progressBarValue === 0 ? 'hidden' : progressBarValue === 0.2 ? 'left-1/5' : progressBarValue === 0.25 ? 'left-1/4' : progressBarValue === 0.50 ? 'left-1/2': progressBarValue === 0.75 ? 'left-3/4' : 'hidden'}`}
                    style={{position: 'absolute', display: progressBarValue === 0 || progressBarValue === 100 ? 'none' : 'block', left: `${progressBarValue}%`}}
                >
                    {format(value)}
                </span>
                <span className="">{format(max)}</span>
            </div>

            <div className="mt-2">
                <Progress value={value / max * 100} className="w-full h-2"/>
            </div>
        </div>
    )
}

export const BinanceSvg = () => (
    <svg width="60" height="61" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 60.5C46.5685 60.5 60 47.0685 60 30.5C60 13.9315 46.5685 0.5 30 0.5C13.4315 0.5 0 13.9315 0 30.5C0 47.0685 13.4315 60.5 30 60.5Z" fill="#F3BA2F"/>
        <path d="M22.7175 27.5075L30 20.225L37.2862 27.5113L41.5238 23.2738L30 11.75L18.48 23.27L22.7175 27.5075ZM11.25 30.5L15.4875 26.2625L19.725 30.5L15.4875 34.7375L11.25 30.5ZM22.7175 33.4925L30 40.775L37.2862 33.4888L41.5238 37.7244L30 49.25L18.48 37.73L18.4744 37.7244L22.7175 33.4925ZM40.275 30.5L44.5125 26.2625L48.75 30.5L44.5125 34.7375L40.275 30.5ZM34.2975 30.4963H34.3013V30.5L30 34.8013L25.7044 30.5075L25.6969 30.5L25.7044 30.4944L26.4562 29.7406L26.8219 29.375L30 26.1988L34.2994 30.4981L34.2975 30.4963Z" fill="white"/>
    </svg>
)