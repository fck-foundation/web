import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language && i18n.language.split("-")[0].toLowerCase());

  useEffect(() => {
    i18n.changeLanguage(value);
  }, [value]);

  return (
    <Button
      icon={value.toUpperCase()}
      flat
      size="sm"
      css={{
        padding: "$4",
        background: "transparent",
        border: "1px solid $blue100",
      }}
      style={{
        minWidth: "auto",
      }}
      onPress={() => setValue(value === "en" ? "ru" : "en")}
    />
  );
};
