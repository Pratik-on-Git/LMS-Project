"use client"

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Menubar } from './Menubar'
import TextAlign from '@tiptap/extension-text-align'

interface RichTextEditorProps {
    content?: string
    onChange?: (content: string) => void
    editable?: boolean
    placeholder?: string
}

export default function RichTextEditor({ 
    content = '', 
    onChange,
    editable = true,
    placeholder = 'Start typing...'
}: RichTextEditorProps) {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
                defaultAlignment: 'left',
            }),
        ],
        content: content,
        editable: editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "min-h-[250px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
                'data-placeholder': placeholder,
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    return (
        <div className='w-full border border-input rounded-lg overflow-hidden dark:bg-input/30'>
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}