"use server"

import axios from "axios"
import { CROSSMINT_CHALLENGE_URL, DELAY_BETWEEN_FETCHES } from "@/lib/constants";

interface SoloonProps {
    row: number
    column: number
    color?: string
    candidateId: string
}

export async function createSoloon({ row, column, color, candidateId }: SoloonProps) {
    try {
        await axios.post(`${CROSSMINT_CHALLENGE_URL}/soloons`, {
            row,
            column,
            color,
            candidateId
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(`Created soloon at ${row}, ${column}`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
        return true
    } catch (error) {
        console.error("Error creating polyanet", error)
        return false
    }
}

export async function deleteSoloon({ row, column, candidateId }: SoloonProps) {
    try {
        await axios.delete(`${CROSSMINT_CHALLENGE_URL}/soloons`, {
            data: {
                row,
                column,
                candidateId
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(`Deleted soloon at ${row}, ${column}`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
        return true
    } catch (error) {
        console.error("Error deleting Soolon", error)
        return false
    }
}