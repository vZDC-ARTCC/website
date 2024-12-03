import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const progressionRemoved = async (student: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={student} headerText="Training Progression Removed">
            <p>You have been removed from your current training progression.</p>
            <br/>
            <p>This can happen for the following reasons:</p>
            <p>You completed a progression and there is no automatic assignment of the next progression</p>
            <p>A staff member manually removed this progression from you.</p>
            <br/>
            <p>Your current and past training sessions are unaffected by this change.</p>
            <p>If you have any questions, contact the training team.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZDC Training Team</p>
            <p>training@vzdc.org</p>
        </SingleRecipientEmailWrapper>
    )
}