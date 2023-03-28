export const styles_button = (shape) => {
  let shapes = shape.split(",");
  let [width, height, borderRadius] = shapes.includes("round")
    ? shapes.includes("small")
      ? ["50px", "50px", "50%"]
      : shapes.includes("medium")
      ? ["70px", "70px", "50%"]
      : shapes.includes("large")
      ? ["100px", "100px", "50%"]
      : ["50px", "50px", "50%"]
    : ["100%", "auto", "5px"];

  return {
    padding: "0.85em 0.5em",
    fontSize: "1rem",
    width: width,
    height: height,
    borderRadius: borderRadius,
    background: "var(--clr-main-purple)",
    color: "var(--clr-main-clear)",
    border: "none",
    display: "grid",
    placeItems: "center",
    ":active": {
      transform: "scale(0.9)",
    },
  };
};
