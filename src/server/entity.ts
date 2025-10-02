"use server"

import { Endpoint } from "@/types/entity";
import { crossmintHttpClient } from "./http-client";
import { isAxiosError } from "axios";

const DELAY_BETWEEN_FETCHES = Number(process.env.DELAY_BETWEEN_FETCHES)

interface EntityParams {
    row: number
    column: number
    color?: string
    direction?: string
}

export async function createEntity(entity: Endpoint, payload: EntityParams) {
    try {
        await crossmintHttpClient.post(`/${entity}`, payload)
        console.log(`Created ${entity.slice(0, -1)} at ${payload.row}, ${payload.column}`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
    } catch (error) {
        if (isAxiosError(error)) {
            const errorMessage = error.response?.status === 429 ? 'Rate limit exceeded' : error.message;
            console.error(`Error creating ${entity.slice(0, -1)}: ${errorMessage}`)
        } else {
            console.error(`Unexpected error creating ${entity.slice(0, -1)}`, error)
        }
    }
}

export async function deleteEntity(entity: Endpoint, payload: EntityParams) {
    try {
        await crossmintHttpClient.delete(`/${entity}`, { data: payload })
        console.log(`Deleted ${entity.slice(0, -1)} at ${payload.row}, ${payload.column}`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FETCHES))
    } catch (error) {
        if (isAxiosError(error)) {
            const errorMessage = error.response?.status === 429 ? 'Rate limit exceeded' : error.message;
            console.error(`Error deleting ${entity.slice(0, -1)}: ${errorMessage}`)
        } else {
            console.error(`Unexpected error deleting ${entity.slice(0, -1)}`, error)
        }

    }
}


