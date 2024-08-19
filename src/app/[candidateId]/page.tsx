import { MegaverseCard } from "@/components/megaverse-card";
import { getMap, getMapGoal } from "@/server/map";
import Image from "next/image";
import Link from "next/link";

export default async function CandidateIdPage({ params }: { params: { candidateId: string } }) {
  const candidateId = params.candidateId
  const actualMap = await getMap({ candidateId })
  const goalMap = await getMapGoal({ candidateId })
  return (
    <main className="flex flex-col mx-auto w-1/2 items-center p-12 space-y-4">
      <Link href="/">
        <Image src="/crossmint-logo.svg" width={300} height={300} alt="Crossmint Logo"/>
      </Link>
      <MegaverseCard map={actualMap} goal={goalMap} candidateId={candidateId}/>
    </main>
  );
}
