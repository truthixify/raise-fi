'use client'

import Image from "next/image"
import { Progress } from "./ui/progress"
import { LabeledProgress } from "./reusables"
import { usePathname, useRouter } from "next/navigation"
import { ContractOptions, defineChain, prepareContractCall, PreparedTransaction, prepareTransaction, toEther } from "thirdweb"
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react"
import { useMemo, useState } from "react"
import { parseEther } from "ethers"

export const FundRaiseCard = ({ value, max, contract }: {
    value: number,
    max: number,
    contract: Readonly<ContractOptions<[], `0x${string}`>>
}) => {
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donationAmount, setDonationAmount] = useState('0')
    const [error, setError] = useState('')

    const { data } = useReadContract({
        contract,
        method: "function getDetails() external view returns (address, uint256, uint256, uint256, bool)",
    })

    const account = useActiveAccount();
    const connectedAddress = account?.address;

    const filteredData = data?.[0] === connectedAddress ? data : null;

    const realMax = Number(data?.[1]);
    const fundingEndTime = Number(data?.[2]);
    const realValue = Number(data?.[3]);
    const isClaimed = Number(data?.[4]);

    const { push } = useRouter();

    const { mutateAsync: donate, isPending, isSuccess, isError } = useSendTransaction();

    // console.log(contract, connectedAddress, donationAmount)
    const transaction = useMemo(() => {
        if (!contract || !connectedAddress || !donationAmount) return;

        const amount = Number(donationAmount);
        if (isNaN(amount) || amount <= 0) return;

        const call = prepareContractCall({
            contract,
            method: "function fund() external payable",
            value: BigInt(parseEther(donationAmount)),
        })
        return call;
    }, [donationAmount, contract, connectedAddress])

    const handleDonate = async () => {
        try {
            let txHash = await donate(transaction as PreparedTransaction)
            setIsModalOpen(false)
        } catch (err) {
            console.error(err)
            setIsModalOpen(false)
        }
    }


    return (
        <>
            {filteredData && (
            <div className={`w-fit flex flex-col gap-11 border-2 shadow border-[#f5f5f5] rounded-2xl px-16 py-12`}>
                <h2 className="text-[#1D1D1D] font-semibold text-xl self-start">
                I need funding to complete my TryFI
                </h2>
                <div className="flex items-center gap-12">
                    <Image src={'/assets/donateImg1.png'} alt="" width={500} height={500}/>
                    <div className="flex flex-col gap-6">
                        <p className="text-[#6A6A6A] font-normal">
                            TryFi is is an AI powered Learning platform that exposes
                            users to web3 fro zero knowledge to expert level. i need
                            funding t complete the project development. here is the
                            website link www.tryfi.com. its still under build.
                        </p>

                        <div className="border border-gray-300 py-6.5 px-6 rounded-full">
                            <LabeledProgress value={realValue} max={realMax}/>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 self-end">
                    {
                        !pathname.includes('my-fundraise') && (
                            <button 
                                className="bg-[#4E36E9] text-white py-1 px-4 rounded-3xl cursor-pointer"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Donate now
                            </button>
                        )
                    }
                    <button 
                        className="text-[#2C2C2C] border-2 px-4 rounded-3xl cursor-pointer"
                        onClick={() => { push(`/my-fundraise/${contract.address}`) }}
                    >
                        Share
                    </button>
                </div>
            </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-400 backdrop-opacity-100 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl w-[500px]">
                        <h3 className="text-xl font-bold mb-4">Donate to Campaign</h3>
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">
                                Amount (ETH)
                            </label>
                            <input
                                type="number"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E36E9]"
                            />
                            {error && (
                                <p className="text-red-500 mt-2">{error}</p>
                            )}
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setDonationAmount('');
                                    setError('');
                                }}
                                disabled={isPending}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDonate}
                                disabled={isPending}
                                className="bg-[#4E36E9] text-white px-4 py-2 rounded-lg hover:bg-[#3a29c4] disabled:opacity-50"
                            >
                                {isPending ? 'Processing...' : 'Confirm Donation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}