'use client'

import { AppButton, Logo } from "./reusables";
import { client } from '@/context/thirdWebClient'
import { ConnectButton } from 'thirdweb/react'
import { bscTestnet } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";
import Link from "next/link";

export default function Header() {
    const wallets = [
        createWallet("io.metamask"),
        createWallet("io.zerion.wallet"),
        createWallet("com.trustwallet.app"),
        createWallet("com.okex.wallet"),
        createWallet("com.binance.wallet"),
    ];
    return (
        <header className="flex bg-[#f5f5f5] h-16 justify-between px-20 py-2 items-center">
            <Link
                href="/"
            >
                <Logo />
            </Link>

            {/* <AppButton text="Connect Wallet" bold bgColor="#4E36E9" textColor="#fff"/> */}
            <ConnectButton 
                client={client} 
                accountAbstraction={{
                    chain: bscTestnet,
                    sponsorGas: true
                }}
                connectButton={{
                    className: 'rounded-4xl font-semibold w-40 py-4 px-2 bg-[#4E36E9] text-white',
                    style: {
                        color: 'white',
                        backgroundColor: '#4E36E9',
                        borderRadius: '50px',
                        padding: '16px 8px',
                        fontWeight: 'bold'
                    },
                    label: 'Connect Wallet'
                }}
                // wallets={wallets}
                connectModal={{
                    showThirdwebBranding: false,
                    size: "compact",
                    title: "Connect Wallet",
                }}
            />
        </header>
    )
}