import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";
import {getRating} from "@/lib/vatsim";

export const assignmentPrimaryTrainer = async (student: User, primaryTrainer: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={primaryTrainer} headerText="Training Assignment - Primary">
            <p>You have assigned as the <strong>primary</strong> trainer
                for <strong>{student.firstName} {student.lastName} ({getRating(student.rating)})</strong>.</p>
            <p>Check the training assignment to view the other trainers for this student.</p>
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
        </SingleRecipientEmailWrapper>
    )
}