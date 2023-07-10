import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

export const Plitch = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("projectPlitch")}</title>
        <meta property="og:title" content={t("projectPlitch") || ""}></meta>
        <meta property="og:image" content="/img/plitch.png"></meta>
      </Helmet>
      <iframe
        src={`https://docs.google.com/viewer?url=https://raw.githubusercontent.com/fck-foundation/web/master/intro/pitch.pdf&embedded=true`}
        width="100%"
        style={{ minHeight: "90vh", border: "none" }}
      />
    </>
  );
};
