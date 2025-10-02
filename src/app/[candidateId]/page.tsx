import { MegaverseCard } from "@/components/megaverse-card";
import { getMap, getMapGoal } from "@/server/map";
import Image from "next/image";
import Link from "next/link";
import { clearCandidateId, setCandidateId } from "@/server/http-client";
import { isValidCandidateId } from "@/lib/validator";
import { redirect } from "next/navigation";

export default async function CandidateIdPage(props: { params: Promise<{ candidateId: string }> }) {
  const params = await props.params;
  const candidateId = params.candidateId
  if (!isValidCandidateId(candidateId)) {
    clearCandidateId()
    // Redirect to main page
    redirect('/')
  }
  setCandidateId(candidateId)
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
