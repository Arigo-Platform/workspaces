"use client";
import { Card, Grid } from "@mui/material";

export default function Home() {
  return (
    <Grid container spacing={2} sx={{ paddingTop: "32px" }}>
      <Grid item xs={8}>
        <Card></Card>
      </Grid>
    </Grid>
  );
}
