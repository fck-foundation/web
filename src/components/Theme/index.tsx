import { useContext } from "react";
import {
  Button,
  Image,
  Grid,
  Badge,
  Spacer,
  Loading,
  Text,
} from "@nextui-org/react";
import { AppContext } from "contexts/AppContext";
import { ABS13, ABS14 } from "assets/icons";
import { ReactComponent as Logo } from "assets/logo.svg";

import "./index.scss";
import { colors } from "colors";

interface Props {
  loading?: boolean;
  isLogo?: boolean;
}

export const ThemeSwitcher: React.FC<Props> = ({ loading, isLogo }) => {
  const { privateKey, nftItems, enabled, theme, setEnabled, setTheme } =
    useContext(AppContext);

  return isLogo ? (
    loading ? (
      <Loading css={{ padding: 9 }} />
    ) : theme.id && !!nftItems?.length ? (
      <Image
        showSkeleton
        src={
          nftItems?.find(({ metadata }) => metadata.id === theme.id)?.metadata
            .image_diamond
        }
        width={50}
        height={50}
        alt=""
      />
    ) : (
      // : privateKey?.previews ? (
      //   <Image
      //     showSkeleton
      //     src={privateKey?.previews[privateKey?.previews?.length - 1]?.url}
      //     width={50}
      //     css={{
      //       borderRadius: "100%",
      //     }}
      //   />
      // )
      <div className="flex place-items-center">
        <Logo className="h-8 w-8" />
      </div>
    )
  ) : (
    <Grid.Container css={{ maxWidth: 300 }}>
      {enabled ? (
        <Grid xs={12} css={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Button
            flat
            size="sm"
            css={{ minWidth: "100%", borderRadius: 0 }}
            onPress={() => setEnabled(false)}
          >
            <ABS14
              className="text-2xl"
              style={{ fill: "var(--nextui-colors-link)" }}
            />
            <Spacer x={0.4} />
            Switch to light
          </Button>
        </Grid>
      ) : (
        <Grid xs={12} css={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Button
            flat
            size="sm"
            css={{ minWidth: "100%", borderRadius: 0 }}
            onPress={() => setEnabled(true)}
          >
            <ABS13
              className="text-2xl"
              style={{ fill: "var(--nextui-colors-link)" }}
            />
            <Spacer x={0.4} />
            Switch to dark
          </Button>
        </Grid>
      )}
      <Grid
            xs={4}
            className="nft-item"
            onClick={() =>
              setTheme({
                color: enabled ? "dark" : "light",
                id: undefined
              })
            }
          >
            <Badge
              placement="top-left"
              css={{
                backgroundColor: colors.dark.primary,
                left: "50%",
                height: "$5",
                marginTop: "$5",
              }}
              size="xs"
              content={""}
            >
              <div
                className={`diamond-item ${
                  !theme.id ? "selected" : ""
                }`}
              >
                <Image
                  showSkeleton
                  src="/img/coin.png"
                  width="100%"
                  height="100%"
                  alt=""
                  css={{ objectFit: "cover" }}
                />
              </div>
            </Badge>
          </Grid>
      {nftItems?.map((item, i) => {
        const color = item.metadata?.attributes?.find(
          ({ trait_type }) => trait_type === "Color"
        )?.value;

        return (
          <Grid
            key={i}
            xs={4}
            className="nft-item"
            onClick={() =>
              setTheme({
                color: color?.toLowerCase(),
                id: item.metadata.id,
              })
            }
          >
            <Badge
              placement="top-left"
              css={{
                backgroundColor: item?.metadata?.theme?.main,
                left: "50%",
                height: "$5",
                marginTop: "$5",
              }}
              size="xs"
              content={""}
            >
              <div
                className={`diamond-item ${
                  theme.id === item.metadata.id ? "selected" : ""
                }`}
                style={{
                  ...(theme.id === item.metadata.id &&
                    {
                      // borderColor: item.metadata.theme.main,
                    }),
                }}
              >
                <Image
                  showSkeleton
                  src={item?.previews ? item?.previews[0]?.url : ""}
                  width="100%"
                  alt=""
                  css={{ objectFit: "cover" }}
                />
              </div>
            </Badge>
          </Grid>
        );
      })}
    </Grid.Container>
  );
};
