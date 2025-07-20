'use client'

import Image from "next/image"
import { Progress } from "./ui/progress"
import { FundRaiseCard } from "./FundRaiseCard"
import { getContract } from "thirdweb"
import { client } from "@/context/thirdWebClient"
import { bscTestnet } from "thirdweb/chains"
import { RaiseFiContractAddress } from "@/lib/abi"
import { useReadContract } from "thirdweb/react"
import { Loader } from "lucide-react"

export const FundRaises = () => {

    const contract = getContract({
        client: client,
        chain: bscTestnet,
        address: RaiseFiContractAddress,
    })

    const { data, isLoading } = useReadContract({
        contract,
        method: "function getActiveFunds() returns (address[])",
    })

    console.log(data)

    const fundraiseContracts = data?.map((datum) => {
        const contract = getContract({
            client,
            chain: bscTestnet,
            address: datum,
        });

        return contract
    })

    console.log(fundraiseContracts);
    
    return (
        <div className="w-[70%] mx-auto flex flex-col gap-9">
            {
                fundraiseContracts ? fundraiseContracts.map((contract, index) => {
                    return (
                        <FundRaiseCard key={index} value={1000} max={20000} contract={contract}/>
                    )
                }) : (
                    <Loader />
                )
            }
        </div>
    )
}