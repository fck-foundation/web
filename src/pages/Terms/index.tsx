import { useTranslation } from "react-i18next";
import { Grid, Spacer, Container, Text } from "@nextui-org/react";

export function Terms() {
  const { t } = useTranslation();

  return (
    <>
      <Container md css={{ p: 0 }}>
        <Grid.Container
          gap={1}
          justify="center"
          css={{ minHeight: "70vh", pt: 16, pb: 32, pl: 0, pr: 0 }}
        >
          <Grid xs={12} sm={8}>
            <Grid.Container
              gap={1}
              justify="space-between"
              css={{ m: "-$8", width: "calc(100% + $16)" }}
            >
              <Grid xs={12} className="flex flex-col">
                <Text weight="bold" size={24}>
                  Terms of Use
                </Text>
                <br />
                <Text>
                  These Terms of Use ("Terms") govern your use of the
                  fck.foundation website ("Website") and its associated
                  services. By accessing or using our Website, you agree to be
                  bound by these Terms. If you do not agree to these Terms,
                  please refrain from using our Website.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Use of Website:
                </Text>
                <Text>
                  - Eligibility: You must be at least 18 years old or have
                  reached the age of majority in your jurisdiction to use our
                  Website. By using our Website, you represent and warrant that
                  you meet the eligibility requirements.
                </Text>
                <Text>
                  - Compliance: You agree to use our Website in compliance with
                  all applicable laws, regulations, and these Terms. You are
                  solely responsible for ensuring your use of the Website is
                  lawful and does not violate any third-party rights.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Intellectual Property:
                </Text>
                <Text>
                  - Ownership: All original content and materials on the
                  fck.foundation website ("Website") that are not governed by
                  the MIT license, including text, graphics, logos, images, and
                  software, are owned by or licensed to fck.foundation. These
                  materials are protected by intellectual property laws and may
                  not be used without our prior written permission.
                </Text>
                <Text>
                  - Open Source Contributions: Certain components of our project
                  may be governed by the MIT license or other open source
                  licenses. Your use of these open source components is subject
                  to the terms and conditions of the respective licenses. Please
                  refer to the accompanying license files or documentation for
                  specific details.
                </Text>
                <Text>
                  - User Contributions: By submitting or posting any
                  user-generated content, including code contributions, to our
                  open source project, you grant us a non-exclusive, worldwide,
                  royalty-free, perpetual, and transferable license to use,
                  reproduce, distribute, prepare derivative works of, display,
                  and perform your contributions in connection with our project.
                </Text>
                <Text>
                  - Open Source Licensing: Any contributions you make to our
                  open source project will be subject to the terms of the
                  applicable open source license(s). It is your responsibility
                  to ensure compliance with these licenses when contributing to
                  or using our open source project.
                </Text>
                <Text>
                  - Disclaimer: We make no warranty or representation regarding
                  the accuracy, reliability, or functionality of any open source
                  components or contributions made by users. We disclaim any
                  liability arising from the use or reliance on these open
                  source components or user contributions.
                </Text>
                <Text>
                  - No Legal Advice: The information on our Website, including
                  any open source licensing information, is provided for general
                  informational purposes only and does not constitute legal
                  advice. We recommend consulting legal professionals for
                  specific legal advice regarding open source licensing matters.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  User Contributions:
                </Text>
                <Text>
                  - User Responsibility: By submitting or posting any content on
                  our Website, including votes, suggestions, or ideas ("User
                  Contributions"), you grant us a non-exclusive, worldwide,
                  royalty-free, perpetual, and transferable license to use,
                  reproduce, distribute, prepare derivative works of, display,
                  and perform your User Contributions in connection with our
                  Website.
                </Text>
                <Text>
                  - User Conduct: You agree not to post or submit any User
                  Contributions that are unlawful, offensive, defamatory,
                  infringing, or violate the rights of others. We reserve the
                  right to remove any User Contributions that we deem
                  inappropriate or in violation of these Terms.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Links to Third-Party Websites:
                </Text>
                <Text>
                  Our Website may contain links to third-party websites or
                  services that are not owned or controlled by fck.foundation.
                  We do not endorse or assume any responsibility for the
                  content, privacy policies, or practices of any third-party
                  websites. You access third-party websites at your own risk.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Disclaimer of Warranties:
                </Text>
                <Text>
                  The content on our Website is provided on an "as is" and "as
                  available" basis without any warranties, express or implied.
                  We do not warrant the accuracy, completeness, or reliability
                  of the content on our Website or the availability of our
                  Website at all times.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Limitation of Liability:
                </Text>
                <Text>
                  To the maximum extent permitted by law, fck.foundation and its
                  affiliates, officers, directors, employees, agents, and
                  partners shall not be liable for any direct, indirect,
                  incidental, consequential, or special damages arising out of
                  or in connection with your use of the Website or reliance on
                  any content provided.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Governing Law and Jurisdiction:
                </Text>
                <Text>
                  - Applicable Law: These Terms of Use and any disputes arising
                  out of or relating to the fck.foundation project ("Project")
                  and its associated website are governed by and construed in
                  accordance with the laws of the jurisdiction in which the
                  Project operates, specifically related to the TON Blockchain.
                </Text>
                <Text>
                  - Community-Driven Project: The Project is developed and
                  maintained by a community of individuals voluntarily
                  contributing their efforts and resources. The Project does not
                  have an official company or legal entity associated with it.
                </Text>
                <Text>
                  - Dispute Resolution: Any disputes or claims arising out of or
                  in connection with the Project or these Terms shall be subject
                  to the exclusive jurisdiction of the courts or arbitration
                  proceedings in the jurisdiction specified by the TON
                  Blockchain's governance rules or any applicable decentralized
                  dispute resolution mechanism established by the community.
                </Text>
                <Text>
                  - No Legal Entity: Please note that the Project's
                  community-driven nature and absence of an official legal
                  entity may impact the ability to bring legal claims or enforce
                  certain rights traditionally associated with corporate
                  entities.
                </Text>
                <Text>
                  - Compliance with Local Laws: It is your responsibility to
                  ensure compliance with the laws and regulations of your
                  jurisdiction when using or contributing to the Project. We
                  disclaim any liability for violations of any applicable laws
                  or regulations by users or contributors.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Modifications:
                </Text>
                <Text>
                  We reserve the right to modify or update these Terms at any
                  time. Any changes will be effective upon posting the updated
                  Terms on our Website. Your continued use of the Website after
                  the posting of any changes constitutes your acceptance of the
                  modified Terms.
                </Text>
                <br />
                <Text weight="bold" size={16}>
                  Contact Us:
                </Text>
                <Text className="flex">
                  If you have any questions or concerns regarding these Terms,
                  please contact us at <Spacer x={0.4} />
                  <a href="mailto:support@fck.foundation" target="__blank">
                    support@fck.foundation
                  </a>
                  .
                </Text>
                <br />
                <div className="flex">
                  <Text weight="bold" size={14}>
                    Last updated:
                  </Text>{" "}
                  <Spacer x={0.4} /> <Text>03.07.2023</Text>
                </div>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>
      <Spacer y={0.4} />
    </>
  );
}
