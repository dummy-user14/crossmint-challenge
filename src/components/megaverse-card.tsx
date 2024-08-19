import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MegaverseMap } from "@/server/map"
import { MegaverseTools } from "./megaverse-tools"
import { MegaverseGrid } from "./megaverse-grid"


interface MegaverseCardProps {
    map: MegaverseMap
    goal: MegaverseMap
    candidateId: string
}

export const MegaverseCard = ({ map, goal, candidateId }: MegaverseCardProps) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Crossmint Megaverse</CardTitle>
                    <CardDescription>{candidateId}</CardDescription>
                </CardHeader>
                <CardContent className="flex space-x-2">
                    <Tabs defaultValue="map" className=" bg-slate-50 border p-2 rounded-lg ">
                        <TabsList>
                            <TabsTrigger value="map">Your Map</TabsTrigger>
                            <TabsTrigger value="goal">Goal</TabsTrigger>
                        </TabsList>
                        <TabsContent value="map" className="flex">
                            <MegaverseGrid megaverse={map}/>
                        </TabsContent>
                        <TabsContent value="goal">
                            <MegaverseGrid megaverse={goal}/>
                        </TabsContent>
                    </Tabs>
                    <MegaverseTools candidateId={candidateId}/>
                </CardContent>
            </Card>
        </>
    )
}