"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "./ui/separator"
import { getMap } from "@/server/map"
import { useRouter } from "next/navigation"


interface CandidateIdFormProps {
}

const candidateIdSchema = z.object({
    candidateId: z.string().min(1, "Candidate ID is required"),
})

export const CandidateIdForm = () => {
    // const [candidateId, setCandidateId] = useState("")
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof candidateIdSchema>>({
        resolver: zodResolver(candidateIdSchema),
        defaultValues: {
            candidateId: "",
        },
    })

    async function onSubmit(values: z.infer<typeof candidateIdSchema>) {
        const map = await getMap({ candidateId: values.candidateId })
        if (map.length === 0) {
            toast({
                title: "Error ⚠️",
                description: "Invalid Candidate ID",
                variant: "destructive",
            })
            return
        } else {
            toast({
                title: "Candidate ID Set ✅",
                description: "Your Candidate ID has been set successfully.",
                variant: "success",
            })
            router.push(`/${values.candidateId}`)
        }
    }

    return (
        <Card className="bg-slate-50 h-min">
            <CardHeader>
                <CardTitle>Megaverse Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-col items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="candidateId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Candidate ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your-candidate-id" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the ID you should have received on your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            <Button type="submit" className="bg-gradient-to-r from-[#60FA97] to-[#59DEF5] font-semibold text-xl text-[#29414D]">
                                Set Candidate ID
                            </Button>
                        </div>
                    </form>
                </Form>
                <Separator/>
            </CardContent>
        </Card>
      
    )
}