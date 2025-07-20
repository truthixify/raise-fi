'use client'

import Image from "next/image"
import { BinanceSvg, LabeledProgress } from "./reusables"
import { getContract } from "thirdweb"
import { client } from "@/context/thirdWebClient"
import { bscTestnet } from "thirdweb/chains"
import { VAULTABI } from "@/lib/abi"
import { useReadContract } from "thirdweb/react"

export const FundRaiseDetails = ({ address }: {
    address: string
}) => {

    const contract = getContract({
        client: client,
        chain: bscTestnet,
        address,
        abi: VAULTABI
    })

    const { data, isLoading } = useReadContract({
        contract,
        method: "getDetails"
    })

    const fundingPeriodInSeconds = Number(data?.[2])
    const fundingDeadline = new Date(fundingPeriodInSeconds * 1000);

    console.log(fundingDeadline)

    console.log(data)
    return data && (
        <div className="flex justify-center gap-40 w-[90%] mx-auto my-20">
            <div className="flex flex-col items-start gap-3">
                <Image src={'/assets/donateImg1.png'} alt="donate" width={420} height={420} />
                <p className="text-[#6A6A6A] font-normal w-[400px]">
                    TryFi is is an AI powered Learning platform that exposes
                    users to web3 fro zero knowledge to expert level. i need
                    funding t complete the project development. here is the
                    website link www.tryfi.com. its still under build.
                </p>
            </div>

            <div className="w-full">
                <div className="flex flex-col gap-6 w-full">
                    <h3 className="text-center font-semibold">Donation History</h3>
                    <div className="border border-gray-300 rounded-full px-10 py-7 w-full">
                        <LabeledProgress value={Number(data[3])} max={Number(data[1])} />
                    </div>
                </div>

                {/* <div className="flex flex-col gap-3 py-10">
                    {
                        Array.from({ length: 6 }).map((_, i) => {
                            return (
                                <div className="flex py-2 px-3 bg-[#f5f5f5] gap-4" key={i}>
                                    <BinanceSvg />
                                    <div className="flex flex-col">
                                        <p className="text-xs">BrtuuYTYYUUUNii12gjyhddjdkdujdnddjRdudj6484j84</p>
                                        <p className="text-lg text-green-500 font-semibold">$500</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div> */}
                <div className="font-semibold mt-8 text-center">
                    Fund ending on {fundingDeadline.toDateString()}
                </div>
            </div>
        </div>
    )
}