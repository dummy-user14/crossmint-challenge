"use server"

import { createEntity, deleteEntity } from "./entity"
import { Endpoint, ENTITIES_ENUM } from "@/types/entity"
import { MegaverseMap } from "@/types/map"

interface restartMapParams {
  map: MegaverseMap
}
  
export async function getEndpoint(entity: string) {
  if (entity === ENTITIES_ENUM.POLYANET) return 'polyanets'
  if (entity.includes(ENTITIES_ENUM.SOLOON)) return 'soloons'
  if (entity.includes(ENTITIES_ENUM.COMETH)) return 'comeths'
  return null
}

export async function restartMap({ map }: restartMapParams): Promise<void> {
  for (let row = 0; row < map.length; row++) {
    for(let column = 0; column < map[row].length; column++) {
      const cell = map[row][column]
      const endpoint = await getEndpoint(cell)
      if (endpoint) {
        await deleteEntity(endpoint, { row, column })
      }
    }
  }
}
  
interface verifyMapParams {
  map: MegaverseMap
  goal: MegaverseMap
}

export async function verifyMap({ map, goal }: verifyMapParams): Promise<boolean> {
  return JSON.stringify(map) === JSON.stringify(goal)
}
  
interface completePhaseParams {
  map: MegaverseMap
  goal: MegaverseMap
}

export async function completePhase({ map, goal }: completePhaseParams): Promise<boolean> {
  try {
    for (let row = 0; row < goal.length; row++) {
      for (let column = 0; column < goal[row].length; column++) {
        const goalCell = goal[row][column]
        const actualCell = map[row][column]
        const endpointToDelete = await getEndpoint(actualCell) as Endpoint
        const endpoint = await getEndpoint(goalCell) as Endpoint
        if (goalCell !== actualCell) {
          if (goalCell === ENTITIES_ENUM.SPACE) {
            await deleteEntity(endpointToDelete, { row, column })
          } else if (goalCell === ENTITIES_ENUM.POLYANET) {
            await createEntity(endpoint, { row, column })
          } else if (goalCell.includes(ENTITIES_ENUM.SOLOON)) {
            const color = goalCell.split('_')[0].toLowerCase()
            await createEntity(endpoint, { row, column, color })
          } else if (goalCell.includes(ENTITIES_ENUM.COMETH)) {
            const direction = goalCell.split('_')[0].toLowerCase()
            await createEntity(endpoint, { row, column, direction })
          }
        }
      }
    }
  } catch (error) {
      console.error("Error completing phase", error)
  }
  return true
}