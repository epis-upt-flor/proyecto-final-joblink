import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, Pencil } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AccionesEgresado({
    egresadoId,
    onEdit,
}: {
    egresadoId: number
    onEdit: () => void
}) {
    const navigate = useNavigate()

    const handleView = () => {
        navigate(`/egresado/${egresadoId}`)
    }

    return (
        <TooltipProvider>
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={handleView}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ver Egresado</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={onEdit}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Editar Egresado</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
