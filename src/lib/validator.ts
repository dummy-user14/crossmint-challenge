import { z } from "zod"

export const candidateIdSchema = z.object({
    candidateId: z.string().uuid()
})

export const isValidCandidateId = (candidateId: string) => {
    const parseResult = candidateIdSchema.safeParse({ candidateId })
    return parseResult.success
}