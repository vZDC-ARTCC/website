import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";
import {getRating} from "@/lib/vatsim";

export const visitorAccepted = (user: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={user} headerText="Visitor Application Accepted">
            <p>Congratulations! You have been accepted as a visitor at vZDC.</p>
            <p>You are now authorized to work any <strong>UNRESTRICTED</strong> airports up to your rating
                ({getRating(user.rating)}).</p>
            <p>You <strong>cannot</strong> control any TIER 1 or TIER 2 facilities until you are certified by a staff
                member or trainer.</p>
            <p>Before you can control at any of our facilities, read our administrative documents and our visitor policy
                in the <a
                    href="https://vzdc.org/publications/downloads">publications section</a> of our website.</p>
            <br/>
            <p>You can now access our website to customize <a href="https://vzdc.org/profile/overview">your
                profile</a> and <a
                href="https://training.vzdc.org">request training.</a></p>
            <br/>
            <p>Regards,</p>
            <p>The vZDC Staff</p>
            <p>staff@vzdc.org</p>
        </SingleRecipientEmailWrapper>
    )
}