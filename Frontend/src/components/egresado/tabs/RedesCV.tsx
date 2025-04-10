
import { InputGroup } from "@/components/shared/FormFields"

export default function RedesCV({ formData, onChange }: any) {
    return (
        <div className="space-y-4">
            <InputGroup label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={onChange} />
            <InputGroup label="GitHub" name="github" value={formData.github} onChange={onChange} />
        </div>
    )
}
