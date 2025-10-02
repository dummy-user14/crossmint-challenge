import { Entity } from "./entity"

export type MegaverseMap = Entity[][]

export interface CellObject {
  type: number
  color?: string
  direction?: string
}
  
export type CellContent = null | CellObject

export type MegaverseUnconvertedMap = CellContent[][]
