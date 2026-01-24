import { cn } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({isDragActive}: {isDragActive: boolean}) {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center justify-center size-20 rounded-full bg-muted">
                <CloudUploadIcon 
                className={cn("size-10", isDragActive 
                ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div >
                <h3 className="text-lg font-semibold">
                    {isDragActive ? "Drop the files here..." : "Drag & drop files here"}
                </h3>
                <p className="text-sm text-muted-foreground cursor-pointer">
                    Or click to select files
                </p>
                <Button type="button" className="mt-2">
                    Select File
                </Button>
            </div>
        </div>
    )
}

export function RenderErrorState() {
    return (
        <div className="text-destructive flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-destructive/20 flex items-center justify-center size-20 rounded-full">
                <CloudUploadIcon className="size-10 text-red-600" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-red-600">
                    Upload Failed
                </h3>
                <p className="text-sm text-muted-foreground">
                    There was an error uploading your files. Please try again.
                </p>
            </div>
            <Button type="button" variant="destructive" className="mt-2">
                Retry Upload
            </Button>
        </div>
    )
}