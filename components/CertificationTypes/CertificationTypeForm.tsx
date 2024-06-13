'use client';
import React from 'react';
import {CertificationType} from "@prisma/client";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {createOrUpdateCertificationType} from "@/actions/certificationTypes";
import {FormControlLabel, Stack, Switch, TextField} from "@mui/material";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function CertificationTypeForm({certificationType}: { certificationType?: CertificationType }) {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {

        formData.set('certificationOptions', ["NONE", "MAJOR",] as any);

        if (formData.get('canMinorCert') === 'on') {
            formData.set('certificationOptions', ["NONE", "MAJOR", "MINOR"] as any);
        }

        const {certificationType, errors} = await createOrUpdateCertificationType(formData);

        if (errors) {
            toast(errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }

        router.push('/admin/certification-types');
        toast(`Certification type '${certificationType.name}' saved successfully!`, {type: 'success'})
    }

    const splitCertification = certificationType?.certificationOptions && certificationType.certificationOptions.length > 2;

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="id" value={certificationType?.id}/>
            <Stack direction="column" spacing={2}>
                <TextField variant="filled" name="name" label="Name" defaultValue={certificationType?.name || ''}/>
                <TextField variant="filled" type="number" name="order" label="Order"
                           defaultValue={certificationType?.order || 0}
                           helperText="Lower number will put this certification higher in lists or first in table columns."/>
                <FormControlLabel name="canSoloCert"
                                  control={<Switch defaultChecked={certificationType?.canSoloCert}/>}
                                  label="Can get solo certified?"/>
                <FormControlLabel name="canMinorCert"
                                  control={<Switch defaultChecked={splitCertification}/>}
                                  label="Split certification?"/>
                <FormSaveButton />
            </Stack>
        </form>
    );
}