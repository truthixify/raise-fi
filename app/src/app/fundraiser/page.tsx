'use client'

import { MultiPartForm } from "@/components/MultiPartForm";
import { useState } from "react";

const StepsText = [
    "Start Fundraising Campaign in 3 Steps",
    "Almost done...",
    "Last step"
]

export default function Fundraiser() {

    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="mt-10">
            <p className="text-center text-2xl font-semibold my-4">
                {StepsText[currentStep]}
            </p>
            <MultiPartForm 
                step={currentStep}
                setCurrentStep={setCurrentStep}
            />
        </div>
    )
}