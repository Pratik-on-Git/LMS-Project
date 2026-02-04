"use client";

import { AdminCourseSingularType, adminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, GripVertical, Keyboard } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { toast } from "sonner";
import { NewChapterModal } from "./NewChapterModal";
import { NewLessonModal } from "./NewLessonModal";
import { DeleteLesson } from "./DeleteLesson";
import { DeleteChapter } from "./DeleteChapter";

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

    useEffect(() => {
        setItems((prevItems) => {
            const updatedItems = data.chapter.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
                lessons: chapter.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    order: lesson.position,
                })),
            })) || [];
            return updatedItems;
        })
    }, [data]);

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
                    <div className="flex items-center space-x-2 p-4 bg-secondary/50">
                        <Keyboard className="h-5 w-5" />
                    </div>
                ) : (
                    // For lessons we don't want the extra card/border wrapper — render children directly
                    data?.type === 'lesson' ? (
                        children(listeners)
                    ) : (
                        <div className="p-4 border rounded-md mb-2">{children(listeners)}</div>
                    ))}
            </div>
        );
    }

    function handleChapterDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const activeId = active.id;
        const overId = over.id;
        const activeType = active.data.current?.type as 'chapter';
        const overType = over.data.current?.type as 'chapter';
        if (activeType === 'chapter' && overType === 'chapter') {
            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === overId);
            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not find chapter to reorder.");
                return;
            }
            const reorderedLocalChapter = arrayMove(items, oldIndex, newIndex);
            const updatedChapterForState = reorderedLocalChapter.map((chapter, index) => ({
                ...chapter,
                order: index + 1,
            }));

            const previousItems = [...items]; // Store previous state before updating       

            setItems(updatedChapterForState);
            if (data.id) {
                const chaptersToUpdate = updatedChapterForState.map((chapter) => ({
                    id: chapter.id,
                    position: chapter.order,
                }));
                const reorderPromise = () => adminApi.reorderChapters(data.id, chaptersToUpdate);

                toast.promise(
                    reorderPromise(),
                    {
                        loading: "Reordering chapters...",
                        success: (result) => {
                            if (result.status === "success") {
                                return result.message;
                            } else {
                                throw new Error(result.message);
                            }
                        },
                        error: () => {
                            setItems(previousItems);
                            return "Failed to reorder chapters.";
                        }
                    }
                );
            }
            return;
        }
    }

    function handleLessonDragEnd(chapterId: string, event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const activeId = active.id;
        const overId = over.id;
        const chapterIndex = items.findIndex((item) => item.id === chapterId);
        if (chapterIndex === -1) {
            toast.error("Could not find chapter for reordering lessons.");
            return;
        }
        const chapterToUpdate = items[chapterIndex];
        const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeId);
        const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === overId);
        if (oldLessonIndex === -1 || newLessonIndex === -1) {
            toast.error("Could not find lesson to reorder.");
            return;
        }
        const previousItems = [...items]; // Store previous state before updating
        const reorderedLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);
        const updatedLessonsForState = reorderedLessons.map((lesson, index) => ({
            ...lesson,
            order: index + 1,
        }));
        const newItems = [...items];
        newItems[chapterIndex] = {
            ...chapterToUpdate,
            lessons: updatedLessonsForState,
        };
        setItems(newItems);

        if (data.id) {
            const lessonsToUpdate = updatedLessonsForState.map((lesson) => ({
                id: lesson.id,
                position: lesson.order,
            }));

            const reorderLessonsPromise = () => adminApi.reorderLessons(chapterId, lessonsToUpdate);

            toast.promise(
                reorderLessonsPromise(),
                {
                    loading: "Reordering lessons...",
                    success: (result) => {
                        if (result.status === "success") {
                            return result.message;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder lessons.";
                    }
                }
            );
        }

        return;
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
        })
    );
    // For lessons, use a separate sensors instance to avoid cross-chapter drag
    const lessonSensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    return (
        <DndContext collisionDetection={rectIntersection} sensors={sensors} onDragEnd={handleChapterDragEnd}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle className="text-xl">Chapters</CardTitle>
                    <NewChapterModal courseId={data.id} />
                </CardHeader>
                <CardContent>
                    {/* Course structure content goes here */}
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} data={{ type: 'chapter' }}>
                                {(listeners) =>
                                    <div className="mb-0">
                                        <Collapsible open={item.isOpen} onOpenChange={() => toggleChapeter(item.id)}>
                                            <div className="flex items-center justify-between p-3 border-b border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="ghost" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                                        <GripVertical className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger asChild>
                                                        {item.isOpen ? (
                                                            <ChevronDown className="size-4 cursor-pointer" />
                                                        ) : (
                                                            <ChevronRight className="size-4 cursor-pointer" />
                                                        )}
                                                    </CollapsibleTrigger>
                                                    <span className="cursor-pointer hover:text-primary pl-2 text-lg font-normal">{item.title}</span>
                                                </div>
                                                <DeleteChapter chapterId={item.id} courseId={data.id} />
                                            </div>

                                            <CollapsibleContent>
                                                <div className="p-1">
                                                    {/* Each chapter's lessons get their own DndContext and SortableContext */}
                                                    <DndContext
                                                        collisionDetection={rectIntersection}
                                                        sensors={lessonSensors}
                                                        onDragEnd={(event) => handleLessonDragEnd(item.id, event)}
                                                    >
                                                        <SortableContext
                                                            items={item.lessons.map((lesson) => lesson.id)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            {item.lessons.map((lesson) => (
                                                                <SortableItem
                                                                    key={lesson.id}
                                                                    id={lesson.id}
                                                                    data={{ type: 'lesson', chapterId: item.id }}
                                                                >
                                                                    {(lessonListeners) => (
                                                                        <div className="flex items-center justify-between py-3 px-4 hover:bg-accent">
                                                                            <div className="flex items-center gap-3">
                                                                                <Button size="icon" variant="ghost" className="p-0" {...lessonListeners}>
                                                                                    <GripVertical className="size-4" />
                                                                                </Button>
                                                                                <FileText className="size-4" />
                                                                                <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`} className="text-base font-normal">{lesson.title}</Link>
                                                                            </div>
                                                                            <DeleteLesson chapterId={item.id} lessonId={lesson.id} courseId={data.id} />
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            ))}
                                                        </SortableContext>
                                                    </DndContext>
                                                    <div className="p-2">
                                                        <NewLessonModal chapterId={item.id} courseId={data.id} />
                                                    </div>
                                                </div>

                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                }
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}