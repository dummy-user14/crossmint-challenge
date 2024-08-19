"use server"

import axios from "axios"

import { CROSSMINT_CHALLENGE_URL } from "@/lib/constants"

type MapCell = 
  | "SPACE"
  | "POLYANET"
  | "RIGHT_COMETH"
  | "LEFT_COMETH"
  | "UP_COMETH"
  | "DOWN_COMETH"
  | "WHITE_SOLOON"
  | "BLUE_SOLOON"
  | "PURPLE_SOLOON"
  | "RED_SOLOON";

interface CellObject {
  type: number
  color?: string
  direction?: string
}

type CellContent = null | CellObject

export type MegaverseUnconvertedMap = CellContent[][]

interface getMapProps {
  candidateId: string
}

function transformInputToMegaverseEntity (input: CellContent) {  
  if (input?.type === 0) {
    return 'POLYANET'
  }
  if (input?.type === 1 && input?.color === 'red') {
    return 'RED_SOLOON'
  }
  if (input?.type === 1 && input?.color === 'blue') {
    return 'BLUE_SOLOON'
  }
  if (input?.type === 1 && input?.color === 'purple') {
      return 'PURPLE_SOLOON'
  }
  if (input?.type === 1 && input?.color === 'white') {
      return 'WHITE_SOLOON'
  }
  if (input?.type === 2 && input?.direction === 'left') {
      return 'LEFT_COMETH'
  }
  if (input?.type === 2 && input?.direction === 'right') {
      return 'RIGHT_COMETH'
  }
  if (input?.type === 2 && input?.direction === 'up') {
      return 'UP_COMETH'
  }
  if (input?.type === 2 && input?.direction === 'down') {
      return 'DOWN_COMETH'
  }
  return 'SPACE'
}

export async function getMap({ candidateId }: getMapProps): Promise<MegaverseMap> {
  try {
    const mapResponse = await axios.get(`${CROSSMINT_CHALLENGE_URL}/map/${candidateId}`)
    const mapJson = mapResponse.data
    const actualMap: MegaverseUnconvertedMap = mapJson.map.content
    const actualMapConverted = actualMap.map(row => row.map(cell => transformInputToMegaverseEntity(cell)))
    return actualMapConverted
  } catch (error) {
    console.error("Error getting map", error)
    return []
  }
}


export type MegaverseMap = MapCell[][]

interface getMapGoalProps {
  candidateId: string
}

export async function getMapGoal({ candidateId }: getMapGoalProps): Promise<MegaverseMap> {
  const mapResponse = await fetch(`${CROSSMINT_CHALLENGE_URL}/map/${candidateId}/goal`, { cache: "no-cache" })
  const mapJson = await mapResponse.json()
  const map: MegaverseMap = mapJson.goal
  return map
}

