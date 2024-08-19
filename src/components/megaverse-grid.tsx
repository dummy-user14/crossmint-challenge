import { MegaverseMap } from "@/server/map"
import { MegaverseEntity } from "./megaverse-entity"

interface Grid {
    megaverse: MegaverseMap
}

export const MegaverseGrid = ({megaverse}: Grid) => {
    return (
        <main>
            {
                megaverse.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {
                            row.map((cell, cellIndex) => (
                                <div key={cellIndex} className="">
                                    <MegaverseEntity entity={cell}/>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </main>
    )
}