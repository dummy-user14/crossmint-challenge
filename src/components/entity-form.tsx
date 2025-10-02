'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { EntityKey, MegaverseEntity } from "./megaverse-entity"
import { createEntity, deleteEntity } from "@/server/entity"
import { getEndpoint } from "@/server/actions"
import { Endpoint, ENTITIES, ENTITIES_ENUM } from "@/types/entity"

export async function handleCreateEntity(entity: EntityKey, row: number, column: number) {
    console.log(`Creating entity ${entity} at [${row}, ${column}]`)
    const endpoint = await getEndpoint(entity) as Endpoint
    if (entity === ENTITIES_ENUM.POLYANET) {
        console.log("Creating polyanet")
        await createEntity(endpoint, { row, column })
    } else if (entity.includes(ENTITIES_ENUM.SOLOON)) {
        console.log("Creating soloon")
        const color = entity.split("_")[0].toLowerCase()
        await createEntity("soloons", { row, column, color })
    } else if (entity.includes(ENTITIES_ENUM.COMETH)) {
        console.log("Creating cometh")
        const direction = entity.split("_")[0].toLowerCase()
        await createEntity("comeths",{ row, column, direction })
    }
}

export async function handleDeleteEntity(entity: EntityKey, row: number, column: number) {
    console.log(`Deleting entity ${entity} at [${row}, ${column}]`)
    const endpoint = await getEndpoint(entity) as Endpoint
    await deleteEntity(endpoint, { row, column })
}

const entityFormSchema = z.object({
    entity: z.string(),
    row: z.coerce.number().max(29),
    column: z.coerce.number().max(29),
})

export const EntityForm = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof entityFormSchema>>({
        resolver: zodResolver(entityFormSchema),
        defaultValues: { entity: ENTITIES_ENUM.POLYANET, row: 0, column: 0 },
    })

    function onSubmit(values: z.infer<typeof entityFormSchema>, action: 'create' | 'delete') {      
        const handler = action === 'create' ? handleCreateEntity : handleDeleteEntity
        handler(values.entity as EntityKey, values.row, values.column)
        
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
                                    ENTITIES.filter(e => e !== 'SPACE').map(entity => (
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
                        className="bg-gradient-to-r from-[#00FF85] to-[#00E0FF] font-semibold text-xl text-[#29414D]"
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
