import { Box } from "@mui/material";
import * as React from "react";

function Subscribe() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <stripe-pricing-table
        pricing-table-id={import.meta.env.VITE_STRIPE_PRICING_TABLE_ID}
        publishable-key={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
      ></stripe-pricing-table>
    </Box>
  );
}

export default Subscribe;
