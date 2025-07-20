'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import React, { ChangeEvent, SetStateAction, useMemo, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import z from "zod"
import { AppButton, ArrowSvg } from "./reusables"
import { LiaImage } from "react-icons/lia"
import { getContract, prepareContractCall, PreparedTransaction } from "thirdweb"
import { client } from "@/context/thirdWebClient"
import { RaiseFiContractAddress } from "@/lib/abi"
import { bscTestnet } from "thirdweb/chains"
import { useActiveAccount, useSendTransaction } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

type MultiFormData = {
    fundAmount: string;
    fundRaiserDescription: string;
    fundRaiserTitle: string;
    fundReason: string;
    fundPeriodInDays: string;
}

const fundRaiserFormSchema = z.object({
        fundReason: z.string().min(1, "Cannot be empty"),
        fundRaiserTitle: z.string().min(1, "Cannot be empty"),
        fundRaiserDescription: z.string().min(20, "Has to be long enough"),
        fundAmount: z.number(),
        mediaProof: z.custom<FileList | null>((value: any) => {
            if (value && value.length > 0) {
                return true;
            } 
            return false;
        }, {
            error: 'Please upload one image'
        })
            .refine((files: any) => !files || files.length === 1, {
                error: 'Please upload one image'
            }) 
            .refine((files: any) => !files || files[0]?.size <= 5 * 1024 * 1024, {
                error: "Max File Size is 5MB"
            })
            .refine((files: any) => !files || ["image/jpg", "image/png", "image/jpeg"].includes(files?.[0]?.type), {
                error: "Accepted formats are jpeg and png"
            })
            .optional()
    })


type FundRaiserFormSchema = z.infer<typeof fundRaiserFormSchema>

export const MultiPartForm = ({
  step,
  setCurrentStep,
}: {
  step: number;
  setCurrentStep: React.Dispatch<SetStateAction<number>>;
}) => {
  const methods = useForm<FundRaiserFormSchema>({
    resolver: zodResolver(fundRaiserFormSchema),
    defaultValues: {
        fundAmount: 0,
        fundRaiserDescription: '',
        fundRaiserTitle: '',
        fundReason: '',
    },
  });
  const { handleSubmit } = methods;

  const account = useActiveAccount();
  const connectedAddress = account?.address;

  const [formData, setFormData] = useState({
    fundAmount: '0',
    fundRaiserDescription: '',
    fundRaiserTitle: '',
    fundReason: '',
    fundPeriodInDays: ''
  })

  const contract = getContract({
    client: client,
    chain: bscTestnet,
    address: RaiseFiContractAddress,
  })

  const { mutateAsync: sendTransaction, isPending, isSuccess, isError, isIdle } = useSendTransaction();

  const transaction = useMemo(() => {
    if (!contract) return;
    const isValid = Number(formData.fundAmount) > 0 && formData.fundRaiserDescription.length > 10 && Number(formData.fundPeriodInDays) > 0 && formData.fundRaiserTitle.length > 0 && formData.fundReason.length > 0 && connectedAddress;
    if (!isValid) return;

    const call = prepareContractCall({
    contract,
    method: "function createFund(uint256 _targetAmount, uint256 _fundingPeriodInDays) returns (address)",
    params: [BigInt(Number(formData.fundAmount)), BigInt(Number(formData.fundPeriodInDays))],
    value: BigInt(0)
   })

   return call;
  }, [formData, contract, account, connectedAddress])

   const { push } = useRouter();
   
   const writeAsync = async () => {
       const address = await sendTransaction(transaction as PreparedTransaction);
       console.log(address);
       push('/my-fundraise');
   }

  const onSubmit = async (values: FundRaiserFormSchema) => {
    // all your step values are in `values` now
    console.log("submitting", values);
    // sendTransaction(transaction);
  };

  return (
    <div className="…your card…">
      <Progress currentStep={step} />

      <FormProvider {...methods}>
        {/* 1) all in one form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col justify-between w-[80%] mx-auto h-[450px] max-h-[450px] overflow-y-scroll border border-gray-300 px-8 py-4 rounded-2xl"
        >
          {step === 0 && <StepZero formdata={formData} setFormData={setFormData} />}
          {step === 1 && <StepOne formdata={formData} setFormData={setFormData} />}
          {step === 2 && <StepTwo formdata={formData} setFormData={setFormData} />}

          {/* 2) navigation / submit */}
          <div className="mt-8 flex justify-between">
            {/* back is just a button, never submits */}
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              className=""
            >
              ← Back
            </button>

            {step < 2 ? (
              // next is also type=button
              <AppButton
                type="button"
                text="Next"
                bold
                bgColor="#4E36E9"
                textColor="#fff"
                onClick={() => setCurrentStep((s) => s + 1)}
              />
            ) : (
              // final submit
              <button
                type="submit"
                className="bg-[#4E36E9] text-white font-semibold rounded-4xl px-6 py-3"
                onClick={() => writeAsync()}
              >

                {!isPending ? 'Start Fundraiser' : <Loader />}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};


export const Progress = ({ currentStep }: {
    currentStep: number
}) => {
    return (
        <div className="flex justify-center gap-8">
            {
                Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className={`w-32 h-2 ${index <= currentStep? 'bg-[#4E36E9]': 'bg-[#f5f5f5]'} rounded-xl`} />
                ))
            }
            {/* <div className="w-32 h-3 bg-[#f5f5f5] rounded-lg" />
            <div className="w-32 h-3 bg-[#f5f5f5] rounded-lg" /> */}
        </div>
    )
}

const Stepper = ({ currentStep, setCurrentStep }: {
    currentStep: number,
    setCurrentStep: React.Dispatch<SetStateAction<number>>
}) => {

    return (
        <div className="flex justify-between">
            <div role="button" className="cursor-pointer" onClick={() => currentStep !== 0 && setCurrentStep(currentStep - 1)} aria-disabled={currentStep == 0}>
                <ArrowSvg />
            </div>
            {
                currentStep !== 2 ? 
                (
                    <AppButton
                        type="button"
                        text={'Start Fundraiser'} bold bgColor="#4E36E9" textColor="#fff"
                        onClick={() => setCurrentStep(currentStep + 1)}
                    />
                ) : null
            }
        </div>
    )
}

export const StepZero = ({formdata, setFormData}: {
    formdata: MultiFormData,
    setFormData: React.Dispatch<React.SetStateAction<MultiFormData>>
}) => {

    const { register, formState: { errors, touchedFields } } = useFormContext<FundRaiserFormSchema>();

    return (
        <div className="flex flex-col gap-8">
            <label className="text-center text-xl font-semibold">What is the fund for ?</label>

             <input 
                type="text" id="" placeholder="e.g. Medical"
                className={`outline-none rounded-4xl border-2 border-gray-300 px-4 py-2 w-full`}
                value={formdata.fundReason}
                onChange={(e) => setFormData((prev) => ({...prev, fundReason: e.target.value}))}
            />

            <label className="text-center text-xl font-semibold">What is the funding period in days</label>

             <input 
                type="number" id="" placeholder=""
                className={`outline-none rounded-4xl border-2 border-gray-300 px-4 py-2 w-full`}
                value={formdata.fundPeriodInDays}
                onChange={(e) => setFormData((prev) => ({...prev, fundPeriodInDays: e.target.value}))}
            />
        </div>
    )
}

export const StepOne = ({ formdata, setFormData }: {
    formdata: MultiFormData,
    setFormData: React.Dispatch<React.SetStateAction<MultiFormData>>
}) => {

    const { register, formState: { errors, touchedFields } } = useFormContext<FundRaiserFormSchema>();

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
                <label className="text-xl font-semibold">Give your fundraiser a title</label>

                <input 
                    type="text" placeholder="My fundraiser"
                    className={`outline-none rounded-4xl border-2 border-gray-300 px-4 py-2 w-full`}
                    value={formdata.fundRaiserTitle}
                    onChange={(e) => setFormData((prev) => ({...prev, fundRaiserTitle: e.target.value}))}
                />
                {/* {errors.fundRaiserTitle ? (
                    <div className="text-sm text-[#FF3939] font-light">{errors.fundRaiserTitle.message}</div> 
                ) : null} */}
            </div>

            <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xl font-semibold">Give a detailed explanation of what you need funds for</label>
                <textarea 
                    className={`outline-none rounded-2xl border-2 border-gray-300 h-36 px-4 py-2 w-full`}
                    // {...register('fundRaiserDescription')}
                    value={formdata.fundRaiserDescription}
                    onChange={(e) => setFormData((prev) => ({...prev, fundRaiserDescription: e.target.value}))}
                />
                {/* {errors.fundRaiserDescription ? (
                        <div className="text-sm text-[#FF3939] font-light">{errors.fundRaiserDescription.message}</div> 
                    ) : null} */}
            </div>

        </div>
    )
}

