
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function InputGroup({ label, ...props }: any) {
    return (
        <div>
            <Label>{label}</Label>
            <Input {...props} required />
        </div>
    )
}

export function TextareaGroup({ label, ...props }: any) {
    return (
        <div>
            <Label>{label}</Label>
            <Textarea {...props} required />
        </div>
    )
}

export function SelectGroup({
    label, name, value, onChange, options
}: {
    label: string
    name: string
    value: string
    onChange: React.ChangeEventHandler<HTMLSelectElement>
    options: string[]
}) {
    return (
        <div>
            <Label>{label}</Label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-2 border rounded bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-gray-700"
                required
            >
                <option value="">Seleccione...</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    )
}
