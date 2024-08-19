"use server"

import axios from "axios"
import { CROSSMINT_CHALLENGE_URL, DELAY_BETWEEN_FETCHES } from "@/lib/constants";

interface ComethsProps {
    row: number
    column: number
    direction?: string
    candidateId: string
}

export async function createCometh({ row, column, direction, candidateId }: ComethsProps) {
    try {
        await axios.post(`${CROSSMINT_CHALLENGE_URL}/comeths`, {
            row,
            column,
            direction,
            candidateId
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(`Created cometh at ${row}, ${column}`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
        return true
    } catch (error) {
        console.error("Error creating polyanet", error)
        return false
    }
}

export async function deleteCometh({ row, column, candidateId }: ComethsProps) {
    try {
        await axios.delete(`${CROSSMINT_CHALLENGE_URL}/comeths`, {
            data: {
                row,
                column,
                candidateId
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(`Deleted cometh at ${row}, ${column}`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
        return true
    } catch (error) {
        console.error("Error deleting Cometh", error)
        return false
    }
}