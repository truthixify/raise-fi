import Image from "next/image";

export default function Hero2() {
    return (
        <div className="flex w-full items-center mt-28 bg-[#4E36E9] justify-center h-[700px] text-white gap-28">
            <div className="flex flex-col gap-8 w-2/6">
                <h1 className="font-semibold text-3xl">Keep Donation Anonymous from Public</h1>
                <p className="text-2xl font-medium">Crowdfund the future, privately. <br /> Contribute to projects by simply connecting your wallet.</p>
                <p className="text-2xl font-medium">Keep your donation anonymous from the public using Zero-Knowledge tech.</p>
            </div>
            <div>
                <Image src={'/assets/landingpreviewimg2.png'} alt="on button" width={450} height={20} />
                <Image src={'/assets/landingpreviewimg3.png'} alt="off button" width={450} height={20}/>
            </div>
        </div>
    )
}