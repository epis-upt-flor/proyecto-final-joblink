import { InputGroup, SelectGroup } from "@/components/shared/FormFields"

export default function DatosPersonales({ formData, onChange }: any) {
    return (
        <div className="space-y-4">
            <InputGroup label="Nombres" name="nombres" value={formData.nombres} onChange={onChange} />
            <InputGroup label="Apellidos" name="apellidos" value={formData.apellidos} onChange={onChange} />
            <SelectGroup label="Tipo Documento" name="tipoDoc" value={formData.tipoDoc} onChange={onChange} options={["DNI", "CARNET_EXTRANJERIA", "PASAPORTE"]} />
            <InputGroup label="N° Documento" name="numDoc" value={formData.numDoc} onChange={onChange} />
            <InputGroup label="Email" name="email" value={formData.email} onChange={onChange} />
            <InputGroup label="Teléfono" name="telefono" value={formData.telefono} onChange={onChange} />
            <InputGroup label="Dirección" name="direccion" value={formData.direccion} onChange={onChange} />
            <InputGroup label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={onChange} />
            <InputGroup type="date" label="Fecha Nacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={onChange} />
        </div>
    )
}
