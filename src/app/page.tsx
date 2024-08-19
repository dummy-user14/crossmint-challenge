import { CandidateIdForm } from "@/components/candidate-id-form";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col mx-auto w-1/2 items-center p-12 space-y-4">
      <Link href="/">
        <Image src="/crossmint-logo.svg" width={300} height={300} alt="Crossmint Logo"/>
      </Link>
      <CandidateIdForm/>
    </main>
  );
}
