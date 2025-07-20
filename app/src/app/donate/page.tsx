'use client'

import { FundRaiseCard } from "@/components/FundRaiseCard";
import { client } from "@/context/thirdWebClient";
import { RaiseFiContractAddress } from "@/lib/abi";
import { Loader } from "lucide-react";
import { useState } from "react"
import { getContract } from "thirdweb";
import { bscTestnet } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

export default function Donate() {

    const [searchValue, setSearchValue] = useState('');
    // Add Search Functionality

    const contract = getContract({
        client: client,
        chain: bscTestnet,
        address: RaiseFiContractAddress,
    })

    const { data, isLoading } = useReadContract({
        contract,
        method: "function getActiveFunds() returns (address[])",
    })

    const fundraiseContracts = data?.map((datum) => {
        const contract = getContract({
            client,
            chain: bscTestnet,
            address: datum,
        });

        return contract
    })

    return (
        <div className="mt-10 py-10 w-[70%] mx-auto flex flex-col gap-5">
            <h3 className="text-center font-semibold text-xl">
                People & Projects Seeking Funding
            </h3>

            <div className="px-6 py-2 w-full border border-gray-400 rounded-3xl">
                <input 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search"
                    className="w-full outline-0"
                />
            </div>

            {
                fundraiseContracts? fundraiseContracts.map((contract, index) => {
                    return (
                        <FundRaiseCard key={index} value={40} max={120} contract={contract}/>
                    )
                }) : (
                    <Loader />
                )
            }
        </div>
    )
}