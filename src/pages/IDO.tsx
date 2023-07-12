import { Container, Grid } from "@nextui-org/react";
import { IDO } from "./Landing/components";

export const IDOPage = () => (
  <Container sm className="py-4">
    <Grid.Container justify="center">
      <Grid xs={12} sm={8}>
        <IDO />
      </Grid>
    </Grid.Container>
  </Container>
);
