import * as React from "react";
import Typography from "@mui/material/Typography";

interface TextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | "inherit"
    | undefined;
  type: "header" | "text";
  color?: string;
  children?: React.ReactNode;
  customStyles?: React.CSSProperties;
}

export default function Text(props: TextProps) {
  return (
    <Typography
      component={props.type === "header" ? "h2" : "span"}
      variant={props.variant || "body1"}
      color={props.color || "text.primary"}
      gutterBottom
      style={{ margin: "0", ...props.customStyles }}
    >
      {props.children}
    </Typography>
  );
}
