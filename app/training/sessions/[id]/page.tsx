import React from 'react';
import TrainingSessionInformation from "@/components/TrainingSession/TrainingSessionInformation";

export default async function Page({params}: { params: { id: string } }) {

    return (
        <TrainingSessionInformation id={params.id} trainerView/>
    );

}