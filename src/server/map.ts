"use server"

import { MegaverseMap, MegaverseUnconvertedMap, CellContent } from "@/types/map"
import { crossmintHttpClient } from "./http-client"
import { Entity } from "@/types/entity"

const ENTITY_BY_KEY: Record<string, Entity> = {
  '0': 'POLYANET',
  '1:red': 'RED_SOLOON',
  '1:blue': 'BLUE_SOLOON',
  '1:purple': 'PURPLE_SOLOON',
  '1:white': 'WHITE_SOLOON',
  '2:left': 'LEFT_COMETH',
  '2:right': 'RIGHT_COMETH',
  '2:up': 'UP_COMETH',
  '2:down': 'DOWN_COMETH',
}

function transformInputToMegaverseEntity (input: CellContent) {
  if (!input) return 'SPACE'

  const key = input.type === 0
    ? '0'
    : input.type === 1 && input.color
    ? `1:${input.color}`
    : input.type === 2 && input.direction
    ? `2:${input.direction}`
    : null

  return (key && ENTITY_BY_KEY[key]) || 'SPACE'
}

interface getMapParams {
  candidateId: string
}

export async function getMap({ candidateId }: getMapParams): Promise<MegaverseMap> {
  try {
    const mapResponse = await crossmintHttpClient.get(`/map/${candidateId}`)
    const mapJson = mapResponse.data
    const actualMap: MegaverseUnconvertedMap = mapJson.map.content
    const actualMapConverted = actualMap.map(row => row.map(cell => transformInputToMegaverseEntity(cell)))
    return actualMapConverted
  } catch (error) {
    console.error("Error fetching map, redirecting to main page", error)
    return []
  }
}

interface getMapGoalParams {
  candidateId: string
}

export async function getMapGoal({ candidateId }: getMapGoalParams): Promise<MegaverseMap> {
  const mapResponse = await crossmintHttpClient.get(`/map/${candidateId}/goal`)
  const mapJson = mapResponse.data
  const map: MegaverseMap = mapJson.goal
  return map
}
