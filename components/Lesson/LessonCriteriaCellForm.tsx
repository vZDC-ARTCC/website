'use client';
import React from 'react';
import {Lesson, LessonRubricCell, LessonRubricCriteria} from "@prisma/client";
import {Grid2, TextField} from "@mui/material";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {createOrUpdateLessonCriteriaCell} from "@/actions/lessonCriteriaCell";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export default function LessonCriteriaCellForm({lesson, criteria, cell}: {
    lesson: Lesson,
    criteria: LessonRubricCriteria,
    cell?: LessonRubricCell
}) {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const {errors} = await createOrUpdateLessonCriteriaCell(formData);

        if (errors) {
            toast(errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }

        router.replace(`/training/lessons/${lesson.id}/edit/${criteria.id}`);
        toast("Criteria cell saved successfully!", {type: 'success'});
    }

    return (
        (<form action={handleSubmit}>
            <input type="hidden" name="lessonId" value={lesson.id}/>
            <input type="hidden" name="criteriaId" value={criteria.id}/>
            <input type="hidden" name="cellId" value={cell?.id || ''}/>
            <input type="hidden" name="maxPoints" value={criteria.maxPoints}/>
            <Grid2 container columns={2} spacing={2}>
                <Grid2
                    size={{
                        xs: 2,
                        md: 1
                    }}>
                    <TextField fullWidth variant="filled" type="number" required name="points" label="Points"
                               helperText={`Points must be less than or equal to the maximum points in this criteria: ${criteria.maxPoints}`}
                               defaultValue={cell?.points || 0}/>
                </Grid2>
                <Grid2
                    size={{
                        xs: 2,
                        md: 1
                    }}>
                    <TextField fullWidth variant="filled" type="text" required name="description" label="Description"
                               helperText="The description should give trainers an idea of what fits in this point category.  It should be short and mention specifics (ex. No more than 2 clearances missed)."
                               defaultValue={cell?.description || ''}/>
                </Grid2>
                <Grid2 size={2}>
                    <FormSaveButton/>
                </Grid2>
            </Grid2>
        </form>)
    );
}