"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useId } from "react";

interface ListInputProps {
    label: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    items: string[];
    setItems: Dispatch<SetStateAction<string[]>>;
}

export function ListInput({
    label,
    value,
    setValue,
    items,
    setItems,
}: ListInputProps) {
    const inputId = useId();

    const addItem = () => {
        const trimmed = value.trim();
        if (trimmed && !items.includes(trimmed)) {
            setItems([...items, trimmed]);
            setValue("");
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label htmlFor={inputId} className="block font-medium mb-1">
                {label}
            </label>
            <div className="flex gap-2 mb-2">
                <Input
                    id={inputId}
                    placeholder={`Agregar ${label.toLowerCase()}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addItem();
                        }
                    }}
                />
                <Button type="button" size="sm" onClick={addItem} aria-label={`Agregar ${label}`}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex flex-wrap gap-2" role="list">
                {items.map((item, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                        role="listitem"
                    >
                        {item}
                        <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeItem(index)}
                            aria-label={`Eliminar ${item}`}
                        />
                    </Badge>
                ))}
            </div>
        </div>
    );
}
