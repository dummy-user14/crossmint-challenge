export const ENTITIES = [
  "SPACE",
  "POLYANET",
  "RIGHT_COMETH",
  "LEFT_COMETH",
  "UP_COMETH",
  "DOWN_COMETH",
  "WHITE_SOLOON",
  "BLUE_SOLOON",
  "PURPLE_SOLOON",
  "RED_SOLOON"
] as const

export type Entity = (typeof ENTITIES)[number]

export const ENTITIES_ENUM = {
    ...ENTITIES.reduce(
    (acc, key) => ({ ...acc, [key]: key }),
    {} as Record<Entity, Entity>
  ),
  COMETH: "COMETH",
  SOLOON: "SOLOON"
} as const

export type Endpoint = "polyanets" | "soloons" | "comeths"