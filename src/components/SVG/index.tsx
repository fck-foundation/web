import { useEffect, useState } from "react";

import './index.scss';

export const SvgInline = (props) => {
  const [svg, setSvg] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    props.url && fetch(props.url)
      .then((res) => res.text())
      .then(setSvg)
      .catch(setIsErrored)
      .finally(() => {
        document.body.style.background = "transparent";
        setIsLoaded(true);
      });
  }, [props.url]);

  return (
    <div
      className={`svgInline svgInline--${isLoaded ? "loaded" : "loading"} ${
        isErrored ? "svgInline--errored" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
