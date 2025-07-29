"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, X, UserCheck, Users } from "lucide-react"

interface ConfirmRecommendModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  offerTitle: string
}

export function ConfirmRecommendModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  offerTitle
}: ConfirmRecommendModalProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-md p-6 mx-4 bg-background rounded-xl shadow-lg border border-border/50"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            Confirmar Recomendación
          </h3>
          
          <p className="text-muted-foreground">
            ¿Estás seguro que deseas recomendar egresados para la oferta:
          </p>
          
          <div className="px-4 py-2 bg-muted/50 rounded-lg w-full">
            <p className="font-medium text-primary">{offerTitle}</p>
          </div>

          <div className="flex gap-3 w-full pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 animate-pulse" />
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Confirmar
                </span>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}