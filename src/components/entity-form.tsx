import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { FC, useState, useTransition } from "react"
import { EntityKey, MegaverseEntity } from "./megaverse-entity"

import { createPolyanet, deletePolyanet } from "@/server/polyanets"
import { createSoloon, deleteSoloon } from "@/server/soolons"
import { createCometh, deleteCometh } from "@/server/comeths"

export async function handleCreateEntity(entity: EntityKey, row: number, column: number, candidateId: string) {
    console.log("Creating entity")
    if (entity === "POLYANET") {
        console.log("Creating polyanet")
        await createPolyanet({ row, column, candidateId })
    } else if (entity.includes("SOLOON")) {
        console.log("Creating soloon")
        const color = entity.split("_")[0].toLowerCase()
        await createSoloon({ row, column, color, candidateId })
    } else if (entity.includes("COMETH")) {
        console.log("Creating cometh")
        const direction = entity.split("_")[0].toLowerCase()
        await createCometh({ row, column, direction, candidateId })
    }
}

export async function handleDeleteEntity(entity: EntityKey, row: number, column: number, candidateId: string) {
    console.log("Deleting entity")
    if (entity === "POLYANET") {
        console.log("Deleting polyanet")
        await deletePolyanet({ row, column, candidateId })
    } else if (entity.includes("SOLOON")) {
        console.log("Deleting soloon")
        await deleteSoloon({ row, column, candidateId })
    } else if (entity.includes("COMETH")) {
        console.log("Deleting cometh")
        await deleteCometh({ row, column, candidateId })
    }
}



const ENTITIES = [
    "POLYANET",
    "WHITE_SOLOON",
    "PURPLE_SOLOON",
    "RED_SOLOON",
    "BLUE_SOLOON",
    "LEFT_COMETH",
    "RIGHT_COMETH",
    "UP_COMETH",
    "DOWN_COMETH"
] as EntityKey[]

interface EntityFormProps {
    candidateId: string
}


const entityFormSchema = z.object({
    candidateId: z.string(),
    entity: z.string(),
    row: z.coerce.number().max(29),
    column: z.coerce.number().max(29),
})

export const EntityForm: FC<EntityFormProps> = ({ candidateId }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof entityFormSchema>>({
        resolver: zodResolver(entityFormSchema),
        defaultValues: { candidateId },
    })

    function onSubmit(values: z.infer<typeof entityFormSchema>, action: 'create' | 'delete') {
        if (!candidateId) {
            toast({
                variant: "destructive",
                description: "Please enter a Candidate ID first",
            })
            return
        }
        
        const handler = action === 'create' ? handleCreateEntity : handleDeleteEntity
        handler(values.entity as EntityKey, values.row, values.column, values.candidateId)
        
        startTransition(() => {
            router.refresh()
            toast({
                description: (
                    <div className="flex text-xl items-center">
                        <MegaverseEntity entity={values.entity as EntityKey}/> was {action}d at [{values.row}, {values.column}]
                    </div>
                ),
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => onSubmit(values, 'create'))} className="space-y-2">
                {/* Entity, Row, and Column FormFields go here (similar to the original code) */}
                <FormField
                    control={form.control}
                    name="entity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Entity</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Entity" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {
                                    ENTITIES.map(entity => (
                                        <SelectItem key={entity} value={entity}>
                                            <MegaverseEntity entity={entity}/>
                                        </SelectItem>
                                    ))
                                }
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                The entity you want to place on the map.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="row"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Coordinate X</FormLabel>
                            <FormControl>
                                <Input placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>
                                The row you want to place the entity.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="column"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Coordinate Y</FormLabel>
                            <FormControl>
                                <Input placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>
                                The column you want to place the entity.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center space-x-2">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="bg-gradient-to-r from-[#60FA97] to-[#59DEF5] font-semibold text-xl text-[#29414D]"
                    >
                        {isPending ? "Creating..." : "Create"}
                    </Button>
                    <Button 
                        variant="destructive"
                        type="button" 
                        onClick={() => form.handleSubmit((values) => onSubmit(values, 'delete'))()}
                        disabled={isPending}
                        className="font-semibold text-xl"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
