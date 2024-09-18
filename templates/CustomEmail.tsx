import {renderReactToMjml} from "@/actions/mjml";
import MultipleRecipientsEmailWrapper from "@/templates/Wrapper/MultipleRecipientsEmailWrapper";

export const customEmail = (subject: string, body: string) => {
    return renderReactToMjml(
        <MultipleRecipientsEmailWrapper headerText={subject}>
            <p>{body}</p>
        </MultipleRecipientsEmailWrapper>
    )
}