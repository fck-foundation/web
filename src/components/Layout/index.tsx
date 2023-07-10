import { useContext, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Navbar,
  Text,
  Dropdown,
  Spacer,
  Container,
  Card,
  Button,
  Grid,
  Loading,
  Divider,
  Image,
  Badge,
} from "@nextui-org/react";
import cookie from "react-cookies";
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { LanguageSwitcher, Promote, Search } from "components";
import { AppContext } from "contexts";
import { default as Logo } from "assets/logo.svg";
import { GEN16, TG, TW, ABS28, GEN02, Ton } from "assets/icons";

import { TUser } from "../TelegramLogin";
import { ThemeSwitcher } from "../Theme";
import { DEX } from "../DEX";
import { Currency } from "../Currency";
import { SvgInline } from "../SVG";

import iKey from "./key.png";

import "./index.scss";

export const Layout = ({ children }: { children?: any }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const {
    authorized,
    nftItems,
    enabled,
    theme,
    isDebug: isDebugValue,
    isPrivate: isPrivateValue,
    setTheme,
    setAuthorized,
    setIsBottom,
    setIsMenuOpen,
  } = useContext(AppContext);
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState<TUser>();
  const [animateCounter, setAnimateCounter] = useState(0);
  const [isDebug, setIsDebug] = useState(isDebugValue);
  const [isPrivate, setIsPrivate] = useState(isPrivateValue);
  const [voteId, setVoteId] = useState<number>();

  useEffect(() => {
    if (isDebugValue && !isPrivateValue) {
      setAnimateCounter(1);
    }

    setTimeout(() => {
      setIsDebug(isDebugValue);
      setIsPrivate(isPrivateValue);
      setAnimateCounter(0);
    }, 300);
  }, [isDebugValue, isPrivateValue]);

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    setTimeout(() => document.getElementById("root")?.scrollTo(0, 0), 100);
  }, [location.pathname]);

  const onAction = (actionKey: React.Key) => {
    switch (actionKey) {
      case "logout":
        tonConnectUI.disconnect();
        localStorage.removeItem("access-token");
        cookie.remove("access-token");
        setAuthorized(false);
        if (document.getElementsByTagName("html")) {
          document
            .getElementsByTagName("html")[0]
            .classList.remove(`${theme.color}${enabled ? "" : "-light"}-theme`);
          document
            .getElementsByTagName("html")[0]
            .classList.add(`${enabled ? "dark" : "light"}-theme`);
        }
        setTheme({ color: enabled ? "dark" : "light" });
        setUser(undefined);
        break;
      case "connect":
        if (document.getElementsByTagName("tc-root")) {
          (
            Array.from(
              document.getElementsByTagName("tc-root")[0]?.childNodes
            )[0] as any
          )?.click();
        }
        break;
      case "whitelist":
        break;
      case "analytics":
        navigate(`/wallet/${address}`);
        break;
      default:
        break;
    }
  };

  const background = useMemo(
    () =>
      theme && (
        <SvgInline
          url={
            nftItems?.find(({ metadata }) => metadata.id === theme.id)?.metadata
              .image
          }
        />
      ),
    [theme, nftItems]
  );

  const onChangeHref = (href) => {
    navigate(href);
    setToggle(false);
  };

  const menu = [
    {
      title: t("dashboard"),
      href: `/analytics/price/${
        location.pathname.includes("price") ||
        location.pathname.includes("volume")
          ? location.pathname.split("/")?.pop()
          : "FCK"
      }`,
    },
    {
      title: t("tokens"),
      href: `/tokens`,
      // disabled: true
    },
    {
      title: t("pairs"),
      href: `/pairs`,
      disabled: true
    },
    // { title: t("events"), href: "/events" },
    // { title: t("roadMap"), href: "/roadmap" },
  ];

  useEffect(() => {
    const root = document.getElementById("root");
    const handleScroll = () => {
      setIsBottom(
        (root?.scrollHeight || 0) - window.innerHeight - 500 <
          (root?.scrollTop || 0)
      );
    };

    root?.addEventListener("scroll", handleScroll);

    return () => {
      const root = document.getElementById("root");
      root?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isLoadingWallet = typeof authorized === "undefined";

  const onPrivate = () => {
    setAnimateCounter(1);
    setTimeout(() => {
      if (address)
        globalThis.open(
          "https://getgems.io/collection/EQA2L1KZAC9ALT8BGaDMlTJn-MEUqvd8dFIgzWQdTv09ZjkA",
          "_blank"
        );
      else onAction("connect");
      setAnimateCounter(0);
    }, 300);
  };

  return (
    <>
      <Navbar
        className="navbar"
        isBordered
        isCompact={{ "@smMax": true, "@smMin": false }}
        shouldHideOnScroll
        disableScrollHandler
        variant="static"
      >
        <Container
          md
          wrap="nowrap"
          justify="space-between"
          gap={1}
          css={{ display: "flex" }}
        >
          <Grid className="flex">
            <Navbar.Toggle
              isSelected={toggle}
              aria-label="toggle navigation"
              showIn="sm"
              onChange={(value) => setToggle(!!value)}
            />
            <Spacer x={0.8} />
            <Badge
              size="xs"
              content={t("beta")}
              placement="bottom-right"
              css={{
                mb: "$4",
              }}
            >
              <ThemeSwitcher isLogo loading={isLoadingWallet} />
            </Badge>

            <Navbar.Brand
              // ref={refLogo}
              css={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => navigate("/")}
            >
              <Grid.Container
                gap={2}
                alignItems="center"
                wrap="nowrap"
                css={{ pr: 0 }}
              >
                <Grid>
                  <Text
                    className="text-base"
                    css={{
                      textGradient: "45deg, $primary 25%, $secondary 125%",
                    }}
                    weight="bold"
                    hideIn="xs"
                  >
                    Find & Check
                  </Text>
                  <Text
                    className="text-base"
                    css={{
                      textGradient: "45deg, $primary 25%, $secondary 125%",
                    }}
                    weight="bold"
                    showIn="xs"
                  >
                    FCK
                  </Text>
                </Grid>
              </Grid.Container>
            </Navbar.Brand>
          </Grid>

          {(!isDebug || (!isPrivate && isDebug)) && (
            <>
              <Grid css={{ w: "100%" }} className="flex justify-center">
                <Navbar.Content hideIn="sm">
                  {menu.map(({ title, href, disabled }, index) => (
                    <Navbar.Link
                      key={index}
                      isActive={href === location.pathname}
                      onClick={() => navigate(href)}
                      css={disabled ? { pointerEvents: 'none', color: '$accents5' } : undefined}
                    >
                      {title}
                    </Navbar.Link>
                  ))}
                </Navbar.Content>
              </Grid>
              <Spacer x={0.4} />
            </>
          )}
          <Grid
            css={{
              "@xs": {
                display: "flex",
                jc: "flex-end",
              },
            }}
          >
            <Navbar.Content gap={8}>
              <Grid
                className="flex flex-nowrap"
                css={{ display: "none", "@smMin": { display: "flex" } }}
              >
                <DEX />
          <Spacer x={0.8} />
                <Currency />
          <Spacer x={0.8} />
              </Grid>
              <LanguageSwitcher />
              <TonConnectButton className="tconnect-button" />
              {(address || !isDebug || (!isPrivate && isDebug)) && (
                <Dropdown
                  placement="bottom-right"
                  closeOnSelect={false}
                  onOpenChange={setIsMenuOpen}
                >
                  <Navbar.Item>
                    <Dropdown.Trigger>
                      <Button
                        flat
                        size="sm"
                        style={{
                          minWidth: "auto",
                        }}
                      >
                        <ABS28
                          className="text-lg"
                          style={{
                            fill: "var(--nextui-colors-link)",
                          }}
                        />
                        <Text
                          color="primary"
                          className="overflow-hidden whitespace-nowrap text-ellipsis flex"
                        >
                          <Spacer x={0.4} />
                          {isLoadingWallet ? (
                            <Loading type="points-opacity" />
                          ) : !user && !address ? (
                            t("signIn")
                          ) : user ? (
                            user.first_name
                          ) : (
                            `...${address?.slice(-4)}`
                          )}
                        </Text>
                      </Button>
                    </Dropdown.Trigger>
                  </Navbar.Item>
                  <Dropdown.Menu
                    aria-label="User menu actions"
                    color="secondary"
                    onAction={onAction}
                    onChange={console.log}
                  >
                    <Dropdown.Item
                      key="switcher"
                      css={{
                        height: "unset",
                        p: 0,
                        margin: "-8px -8px 4px",
                        width: "calc(100% + 16px)",
                        bg: "none",
                      }}
                    >
                      <ThemeSwitcher />
                    </Dropdown.Item>
                    <Dropdown.Item
                      css={{
                        height: "fit-content",
                        margin: "-4px -8px 8px",
                        borderTop: "none",
                        display: "flex",
                        "@sm": { display: "none" },
                        zIndex: 9999,
                        bg: 'var(--nextui--navbarBackgroundColor)'
                      }}
                    >
                      <DEX />
                    </Dropdown.Item>
                    <Dropdown.Item
                      css={{
                        height: "fit-content",
                        margin: "-4px -8px",
                        display: "flex",
                        "@sm": { display: "none" },
                      }}
                    >
                      <Currency />
                    </Dropdown.Item>
                    {!address &&
                      ((
                        <Dropdown.Item
                          key="connect"
                          icon={
                            <ABS28
                              className="text-2xl"
                              style={{
                                fill: "var(--nextui-colors-link)",
                              }}
                            />
                          }
                          withDivider
                        >
                          {t("connectWallet")}
                        </Dropdown.Item>
                      ) as any)}
                    {!!address &&
                      ((
                        <Dropdown.Item key="analytics" withDivider>
                          {t("analytics")}
                        </Dropdown.Item>
                      ) as any)}
                    {!!address &&
                      ((
                        <Dropdown.Item key="logout" color="error" withDivider>
                          {t("disconnect")}
                        </Dropdown.Item>
                      ) as any)}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Navbar.Content>
          </Grid>
        </Container>
        <Navbar.Collapse isOpen={toggle}>
          <Navbar.CollapseItem
            key="home"
            isActive={"/" === location.pathname}
            onClick={() => onChangeHref("/")}
            className="cursor-pointer"
          >
            {t("home")}
          </Navbar.CollapseItem>
          {(!isDebug || (!isPrivate && isDebug)) &&
            menu.map(({ title, href, disabled }, index) => (
              <Navbar.CollapseItem
                key={index}
                isActive={href === location.pathname}
                onClick={() => onChangeHref(href)}
                className="cursor-pointer"
                css={disabled ? { pointerEvents: 'none', color: '$accents5' } : undefined}
              >
                {title}
              </Navbar.CollapseItem>
            ))}
        </Navbar.Collapse>
      </Navbar>

      <div className="flayout">
        {isDebug && isPrivate ? (
          <Grid.Container
            direction="column"
            justify="center"
            alignItems="center"
            css={{ minHeight: "70vh", p: "$8" }}
          >
            <Grid>
              <Card variant="bordered" css={{ p: "$8 $16 $8 $16" }}>
                <Card.Header css={{ pb: 0 }}>
                  <Text className="text-2xl text-center w-full" color="primary">
                    {t("joinCommunity")}
                  </Text>
                </Card.Header>
                <Card.Body css={{ overflow: "visible" }}>
                  <Image
                    src={iKey}
                    width={150}
                    objectFit="none"
                    className="key-animation"
                    css={{
                      borderRadius: "100%",
                      transition: "all 300ms",
                      transform: animateCounter ? "rotateZ(-90deg)" : undefined,
                    }}
                  />
                </Card.Body>
                <Card.Footer className="flex justify-center" css={{ pt: 0 }}>
                  <Button auto onClick={() => onPrivate()} size="lg">
                    {t(address ? "buy" : "connect")} {address && "NFT"}
                  </Button>
                </Card.Footer>
              </Card>
            </Grid>
          </Grid.Container>
        ) : children ? (
          children
        ) : (
          <Outlet />
        )}
      </div>
      {background}
      <Card
        variant="bordered"
        css={{
          borderRadius: 0,
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
        }}
      >
        <Card.Body
          css={{ p: "32px 0 32px", bg: "var(--nextui-colors-background)" }}
        >
          <Container md alignItems="center">
            <Grid.Container justify="space-between">
              <Grid
                xs={12}
                sm={4}
                css={{ display: "flex", flexDirection: "column" }}
              >
                <Grid.Container alignItems="center">
                  <Grid css={{ display: "flex" }}>
                    <img src={Logo.toString()} alt="logo" height={24} />
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid>
                    <Text
                      className="text-base"
                      css={{
                        textGradient: "45deg, $primary 25%, $secondary 125%",
                      }}
                      weight="bold"
                    >
                      Find & Check
                    </Text>
                  </Grid>
                </Grid.Container>
                <Spacer x={0.4} />
                <Text css={{ maxW: 400 }}>{t("footerDescription")}</Text>
                <Spacer x={0.4} />
                <Grid.Container>
                  <Grid>
                    <Link to="/privacy">
                      <Text>{t('privacyPolicy')}</Text>
                    </Link>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Link to="/cookie">
                      <Text>{t('cookiePolicy')}</Text>
                    </Link>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Link to="/terms">
                      <Text>{t('termsOfUse')}</Text>
                    </Link>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={0.4} css={{ "@sm": { display: "none" } }} />
              <Grid xs={12} sm={5}>
                <Grid.Container justify="space-between">
                  <Grid>
                    <Text className="text-lg">{t('project')}</Text>
                    <ul className="m-0 mt-4">
                      {/* <li>
                            <Link to="https://ton.app" target="_blank">
                              {t("apps")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="https://docs.ton.org/learn/glossary"
                              target="_blank"
                            >
                              {t("glossary")}
                            </Link>
                          </li> */}
                      <li>
                        <Link to="/team">{t("ourTeam")}</Link>
                      </li>
                      <li>
                        <Link to="/whitepaper" target="_blank">
                          {t("whitePaper")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/plitch" target="_blank">
                          {t("projectPlitch")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/roadmap" target="_blank">
                          {t("roadMap")}
                        </Link>
                      </li>
                    </ul>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Text className="text-lg">{t('community')}</Text>
                    <ul className="m-0 mt-4">
                      <li>
                        <Link to="https://t.me/tokenFCK" target="_blank">
                          Telegram
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="https://twitter.com/FCKFoundation"
                          target="_blank"
                        >
                          Twitter
                        </Link>
                      </li>
                      <li>
                        <Link to="https://discord.gg/u58ArC2K" target="_blank">
                          Discord
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="https://www.linkedin.com/company/fck-foundation/"
                          target="_blank"
                        >
                          LinkedIn
                        </Link>
                      </li>
                    </ul>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Text className="text-lg">{t('token')}</Text>
                    <ul className="m-0 mt-4">
                      <li>
                        <Link to="/#introduction">{t('introduction')}</Link>
                      </li>
                      <li>
                        <Link to="/#tokenomics">{t('tokenomics')}</Link>
                      </li>
                      <li>
                        <Link
                          to="https://dedust.io/swap/TON/EQA6TSGRCU46M9RgHvpRu1LcW6o1RRbhYrdwaVU4X4FEp_Z2"
                          target="_blank"
                        >
                          {t('buyFCK')}
                        </Link>
                      </li>
                      <li>
                        <Promote
                          voteId={voteId}
                          setVoteId={setVoteId}
                          trigger={<Link to="#">{t('castVote')}</Link>}
                        />
                      </li>
                    </ul>
                  </Grid>
                  {/* <Spacer x={1} />
                  <Grid>
                    <Text className="text-lg">{t('getInTouch')}</Text>
                    <Spacer y={0.4} />
                    <Grid.Container>
                      <Link to="https://t.me/tokenFCK" target="_blank">
                        <Button flat css={{ minWidth: "auto", p: "$4" }}>
                          <TG className="text-3xl fill-current" />
                        </Button>
                      </Link>
                      <Spacer x={0.4} />
                      <Link
                        to="https://twitter.com/FCKFoundation"
                        target="_blank"
                      >
                        <Button flat css={{ minWidth: "auto", p: "$4" }}>
                          <TW className="text-3xl fill-current" />
                        </Button>
                      </Link>
                      <Spacer x={0.4} />
                      <Link to="https://t.me/FCKAnalyticsBot" target="_blank">
                        <Button flat css={{ minWidth: "auto", p: "$4" }}>
                          <GEN02 className="text-3xl fill-current" />
                        </Button>
                      </Link>
                    </Grid.Container>
                    <Spacer y={0.4} />
                    <Link to="https://t.me/fckcoins" target="_blank">
                      <Button flat css={{ minWidth: "100%" }}>
                        <GEN16 className="text-2xl fill-current" />
                        <Spacer x={0.4} />
                        {t("joinCommunity")}
                      </Button>
                    </Link>
                  </Grid> */}
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Container>
        </Card.Body>
        <Card.Divider />
        <Card.Footer css={{ bg: "var(--nextui-colors-background)" }}>
          <Container md>
            <Grid.Container justify="space-between" alignItems="center">
              <Grid css={{ mt: "$8" }}>
                <Grid.Container alignItems="center" alignContent="center">
                  <Grid>{t("basedOn")}</Grid>
                  <Spacer x={0.4} />
                  <Grid>
                    <Link
                      to="https://ton.org"
                      target="_blank"
                      className="h-fit"
                    >
                      <Ton className="text-3xl" />
                    </Link>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid>
                    <Text className="text-base" weight="bold">
                      TON
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid css={{ mt: "$8" }}>2023 © Find & Check Foundation</Grid>
              <Grid xs={12}>
                <Spacer y={0.4} />
              </Grid>
              <Grid xs={12}>
                <Divider css={{ opacity: 0.3 }} />
              </Grid>
              <Grid xs={12} css={{ pt: "$8", pb: "$8" }}>
                <Text color="gray" className="text-xs">
                  {t("disclamer")}
                </Text>
              </Grid>
            </Grid.Container>
          </Container>
        </Card.Footer>
      </Card>
    </>
  );
};
