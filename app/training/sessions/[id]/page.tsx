import React from 'react';
import TrainingSessionInformation from "@/components/TrainingSession/TrainingSessionInformation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    return (
        <TrainingSessionInformation id={params.id} trainerView/>
    );
}