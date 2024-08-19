"use server"

import { CROSSMINT_CHALLENGE_URL, DELAY_BETWEEN_FETCHES } from "@/lib/constants";
import axios from "axios"

interface PolyanetProps {
    row: number
    column: number
    candidateId: string
}

export async function createPolyanet({ row, column, candidateId }: PolyanetProps) {
    try {
        await axios.post(`${CROSSMINT_CHALLENGE_URL}/polyanets`, {
            row,
            column,
            candidateId
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(`Created polyanet at ${row}, ${column}`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
        return true
    } catch (error) {
        console.error("Error creating polyanet", error)
        return false
    }
}


export async function deletePolyanet({ row, column, candidateId }: PolyanetProps) {
    try {
        await axios.delete(`${CROSSMINT_CHALLENGE_URL}/polyanets`, {
            data: { row, column, candidateId },
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(`Deleted polyanet at ${row}, ${column}`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
        return true;
    } catch (error) {
        console.error(`Error deleting polyanet at ${row}, ${column}:`, error);
        return false;
    }
}
