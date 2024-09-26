import React from 'react';
import EmailHead from "@/templates/Header/EmailHead";
import {Mjml, MjmlBody, MjmlColumn, MjmlSection, MjmlText} from "@faire/mjml-react";
import EmailHeader from "@/templates/Header/EmailHeader";
import EmailFooter from "@/templates/Footer/EmailFooter";

function MultipleRecipientsEmailWrapper({headerText, children}: { headerText: string, children: React.ReactNode }) {
    return (
        <Mjml>
            <EmailHead/>
            <MjmlBody>
                <EmailHeader headerText={headerText}/>
                <MjmlSection background-color="#ffffff" padding="10px">
                    <MjmlColumn>
                        <MjmlText>
                            {children}
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <EmailFooter/>
            </MjmlBody>
        </Mjml>
    );
}

export default MultipleRecipientsEmailWrapper;