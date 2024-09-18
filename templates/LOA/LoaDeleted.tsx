import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";
import {User} from "next-auth";

export const loaDeleted = (controller: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={controller} headerText="L.O.A. Request Deleted">
            <p>Hello {controller.firstName} {controller.lastName},</p>
            <p>Your L.O.A. request has been deleted.</p>
            <p>Contact staff if you have any questions or believe that this is an error.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZDC Staff</p>
            <p>staff@vzdc.org</p>
        </SingleRecipientEmailWrapper>
    );
}