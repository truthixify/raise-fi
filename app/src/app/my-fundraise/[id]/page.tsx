import { FundRaiseDetails } from "@/components/FundRaiseDetails";
import { BinanceSvg, LabeledProgress } from "@/components/reusables";
import { client } from "@/context/thirdWebClient";
import { VAULTABI } from "@/lib/abi";
import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image";
import { getContract } from "thirdweb";
import { bscTestnet } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type SpecficFundRaiseProps = {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata(
    { params }: SpecficFundRaiseProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id }= await params;

    // Make request to blockchain here

    return {
        // Put Metadata here
        title: 'My Fundraise'
    }
}

export default async function SpecificFundRaise({ params }: SpecficFundRaiseProps) {

    const { id }= await params;

    return (
        <FundRaiseDetails address={id} />
    )
}