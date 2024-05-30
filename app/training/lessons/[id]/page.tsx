import React from 'react';
import LessonCard from "@/components/Lesson/LessonCard";

export default async function Page({params}: { params: { id: string, } }) {

    const {id} = params;

    return (
        <LessonCard lessonId={id}/>
    );
}