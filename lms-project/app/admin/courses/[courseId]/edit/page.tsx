import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { EditCourseForm } from "./_components/EditCourseForm";

type Params = Promise<{courseId: string}>;
export default async function EditRoute({ params }: { params: Params }) {
    const {courseId} = await params;
    const data = await adminGetCourse(courseId)
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
            <p>Course Structure Form Goes Here</p>
        </TabsContent>
    </Tabs>
    </div>
);
}