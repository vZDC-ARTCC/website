'use client';
import React from 'react';
import {CertificationOption, CertificationType} from "@prisma/client";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {toast} from "react-toastify";
import {createOrUpdateCertificationType} from "@/actions/certificationTypes";
import {Button, FormControlLabel, Stack, Switch, TextField, Typography} from "@mui/material";
import {Save} from "@mui/icons-material";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function CertificationTypeForm({certificationType}: { certificationType?: CertificationType }) {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {

        const canSoloCert = formData.get('canSoloCert') === 'on';

        const CertificationType = z.object({
            name: z.string().min(1, "Name is required").max(20, "Name cannot be longer than 20 characters"),
            order: z.number().int("Order must be a whole number"),
            canSoloCert: z.boolean(),
        });

        const result = CertificationType.safeParse({
            name: formData.get('name'),
            order: parseInt(formData.get('order') as string),
            canSoloCert,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }


        const certificationOptions: CertificationOption[] = ["NONE", "MAJOR",];

        if (formData.get('canMinorCert') === 'on') {
            certificationOptions.splice(1, 0, "MINOR");
        }

        const data = await createOrUpdateCertificationType({
            id: certificationType?.id || '',
            ...result.data,
            certificationOptions,
        });

        router.push('/admin/certification-types');
        toast(`Certification type '${data.name}' saved successfully!`, {type: 'success'})
    }

    return (
        <form action={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <TextField variant="filled" name="name" label="Name" defaultValue={certificationType?.name || ''}/>
                <TextField variant="filled" type="number" name="order" label="Order"
                           defaultValue={certificationType?.order || 0}
                           helperText="Lower number will put this certification higher in lists or first in table columns."/>
                <FormControlLabel name="canSoloCert"
                                  control={<Switch defaultChecked={certificationType?.canSoloCert || true}/>}
                                  label="Can get solo certified?"/>
                <FormControlLabel name="canMinorCert"
                                  control={<Switch defaultChecked={certificationType?.canSoloCert || true}/>}
                                  label="Split certification?"/>
                <FormSaveButton />
            </Stack>
        </form>
    );
}