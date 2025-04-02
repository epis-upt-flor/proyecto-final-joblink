import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil } from "lucide-react";

export default function AccionesCell({
    isAdmin,
    onView,
    onEdit,
}: {
    isAdmin: boolean;
    onView: () => void;
    onEdit: () => void;
}) {
    return (
        <div className="flex items-center justify-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onView}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ver oferta</TooltipContent>
                </Tooltip>

                {isAdmin && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onEdit}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar oferta</TooltipContent>
                    </Tooltip>
                )}
            </TooltipProvider>
        </div>
    );
}
