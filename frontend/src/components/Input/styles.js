export const styles_copyinput = {
  paddingRight: "0.5em !important",
  width: "100%",
  maxHeight: "200px",
  height: "50px",
  overflowY: "hidden",
  padding: "0 5px",
  "&": {
    border: "1px solid var(--clr-main-purple)",
    color: "var(--clr-main-clear)",
    background: "rgba(95, 29, 140, 0.12)",
    "& *, *:hover, *:focus, *:active": {
      border: "none !important",
      outline: "none !important",
    },
  },
  ".MuiInputBase-input": {},
  ".MuiInputAdornment-root": {
    cursor: "pointer",
  },
};
