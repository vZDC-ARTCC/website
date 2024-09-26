import React from 'react';
import {MjmlAttributes, MjmlColumn, MjmlHead, MjmlSection, MjmlText} from "@faire/mjml-react";

function EmailHead() {
    return (
        <MjmlHead>
            <MjmlAttributes>
                <MjmlText font-family="Roboto, sans-serif" font-size="16px"/>
                <MjmlSection padding="20px 0"/>
                <MjmlColumn padding="0"/>
            </MjmlAttributes>
        </MjmlHead>
    );
}

export default EmailHead;