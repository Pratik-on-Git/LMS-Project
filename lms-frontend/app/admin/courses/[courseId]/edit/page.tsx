import { adminApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { EditCourseForm } from "./_components/EditCourseForm";
import { CourseStructure } from "./_components/CourseStructure";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

type Params = Promise<{courseId: string}>;
export default async function EditRoute({ params }: { params: Params }) {
    const {courseId} = await params;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    const response = await adminApi.getCourseServer(courseId, cookieHeader);
    
    if (response.status === "error" || !response.data) {
        notFound();
    }
    
    const data = response.data;
    return (
    <div className="text-3xl font-bold mb-8">
        <h1>Edit Course: <span className="text-primary underline">{data.title}</span></h1>
    <Tabs defaultValue="basic-info" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="course-information">Course Information</TabsTrigger>
            <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="course-information" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Basic Course Information</CardTitle>
                    <CardDescription>
                        Update the basic details of your course here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditCourseForm data={data} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="course-structure" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Course Structure</CardTitle>
                    <CardDescription>
                        Update the structure of your course here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CourseStructure data={data}/>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
    </div>
);
}