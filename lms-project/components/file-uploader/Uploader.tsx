"use client"

import { useCallback, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"

import { Card, CardContent } from "../ui/card"
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState"
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

    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }))

        try {
            const predesignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            })

            if (!predesignedResponse.ok) {
                toast.error("Failed to get presigned URL")
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }))
                return
            }
            const { url: presignedUrl, key } = await predesignedResponse.json()

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100
                        setFileState((prev) => ({
                            ...prev,
                            progress: Math.round(percentageCompleted),
                        }))
                    }
                }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 100,
                            key: key,
                        }))
                        toast.success("File uploaded successfully")
                        resolve()
                    } else {
                        reject(new Error("Upload failed"))
                    }
                }

                xhr.onerror = () => {
                    reject(new Error("Upload failed"))
                }

                xhr.open("PUT", presignedUrl)
                xhr.setRequestHeader("Content-Type", file.type)
                xhr.send(file)

            }).catch(() => {
                toast.error("Something went wrong during the upload.")
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    error: true,
                }))
            })
        } catch (error) {
            toast.error("Something went wrong during the upload.")
            setFileState((prev) => ({
                ...prev,
                uploading: false,
                error: true,
            }))
        }
    }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return

            const file = acceptedFiles[0]

            setFileState({
                file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: "image",
            })

            onDropProp?.(acceptedFiles)
            uploadFile(file)
        },
        [onDropProp],
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

    function renderContent() {
        if (fileState.uploading) {
            return (
                <RenderUploadingState progress={fileState.progress} file={fileState.file as File} />
            )
        }

        if (fileState.error) {
            return (
                <RenderErrorState />
            )
        }

        if (fileState.objectUrl) {
            return (<RenderUploadedState previewUrl={fileState.objectUrl} />)
        }

        return <RenderEmptyState isDragActive={isDragActive} />
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
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
                {renderContent()}
            </CardContent>
        </Card>
    )
}