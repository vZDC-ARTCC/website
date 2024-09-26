'use server';
import {renderToMjml} from "@faire/mjml-react/utils/renderToMjml";
import mjml2html from "mjml";
import {MJMLParseResults} from "mjml-core";
import React from "react";

export async function renderReactToMjml(email: React.ReactElement): Promise<MJMLParseResults> {
    return mjml2html(renderToMjml(email));
}