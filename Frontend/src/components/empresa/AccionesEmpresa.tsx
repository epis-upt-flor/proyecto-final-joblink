import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccionesEmpresa({
    empresaId,
    onEdit,
}: {
    empresaId: number;
    onEdit: () => void;
}) {
    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/empresa/${empresaId}`);
    };

    return (
        <TooltipProvider>
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={handleView}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ver Empresa</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={onEdit}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Editar Empresa</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
