import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import MultipleRecipientsEmailWrapper from "@/templates/Wrapper/MultipleRecipientsEmailWrapper";

export const assignmentOtherTrainer = async (student: User, primaryTrainer: User) => {
    return renderReactToMjml(
        <MultipleRecipientsEmailWrapper headerText="Training Assignment">
            <p>Dear Trainers,</p>
            <p>You have been assigned to train {student.firstName} {student.lastName} (not primary)</p>
            <p>The primary trainer for this student is {primaryTrainer.firstName} {primaryTrainer.lastName}</p>
            <br/>
            <p>Feel free to communicate with this student via email or private message.</p>
            <a href={`mailto:${student.email}`}>Email Student</a>
            <br/>
            <a href="https://vzdc.org/training/your-students">Your Students</a>
            <p><a
                href={`https://vzdc.org/training/assignments?filterField=student&filterValue=${student.cid}&filterOperator=equals`}>View
                Training Assignment</a> (other trainers, etc.)</p>
            <br/>
            <p>Regards,</p>
            <p>The vZDC Training Team</p>
            <p>training@vzdc.org</p>
        </MultipleRecipientsEmailWrapper>
    )
}