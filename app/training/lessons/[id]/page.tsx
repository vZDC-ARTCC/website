import React from 'react';
import LessonCard from "@/components/Lesson/LessonCard";

export default async function Page(props: { params: Promise<{ id: string, }> }) {
    const params = await props.params;

    const {id} = params;

    return (
        <LessonCard lessonId={id}/>
    );
}