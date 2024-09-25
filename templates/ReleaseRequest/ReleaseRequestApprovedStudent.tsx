import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const releaseRequestApprovedStudent = async (student: User, force?: boolean) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={student}
                                     headerText={force ? 'Training Assignment Released' : 'Release Request Approved'}>
            {!force && <p>Your release request has been approved.</p>}
            <p>You are no longer part of a training assignment and must use the scheduler for all future training
                sessions.</p>
            <br/>
            <p>Please check <a href="https://vzdc.org/profile/overview">your profile</a> for more details.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZDC Training Team</p>
            <p>training@vzdc.org</p>
        </SingleRecipientEmailWrapper>
    )
}