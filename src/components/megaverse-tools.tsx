"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { EntityForm } from "./entity-form"
import { MegaverseActions } from "./megaverse-actions"
import { MegaverseMap } from "@/types/map"

interface MegaverseToolsProps {
    map: MegaverseMap
    goal: MegaverseMap
}

export const MegaverseTools = ({ map, goal }: MegaverseToolsProps) => {
    return (
        <Card className=" bg-slate-50 h-min">
            <CardHeader>
                <CardTitle>Megaverse Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-col items-center">
                <EntityForm/>
                <Separator className="text-xl"/>
                <MegaverseActions map={map} goal={goal}/>
            </CardContent>
        </Card>
    )
}