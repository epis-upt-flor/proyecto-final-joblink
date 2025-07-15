"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { crearEgresadosMasivo } from "@/api/egresadoApi"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UploadCloud, FileCheck, Loader2, XCircle, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CargaMasivaEgresadosModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (v: boolean) => void, onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    
    if (!f.name.match(/\.(xlsx|csv)$/i)) {
      toast.error("Formato no válido", {
        description: "Por favor suba un archivo Excel (.xlsx) o CSV (.csv)"
      })
      return
    }

    processFile(f)
  }

  const processFile = (f: File) => {
    setFile(f)
    setPreview([])
    
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: "binary" })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[]
        
        if (data.length === 0) {
          toast.warning("Archivo vacío", {
            description: "El archivo no contiene datos para procesar"
          })
          return
        }
        
        setPreview(data)
        toast.success("Archivo cargado", {
          description: `Se encontraron ${data.length} registros`
        })
      } catch (err) {
        console.error(err)
        toast.error("Error al leer archivo", {
          description: "El formato del archivo no es válido"
        })
      }
    }
    reader.readAsBinaryString(f)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const f = e.dataTransfer.files?.[0]
    if (f) processFile(f)
  }

  const handleSubmit = async () => {
    if (!preview.length) return toast.error("No hay datos para enviar")

    setIsSubmitting(true)

    try {
      // Mapear los datos del excel al modelo
      const payload = preview.map(row => ({
        nombres: row.nombres || "",
        apellidos: row.apellidos || "",
        tipoDoc: row.tipoDoc || "DNI",
        numDoc: row.numDoc || "",
        email: row.email || "",
        telefono: row.telefono || "",
        fechaNacimiento: row.fechaNacimiento,
        direccion: row.direccion || null,
        nacionalidad: row.nacionalidad || null,
        linkedin: row.linkedin || null,
        github: row.github || null,
        disponibilidad: row.disponibilidad !== undefined ? Boolean(row.disponibilidad) : true,
        habilidades: row.habilidades ? JSON.parse(row.habilidades) : [],
        logrosAcademicos: row.logrosAcademicos ? JSON.parse(row.logrosAcademicos) : [],
        certificados: row.certificados ? JSON.parse(row.certificados) : [],
        experienciaLaboral: row.experienciaLaboral ? JSON.parse(row.experienciaLaboral) : [],
        idiomas: row.idiomas ? JSON.parse(row.idiomas) : [],
      }))

      await crearEgresadosMasivo(payload)

      toast.success("¡Carga exitosa!", {
        description: `${preview.length} egresados fueron registrados correctamente`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      })
      
      setFile(null)
      setPreview([])
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error("Error en la carga", {
        description: "Hubo un problema al registrar los egresados",
        icon: <XCircle className="w-5 h-5 text-destructive" />
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview([])
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setFile(null)
        setPreview([])
      }
      onOpenChange(open)
    }}>
<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
  <DialogHeader>
    <DialogTitle className="flex items-center gap-2">
      <UploadCloud className="w-5 h-5" />
      <span>Carga Masiva de Egresados</span>
    </DialogTitle>
    <DialogDescription>
      Sube un archivo Excel o CSV con la información de los egresados
    </DialogDescription>
  </DialogHeader>

  <div className="flex-1 overflow-y-auto">
    <AnimatePresence mode="wait">
      {!file ? (
        <motion.div
          key="upload"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .csv"
              onChange={handleFile}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium">
                  {isDragging ? 'Suelta tu archivo aquí' : 'Arrastra tu archivo o haz clic para seleccionar'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Formatos soportados: .xlsx, .csv
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : preview.length > 0 ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">{file.name}</span>
              <span className="text-sm text-muted-foreground">{preview.length} registros</span>
            </div>
            <Button
              size="sm"
              onClick={handleReset}
              className="
                bg-sky-500 
                hover:bg-sky-600 
                active:bg-sky-700 
                text-white 
                transition-colors
              "
            >
              Cambiar archivo
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden relative">
            <div className="overflow-x-auto">
              <div className="max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      {Object.keys(preview[0]).map(key => (
                        <TableHead
                          key={key}
                          className="whitespace-nowrap px-4 py-2 bg-muted/50"
                        >
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(0, 10).map((row, i) => (
                      <TableRow key={i}>
                        {Object.values(row).map((value: any, j) => (
                          <TableCell
                            key={j}
                            className="truncate px-4 py-2 max-w-[200px]"
                            title={typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          >
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {preview.length > 10 && (
                      <TableRow>
                        <TableCell
                          colSpan={Object.keys(preview[0]).length}
                          className="text-center text-muted-foreground py-4 bg-muted/10"
                        >
                          ...y {preview.length - 10} registros más
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center py-8"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </motion.div>
      )}
    </AnimatePresence>
  </div>

  <DialogFooter>
    <Button
      variant="outline"
      onClick={() => {
        setFile(null)
        setPreview([])
        onOpenChange(false)
      }}
    >
      Cancelar
    </Button>
    <Button
      onClick={handleSubmit}
      disabled={isSubmitting || !preview.length}
      className="gap-2"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Procesando...</span>
        </>
      ) : (
        <>
          <UploadCloud className="w-4 h-4" />
          <span>Subir {preview.length > 0 ? `${preview.length} registros` : ''}</span>
        </>
      )}
    </Button>
  </DialogFooter>
</DialogContent>
    </Dialog>
  )
}