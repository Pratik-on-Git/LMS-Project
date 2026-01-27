"use client";

import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, GripVertical, Keyboard, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@radix-ui/react-collapsible";

interface iAppProps {
    data: AdminCourseSingularType;
}
interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson';
        chapterId?: string;

    }
}
export function CourseStructure({ data }: iAppProps) {
    const initialItems = data.chapter.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true,
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
        })),
    })) || [];
    const [items, setItems] = useState(initialItems); // Placeholder for chapter IDs

    function SortableItem({ id, children, className, data }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: id, data: data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes}
                className={cn("touch-none", className, isDragging ? 'z-10' : '')}>
                {id === 'keyboard' ? (
                    <div className="flex items-center space-x-2 p-4 border rounded-md mb-2 bg-secondary/50">
                        <Keyboard className="h-5 w-5" />
                    </div>
                ) : (
                    <div className="p-4 border rounded-md mb-2">{children(listeners)}</div>
                )}
            </div>
        );
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

    }

    function toggleChapeter(chapterId: string) {
        setItems(
            items.map((chapter) => chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter
            )
        );
    }
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }
        )
    );
    return (
        <DndContext collisionDetection={rectIntersection} sensors={sensors} onDragEnd={handleDragEnd}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle className="text-xl">Chapters</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Course structure content goes here */}
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} data={{ type: 'chapter' }}>
                                {(listeners) =>
                                    <Card>
                                        <Collapsible open={item.isOpen} onOpenChange={()=> toggleChapeter(item.id)}>
                                            <div className="flex items-center justify-between p-3 border-b border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="ghost" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                                        <GripVertical className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger>
                                                        <Button size="icon" variant="ghost" className="flex items-center gap-2">
                                                            {item.isOpen? (<ChevronDown className="size-4" />) : (<ChevronRight className="size-4" />)}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <p className="cursor-pointer hover:text-primary pl-2">{item.title}</p>
                                                </div>
                                                <Button size="icon" variant="outline">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>

                                            <CollapsibleContent>
                                                <div className="p-1">
                                                    <SortableContext items={item.lessons.map((lesson) => lesson.id)} strategy={verticalListSortingStrategy}>
                                                        {item.lessons.map((lesson) => (
                                                            <SortableItem key={lesson.id} id={lesson.id} data={{ type: 'lesson', chapterId: item.id }}>
                                                                {(lessonListeners) =>
                                                                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <Button size="icon" variant="ghost" {...lessonListeners}>
                                                                                <GripVertical className="size-4" />
                                                                            </Button>   
                                                                            <FileText className="size-4"/> 
                                                                            <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}>{lesson.title}</Link>
                                                                        </div>
                                                                        <Button size="icon" variant="outline">
                                                                            <Trash2 className="size-4" />
                                                                        </Button>
                                                                    </div>
                                                                }
                                                            </SortableItem>
                                                        ))}

                                                    </SortableContext>
                                                    <div className="p-2">
                                                        <Button variant="outline" className="w-full">Create Lesson</Button>
                                                    </div>
                                                </div>

                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                }
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}