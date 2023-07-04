import { useTranslation } from "react-i18next";
import { Grid, Spacer, Container, Text } from "@nextui-org/react";

export function Cookie() {
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
                  Cookie Policy
                </Text>

                <br />
                <Text>
                  This Cookie Policy explains how FCK.Foundation uses cookies
                  and similar tracking technologies when you visit our website.
                  By continuing to browse and use our website, you consent to
                  the use of cookies as described in this policy.
                </Text>

                <br />
                <Text weight="bold" size={16}>
                  What are Cookies:
                </Text>
                <Text>
                  Cookies are small text files that are stored on your computer
                  or mobile device when you visit a website. They are widely
                  used by website owners to make their sites work more
                  efficiently and to provide a better browsing experience for
                  the user. Cookies enable us to recognize your device and
                  gather certain information about your interaction with our
                  website.
                </Text>

                <br />
                <Text weight="bold" size={16}>
                  Types of Cookies We Use:
                </Text>
                <Text>
                  - Essential Cookies: These cookies are necessary for the
                  functioning of our website and enable you to navigate and use
                  its features. They are typically set in response to your
                  actions, such as filling out forms or setting preferences.
                </Text>

                <Text>
                  - Performance and Analytics Cookies: We use these cookies to
                  collect information about how visitors use our website, such
                  as which pages are visited most often or if they encounter any
                  errors. This helps us analyze and improve the performance of
                  our website.
                </Text>

                <Text>
                  - Functionality Cookies: These cookies allow our website to
                  remember choices you make (such as your preferred language)
                  and provide enhanced features. They may also be used to
                  provide certain services you have requested.
                </Text>

                <br />
                <Text weight="bold" size={16}>
                  Third-Party Cookies:
                </Text>
                <Text>
                  We may also utilize cookies provided by third-party service
                  providers, such as Google Analytics, to help us analyze
                  website traffic and usage patterns. These cookies are subject
                  to the respective privacy policies of the third parties
                  providing them. We do not have control over third-party
                  cookies, and their use is not covered by this Cookie Policy.
                </Text>

                <br />
                <Text weight="bold" size={16}>
                  Cookie Management:
                </Text>
                <Text>
                  Most web browsers automatically accept cookies, but you can
                  modify your browser settings to decline cookies if you prefer.
                  Please note that blocking or deleting cookies may impact your
                  experience on our website and limit certain functionalities.
                </Text>

                <br />
                <Text weight="bold" size={16}>
                  Updates to the Cookie Policy:
                </Text>
                <Text>
                  We reserve the right to update or modify this Cookie Policy
                  from time to time. Any changes will be effective immediately
                  upon posting the revised policy on our website. We encourage
                  you to review this policy regularly to stay informed about how
                  we use cookies.
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
