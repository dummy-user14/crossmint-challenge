"use server"

import { createSoloon, deleteSoloon } from "./soolons"
import { createCometh, deleteCometh } from "./comeths"
import { createPolyanet, deletePolyanet } from "./polyanets"
import { getMap, getMapGoal } from "./map"

interface restartMapProps {
    candidateId: string
  }
  
  export async function restartMap({ candidateId }: restartMapProps): Promise<true> {
    const actualMap = await getMap({ candidateId });
    const entities = actualMap.flat()
    const notSpace = entities.filter(entity => entity !== 'SPACE')
    const entitiesCount = notSpace.length
    console.log('Entities count:', entitiesCount)
    let entitiesDeleted = 0
    for (let rowIndex = 0; rowIndex < actualMap.length; rowIndex++) {
      for(let columnIndex = 0; columnIndex < actualMap[rowIndex].length; columnIndex++) {
        const cell = actualMap[rowIndex][columnIndex]
        if (cell !== 'SPACE') {
          if (cell === 'POLYANET') {
            await deletePolyanet({ row: rowIndex, column: columnIndex, candidateId })
            entitiesDeleted++
          } else if (cell.includes('SOLOON')) {
            await deleteSoloon({ row: rowIndex, column: columnIndex, candidateId })
            entitiesDeleted++
          } else if (cell.includes('COMETH')) {
            await deleteCometh({ row: rowIndex, column: columnIndex, candidateId })
            entitiesDeleted++
          }
        }
      }
    }
    return true;
  }
  
  interface verifyMapProps {
    candidateId: string
  }
  
  export async function verifyMap({ candidateId }: verifyMapProps): Promise<boolean> {
    const actualMap = await getMap({ candidateId });
    const goalMap = await getMapGoal({ candidateId });
    const equal = JSON.stringify(actualMap) === JSON.stringify(goalMap)
    return equal;
  }
  
  interface completePhaseProps {
    candidateId: string
  }

  export async function completePhase({ candidateId }: completePhaseProps): Promise<boolean> {
    try {
      const mapGoal = await getMapGoal({ candidateId })
      const actualMap = await getMap({ candidateId })
      for (let rowIndex = 0; rowIndex < mapGoal.length; rowIndex++) {
          for (let columnIndex = 0; columnIndex < mapGoal[rowIndex].length; columnIndex++) {
              const goalCell = mapGoal[rowIndex][columnIndex]
              const actualCell = actualMap[rowIndex][columnIndex]
              if (goalCell !== actualCell) {
                if (goalCell === 'SPACE') {
                  if (actualCell === 'POLYANET') {
                    await deletePolyanet({ row: rowIndex, column: columnIndex, candidateId })
                  } else if (actualCell.includes('SOLOON')) {
                    await deleteSoloon({ row: rowIndex, column: columnIndex, candidateId })
                  } else if (actualCell.includes('COMETH')) {
                    await deleteCometh({ row: rowIndex, column: columnIndex, candidateId })
                  }
                } else if (goalCell === 'POLYANET') {
                  await createPolyanet({ row: rowIndex, column: columnIndex, candidateId})
                } else if (goalCell.includes('SOLOON')) {
                  const color = goalCell.split('_')[0].toLowerCase()
                  await createSoloon({ row: rowIndex, column: columnIndex, color, candidateId })
                } else if (goalCell.includes('COMETH')) {
                  const direction = goalCell.split('_')[0].toLowerCase()
                  await createCometh({ row: rowIndex, column: columnIndex, direction, candidateId})
                }
            }
          }
      }
    } catch (error) {
        console.error("Error completing phase", error)
    }
    return true
  }