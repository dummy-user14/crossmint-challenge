# Crossmint Challenge

## TL;DR
This project aims to solve the crossmint challenge, with a full-stack development. You can see a functional demo of the proyect [here](https://vercel.com)

![final-megaverse](/public/final-megaverse.png)

## Table of contents
- [First steps](#first-steps)
- [Postman Collection](#postman-collection)
- [Architecture](#architecture)
- [Automated Resolution](#automated-resolution)
    - [Get Goal Map](#get-goal-map)
    - [Get Actual Map](#get-actual-map)
    - [Normalize Data](#normalize-data)
    - [Iterate](#iterate)
- [Problems Encountered](#problems-encountered)
    - [Content Length](#content-length)
    - [Rate Limiting](#rate-limiting)

## First steps
The first thing to solve the challenge, was to understand the problem and see the tools I had. With the "documentation" provided, it was clear that there were a few endpoints to retrieve and update data from the challenge.

To understand the Megaverse API, I started doing simple requests via Postman, to quickly see and understand the response formats and requests requirements.

My first thought was to use the candidate ID, row and column as a path param (like in the map goal endpoint), but this didn't seem to work, as I was getting a 405 HTTP status code. After a few other format attemps, I understood that I needed to provide all information in the request body.

Once I understood this, the next steps were much easier.

## Postman Collection
For easy understanding of the challenge, I created a simple Postman collection to try all the endpoints, in case some of them work in an unexpected way.

You can download the postman collection [here](/public/megaverse-api-postman-collection.json).

## Architecture
In order to go the extra mile, I thought it would be cool and a real challenge to make a full-stack using the provided API. 

Even thought my main expertise is in back-end development, from time to time I like to learn about front-end development, so this was a great opportunity to put everything into practice.

I chose Next.js as the framework for the challenge because is my maing go-to development tool, when I need to develop some full-stack MVPs or similar projects. Other packages I have used are Zod for validation, axios for data fetching and shadcn & tailwind for styling.

With this in mind, I thought I could abstract all logic of the challenge and make it work for anyone with a candidate ID. So, with the application, you can see and modify the megaverse of any candidate with just a few clicks.

## Automated Resolution
In order to develop an automated solution, without making API call one by one by hand, I divided the workflow into parts.

This workflow changed when I passed from phase 1 to 2. When I saw the diferences between both phases, I thought I could easily automate the solution for both phases with the same code, so the next workflow is valid for phases 1 & 2.

### Get goal map
We need the desired map to achieve our solution, so with the call to `/api/map/[candidateId]/goal` I could obtain the "low level" representation of the megaverse.

Next snippet code we can see the format from that request (I have reduced the number of columns and rows in order to not make the readme unnecesarily big).

```json
{
    "goal": [
        [
            "SPACE",
            "RIGHT_COMETH"
            "SPACE",
        ],
        [
            "SPACE",
            "POLYANET",
            "PURPLE_SOLOON",
        ],
        [
            "DOWN_COMETH",
            "SPACE",
            "POLYANET",
        ]
    ]
}
```
### Get actual map
To get the actual status of our megaverse, we need to perform a request to `/api/map/[candidateId]`.

However, when I requested to that endpoint I got a different format, comparing with the previous one.

Next snippet code we can see the format from that request (I have reduced the number of columns and rows in order to not make the readme unnecesarily big).

```json
{
    "map": {
        "_id": "66bcc6ec99fc403fecab6aec",
        "content": [
            [
                { "type": 0 },
                null,
                null,
            ],
            [
                null,
                { 
                    "type": 1,
                    "color": "purple"
                },
                null,
            ],
            [
                null,
                null,
                { 
                    "type": 2,
                    "direction": "left"
                },
            ],
        ],
        "candidateId": "",
        "phase": 1,
        "__v": 0
    }
}
```
### Normalize data
Once I saw the consistent diff between the two format, I decided to normalize this data, and use always the same format (for this case, typescript, seems a perfect choice on a development perspective).

To fetch my actual megaverse status I ended up developing a function like this:
```ts
interface CellObject {
  type: number
  color?: string
  direction?: string
}

type CellContent = null | CellObject

type MegaverseUnconvertedMap = CellContent[][]

interface getMapProps {
  candidateId: string
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
```

I don't entirely like the purpose of this function because is doing multiple things (fetching & normalizing data), but after needing to normalize the data in multiple other parts of the code, it ended up being the best approach I found.

The function to normalize the data looks like this (this is a simplification of the full function, you can see it in details [here](/src/server/map.ts) on line 33):
```ts
function transformInputToMegaverseEntity (input: CellContent) {  
  if (input?.type === 0) {
    return 'POLYANET'
  } else if (input?.type === 1 && input?.color === 'red') {
    return 'RED_SOLOON'
  } else if (input?.type === 2 && input?.direction === 'up') {
      return 'UP_COMETH'
  }
    return 'SPACE'
}
```

### Iterate
Once you have the same format for both megaverse, the process it is quite simple. You need to do the following:
- Get the entity (polyanet, soloon, cometh or space) on both same positions on each map.
- Iterate the map till you find a difference. In this case, we would have 2 situations:
    - If the goal is a 🌌, we should check if there is another entity in that position. If this happens, we must delete it.
    - If the goal is 🌕, ☄️, or 🪐, we need to create the respective one in that position. It doesn't mother if there is a previous entity, because the create endpoint overrides the previous entity.
- Wait till the loop ends

The code associated with that approach is the following:
```ts
export async function completePhase({ candidateId }: completePhaseProps): Promise<boolean> {
    try {
      const mapGoal = await getMapGoal({ candidateId })
      const actualMap = await getMap({ candidateId })
      for (let rowIndex = 0; rowIndex < mapGoal.length; rowIndex++) {
          for (let columnIndex = 0; columnIndex < mapGoal[rowIndex].length; columnIndex++) {
              const goalCell = mapGoal[rowIndex][columnIndex]
              const actualCell = actualMap[rowIndex][columnIndex]
              if (goalCell !== actualCell) {
                if (goalCell === 'SPACE') {
                  if (actualCell === 'POLYANET') {
                    await deletePolyanet({ row: rowIndex, column: columnIndex, candidateId })
                  } else if (actualCell.includes('SOLOON')) {
                    await deleteSoloon({ row: rowIndex, column: columnIndex, candidateId })
                  } else if (actualCell.includes('COMETH')) {
                    await deleteCometh({ row: rowIndex, column: columnIndex, candidateId })
                  }
                } else if (goalCell === 'POLYANET') {
                  await createPolyanet({ row: rowIndex, column: columnIndex, candidateId})
                } else if (goalCell.includes('SOLOON')) {
                  const color = goalCell.split('_')[0].toLowerCase()
                  await createSoloon({ row: rowIndex, column: columnIndex, color, candidateId })
                } else if (goalCell.includes('COMETH')) {
                  const direction = goalCell.split('_')[0].toLowerCase()
                  await createCometh({ row: rowIndex, column: columnIndex, direction, candidateId})
                }
            }
          }
      }
    } catch (error) {
        console.error("Error completing phase", error)
    }
    return true
  }
```

This steps should be enough to resolve the challenge on an automated way, without looking one by one which entity you need to create or delete.

## Problems encountered
### Content Length
At first, I was using the native fetch method from node.js to retrieve data from the megaverse API, but I was continually getting an unexpected error with the request headers. 

To be specific, the error was about the content length.

![content-length-error.png](/public/content-length-error.png)

Even thought I searched about this problem, I wasn't able to get a workaround with the native fetch method. So I decided to switch to `axios`, because what I saw that this package handles this issue dynamically.

### Rate Limiting
My first thought to make it as efficient as possible was to paralelize every request once you know exactly what changes to make. 

This approach didn't work because of the specifications of the Megaverse API, as there is some kind of rate limiting service behind that blocks multiple concurrent requests at the same time.

This is what the error would look like:

![rate-limiting-error.png](/public/rate-limiting-error.png)

Honestly this have been the bigest problem, because depending the network stability and other factors, the request can be made at the same time. So the easiest workaround I found, was to add some delay everytime I make a request to the API.

With this in mind, a function requesting to the API would look like this:
```ts
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
```

As you can see I have declared a constant to have the same delay between every API request.