export const StepTwo = ({ formdata, setFormData }: {
    formdata: MultiFormData,
    setFormData: React.Dispatch<React.SetStateAction<MultiFormData>>
}) => {

    const { register, formState: { errors, touchedFields } } = useFormContext<FundRaiserFormSchema>();

    const [imagePreview, setImagePreview] = useState('')

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImagePreview(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-5">
                    <h3 className="font-semibold text-xl">Upload Media Proof</h3>
                    <input 
                        type="file" 
                        id='fileInput'
                        // name="profile-picture"
                        accept="image/png, image/jpeg, image/jpg"
                        className="absolute top-0 left-0 w-full h-full opacity-0 -z-10"
                        {...register('mediaProof')}
                        onChange={(e) => handleFileChange(e)}
                    />
                    <label 
                        htmlFor="fileInput"
                        className="cursor-pointer flex flex-col items-center justify-center 
                        h-48 w-48 gap-3 text-center rounded-lg bg-[#f5f5f5] px-5 font-bold"
                        style={{
                            backgroundImage: imagePreview? `url(${imagePreview})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <LiaImage className="text-3xl"/>
                        <p className="">+ Upload Image</p>
                    </label>
                    {errors.mediaProof ? (
                        <div className="text-sm text-[#FF3939] font-light">{errors.mediaProof.message}</div> 
                    ) : null}
                </div>
                
                <div>
                    <p className="text-gray-600 text-sm">Image must be below 1024x1024px. <br />Use PNG or JPG format</p>
                </div>
            </div>

            <div>
                <label htmlFor="" className="font-semibold text-lg">
                    How much do you need ($)
                </label>

                <input 
                    type="text" placeholder="2000000"
                    className={`outline-none rounded-4xl border-2 border-gray-300 px-4 py-2 w-full`}
                    // {...register('fundAmount', { valueAsNumber: true })}
                    value={formdata.fundAmount}
                    onChange={(e) => setFormData((prev) => ({...prev, fundAmount: e.target.value}))}
                />
            </div>
        </div>
    )
}