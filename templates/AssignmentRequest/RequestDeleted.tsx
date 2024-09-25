import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const requestDeleted = async (student: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={student} headerText="Training Assignment Request Deleted">
            <p>Your training assignment request has been deleted.</p>
            <br/>
            <p>If you believe that this is an error, contact the training staff.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZDC Training Team</p>
        </SingleRecipientEmailWrapper>
    )
}