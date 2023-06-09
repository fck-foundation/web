import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language.split("-")[0].toLowerCase());

  useEffect(() => {
    i18n.changeLanguage(value);
  }, [value]);

  return (
    <Button
      icon={value.toUpperCase()}
      size="sm"
      flat
      css={{
        minWidth: 35,
        padding: "$4",
        background: "transparent",
        border: "1px solid $blue100",
      }}
      auto
      onPress={() => setValue(value === "en" ? "ru" : "en")}
    />
  );
};
