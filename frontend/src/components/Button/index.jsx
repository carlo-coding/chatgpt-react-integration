import { ButtonBase } from "@mui/material";
import React from "react";
import { styles_button } from "./styled";

export default function Button({ shape = "", children, ...props }) {
  return (
    <ButtonBase {...props} sx={styles_button(shape)}>
      {children}
    </ButtonBase>
  );
}
