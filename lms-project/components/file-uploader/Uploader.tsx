"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"

import { Card, CardContent } from "../ui/card"
import { RenderEmptyState, RenderErrorState } from "./RenderState"

type UploaderProps = {
    className?: string
    onDrop?: (files: File[]) => void
}

export function Uploader({ className, onDrop: onDropProp }: UploaderProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            console.log(acceptedFiles)
            onDropProp?.(acceptedFiles)
        },
        [onDropProp],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-72",
                isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary",
                className,
            )}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                <RenderEmptyState isDragActive={isDragActive} />
            </CardContent>
        </Card>
    )
}