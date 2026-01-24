import { Editor } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toggle } from "../ui/toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1Icon, Heading2Icon, Heading3Icon, Italic, ListIcon, ListOrdered, Redo, Strikethrough, Underline, Undo } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useCallback } from "react"

const FONTS = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Comic Sans', value: 'Comic Sans MS' },
    { label: 'Courier', value: 'Courier' },
    { label: 'Garamond', value: 'Garamond' },
    { label: 'Helvetica', value: 'Helvetica' },
]

interface MenubarProps {
    editor: Editor | null
}

export function Menubar({ editor }: MenubarProps) {
    // Move all hooks before the early return to avoid conditional hook calls
    const toggleBold = useCallback(() => {
        editor?.commands.toggleBold()
    }, [editor])

    const toggleItalic = useCallback(() => {
        editor?.commands.toggleItalic()
    }, [editor])

    const toggleStrike = useCallback(() => {
        editor?.commands.toggleStrike()
    }, [editor])

    const toggleUnderline = useCallback(() => {
        editor?.commands.toggleUnderline()
    }, [editor])

    // Heading handlers
    const toggleHeading = useCallback((level: 1 | 2 | 3) => {
        if (!editor) return
        const isActive = editor.isActive('heading', { level })
        if (isActive) {
            editor.commands.setParagraph()
        } else {
            editor.commands.setHeading({ level })
        }
    }, [editor])

    // List handlers
    const toggleBulletList = useCallback(() => {
        editor?.commands.toggleBulletList()
    }, [editor])

    const toggleOrderedList = useCallback(() => {
        editor?.commands.toggleOrderedList()
    }, [editor])

    // Alignment handlers
    const setTextAlign = useCallback((alignment: 'left' | 'center' | 'right') => {
        editor?.commands.setTextAlign(alignment)
    }, [editor])

    // Font family handler
    const setFontFamily = useCallback((font: string) => {
        editor?.commands.setFontFamily(font)
    }, [editor])

    // History handlers
    const undo = useCallback(() => {
        editor?.commands.undo()
    }, [editor])

    const redo = useCallback(() => {
        editor?.commands.redo()
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                {/* Text Formatting Section */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('bold')}
                                onPressedChange={toggleBold}
                                aria-label="Toggle bold"
                                className={cn(
                                    editor.isActive('bold') && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Bold className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('italic')}
                                onPressedChange={toggleItalic}
                                aria-label="Toggle italic"
                                className={cn(
                                    editor.isActive('italic') && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Italic className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('strike')}
                                onPressedChange={toggleStrike}
                                aria-label="Toggle strikethrough"
                                className={cn(
                                    editor.isActive('strike') && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Strikethrough className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strikethrough</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('underline')}
                                onPressedChange={toggleUnderline}
                                aria-label="Toggle underline"
                                className={cn(
                                    editor.isActive('underline') && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Underline className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Heading Section */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('heading', { level: 1 })}
                                onPressedChange={() => toggleHeading(1)}
                                aria-label="Toggle heading 1"
                                className={cn(
                                    editor.isActive('heading', { level: 1 }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Heading1Icon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('heading', { level: 2 })}
                                onPressedChange={() => toggleHeading(2)}
                                aria-label="Toggle heading 2"
                                className={cn(
                                    editor.isActive('heading', { level: 2 }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Heading2Icon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('heading', { level: 3 })}
                                onPressedChange={() => toggleHeading(3)}
                                aria-label="Toggle heading 3"
                                className={cn(
                                    editor.isActive('heading', { level: 3 }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Heading3Icon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* List Section */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('bulletList')}
                                onPressedChange={toggleBulletList}
                                aria-label="Toggle bullet list"
                                className={cn(
                                    editor.isActive('bulletList') && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <ListIcon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('orderedList')}
                                onPressedChange={toggleOrderedList}
                                aria-label="Toggle ordered list"
                                className={cn(
                                    editor.isActive('orderedList') && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Font Family Section */}
                <div className="flex items-center gap-2">
                    <Select onValueChange={setFontFamily}>
                        <SelectTrigger className="w-[140px]" aria-label="Select font">
                            <SelectValue placeholder="Font" />
                        </SelectTrigger>
                        <SelectContent>
                            {FONTS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Text Alignment Section */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({ textAlign: 'left' })}
                                onPressedChange={() => setTextAlign('left')}
                                aria-label="Align left"
                                className={cn(
                                    editor.isActive({ textAlign: 'left' }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({ textAlign: 'center' })}
                                onPressedChange={() => setTextAlign('center')}
                                aria-label="Align center"
                                className={cn(
                                    editor.isActive({ textAlign: 'center' }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({ textAlign: 'right' })}
                                onPressedChange={() => setTextAlign('right')}
                                aria-label="Align right"
                                className={cn(
                                    editor.isActive({ textAlign: 'right' }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <AlignRight className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* History Section */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={undo}
                                disabled={!editor.can().undo()}
                                aria-label="Undo"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={redo}
                                disabled={!editor.can().redo()}
                                aria-label="Redo"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    )
}