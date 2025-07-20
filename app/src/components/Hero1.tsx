import Image from "next/image";
import { AppButton } from "./reusables";
import Link from "next/link";

export default function Hero1() {
    return (
        <div className="flex flex-col gap-6 mt-36 pt-32 items-center w-[80%] mx-auto text-center">
            <p className="flex font-semibold text-lg gap-2">
                <Image src={'/assets/heroIcon.png'} width={30} height={30} alt="world"/>
                <span>#1</span>
                Decentralized CrowdFunding Platform
            </p>

            <div className="absolute top-32">
                <Image src={'/assets/heroimg.png'} width={900} height={900} alt="Chains"/>
            </div>

            <p className="text-5xl font-semibold">
                Start Your First <span className="text-[#4E36E9]">Decentralized Fundraising </span> Here
            </p>

            <div className="w-full flex justify-center gap-10 items-center my-5">
                <Link
                    href="/fundraiser"
                >
                    <AppButton text="Start Fundraiser" bgColor="#000" textColor="#78EC95" bold type="button" />
                </Link>
                <Link
                    href="/donate"
                >
                    <AppButton text="Donate" bgColor="#4E36E9" textColor="#fff" bold type="button" />
                </Link>
            </div>

            <div className="flex gap-6 justify-center mt-20 text-start">
                <Image src={'/assets/landingpreviewImg.png'} height={550} width={550} alt="sample"/>
                <div className="w-[50%] pt-6 flex flex-col gap-6">
                    <h3 className="text-lg font-bold">Create Your Fundraising by simply Connecting Your Wallet</h3>
                    <p>
                        RaiseFi is a Web3 crowdfunding platform that lets you create private, 
                        trustless fundraisers by simply connecting your wallet. Attract donations, 
                        and protect your identity with Zero-Knowledge tech all fully on-chain.
                    </p>
                </div>
            </div>
        </div>
    )
}