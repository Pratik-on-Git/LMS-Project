"use client"

import { useCallback, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"

import { Card, CardContent } from "../ui/card"
import { RenderEmptyState, RenderErrorState } from "./RenderState"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

type UploaderProps = {
    className?: string
    onDrop?: (files: File[]) => void
}

interface UploaderState {
    id: string | null
    file: File | null
    uploading: boolean
    progress: number
    key?: string
    isDeleting: boolean
    error: boolean
    objectUrl?: string
    fileType: "image" | "video"

}

export function Uploader({ className, onDrop: onDropProp }: UploaderProps) {

    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    })

    function uploadFile(file: File) {
        setFileState((prev) =>({
            ...prev,
            uploading: true,
            progress: 0,
        }))

        try {

        }
        catch (error) {
            
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) {
            const file = acceptedFiles[0]

            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: "image",
            })
        }
    },

        [],
    )

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === "too-many-files")

            const fileSizeToBig = fileRejection.find((rejection) => rejection.errors[0].code === "file-too-large")

            if (fileSizeToBig) {
                toast.error("File size exceeds the 5MB limit.")
            }

            if (tooManyFiles) {
                toast.error("You can only upload up to 1 file at a time.")
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 5,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5 MB
        onDropRejected: rejectedFiles,
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