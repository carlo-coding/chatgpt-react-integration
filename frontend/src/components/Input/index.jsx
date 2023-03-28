import { OutlinedInput } from "@mui/material";
import { useEffect, useRef } from "react";
import { styles_copyinput } from "./styles";

export default function Input({ copyCb, ...props }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <OutlinedInput {...props} multiline sx={styles_copyinput} />;
}
