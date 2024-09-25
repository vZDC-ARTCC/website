import React from 'react';
import {Mjml, MjmlBody, MjmlColumn, MjmlSection, MjmlText} from "@faire/mjml-react";
import EmailHead from "@/templates/Header/EmailHead";
import EmailHeader from "@/templates/Header/EmailHeader";
import EmailFooter from "@/templates/Footer/EmailFooter";
import {User} from "next-auth";

function SingleRecipientEmailWrapper({recipient, headerText, children}: {
    recipient: User,
    headerText: string,
    children: React.ReactNode
}) {
    return (
        <Mjml>
            <EmailHead/>
            <MjmlBody>
                <EmailHeader headerText={headerText}/>
                <MjmlSection background-color="#ffffff" padding="10px">
                    <MjmlColumn>
                        <MjmlText>
                            <p>Dear {recipient.firstName} {recipient.lastName},</p>
                            {children}
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <EmailFooter recipient={recipient}/>
            </MjmlBody>
        </Mjml>
    );
}

export default SingleRecipientEmailWrapper;