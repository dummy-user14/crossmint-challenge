import { FC, useState } from "react"
import { Button } from "./ui/button"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { completePhase, restartMap, verifyMap } from "@/server/actions"
import { Loader } from "./loader"


interface MegaverseActionsProps {
    candidateId: string
}

export const MegaverseActions: FC<MegaverseActionsProps> = ({ candidateId }) => {
    const router = useRouter()
    const [isRestarting, setIsRestarting] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    
    const handleRestartMap = async () => {
        setIsRestarting(true)
        try {
            await restartMap({ candidateId })
            console.log("Map restarted")
            toast({
                title: "Map restarted ✅",
                description: "All entities have been deleted",
                variant: "success",
            })
        } catch (error) {
            console.error("Error restarting map", error)
        } finally {
            setIsRestarting(false)
            router.refresh()
        }
    }

    const handleCompletePhase = async () => {
        setIsCompleting(true)
        try {
            await completePhase({ candidateId })
            console.log("Map completed")
            toast({
                title: "Phase completed ✅",
                description: "All entities have been created",
                variant: "success",
            })
        } catch (error) {
            console.error("Error restarting map", error)
        } finally {
            setIsCompleting(false)
            router.refresh()
        }
    }
    
    const handleVerify = async () => {
        setIsVerifying(true)
        try {
            const equal = await verifyMap({ candidateId })
            if (equal) {
                toast({
                    title: "Map Verified ✅",
                    description: "The map has been verified successfully.",
                    variant: "success",
                })
            } else {
                toast({
                    title: "Map Verification Failed ⚠️",
                    description: "Your map does not match the goal map.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error verifying map", error)
        } finally {
            setIsVerifying(false)
            router.refresh()
        }
    }

    return (
        <div className="flex flex-col space-y-2 mx-auto">
            {isVerifying && <Loader focus="verifying" message="This shouldn't take long"/>}
            {isCompleting && <Loader focus="completing" message="This can take up to 3 minutes"/>}
            {isRestarting && <Loader focus="restarting" message="This can take up to 3 minutes"/>}
            <Button 
                onClick={handleRestartMap}
                disabled={isRestarting}
                className="bg-gradient-to-r from-[#60FA97] to-[#59DEF5] font-semibold text-xl text-[#29414D] min-w"
            >
                Restart Map
            </Button>
            <Button 
                onClick={handleCompletePhase}
                disabled={isCompleting}
                className="bg-gradient-to-r from-[#60FA97] to-[#59DEF5] font-semibold text-xl text-[#29414D] min-w"
            >
                Complete Phase
            </Button>
            <Button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="bg-gradient-to-r from-[#60FA97] to-[#59DEF5] font-semibold text-xl text-[#29414D]"
            >
                Verify Phase
            </Button>
        </div>
    )
}
