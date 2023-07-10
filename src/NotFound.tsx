import { Container, Grid } from "@nextui-org/react";
import { ReactComponent as Error } from "./assets/404.svg";

const NotFound = () => {
  return (
    <Container>
      <Grid.Container justify="center" alignItems="center">
        <Grid>
          <Error
            className="h-screen"
            style={{ color: "var(--nextui-colors-primary)" }}
          />
        </Grid>
      </Grid.Container>
    </Container>
  );
};

export default NotFound;
