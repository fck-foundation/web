import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

export const WhitePaper = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("whitePaper")}</title>
        <meta property="og:title" content={t("whitePaper") || ""}></meta>
        <meta property="og:image" content="/img/whitepaper.png"></meta>
      </Helmet>
      <iframe
        src={`https://docs.google.com/viewer?url=https://raw.githubusercontent.com/fck-foundation/web/master/intro/whitepaper.pdf&embedded=true`}
        width="100%"
        style={{ minHeight: "90vh", border: "none" }}
      />
    </>
  );
};
