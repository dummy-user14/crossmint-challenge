"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { EntityForm } from "./entity-form"
import { MegaverseActions } from "./megaverse-actions"

interface MegaverseToolsProps {
    candidateId: string
}

export const MegaverseTools = ({ candidateId }: MegaverseToolsProps) => {
    return (
        <Card className=" bg-slate-50 h-min">
            <CardHeader>
                <CardTitle>Megaverse Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-col items-center">
                <EntityForm candidateId={candidateId}/>
                <Separator className="text-xl"/>
                <MegaverseActions candidateId={candidateId}/>
            </CardContent>
        </Card>
    )
}