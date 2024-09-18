import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import MultipleRecipientsEmailWrapper from "@/templates/Wrapper/MultipleRecipientsEmailWrapper";

export const assignmentTrainerRemoved = async (student: User) => {
    return renderReactToMjml(
        <MultipleRecipientsEmailWrapper headerText="Training Assignment Updated">
            <p>Dear Trainer(s),</p>
            <p>You have been released from the following training
                assignment: <strong>{student.firstName} {student.lastName} ({student.cid})</strong></p>
            <p>You are no longer required to train this student <strong>unless</strong> they book through the training
                scheduler.</p>
            <br/>
            <a href="https://vzdc.org/training/your-students">Your Students</a>
            <br/>
            <p>Regards,</p>
            <p>The vZDC Training Team</p>
            <p>training@vzdc.org</p>
        </MultipleRecipientsEmailWrapper>
    )
}