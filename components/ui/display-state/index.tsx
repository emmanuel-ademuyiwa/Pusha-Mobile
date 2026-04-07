import { BackgroundColorProps, ColorProps } from "@shopify/restyle";
import React, { PropsWithChildren } from "react";

import AppIcon from "../app-icon";
import Box from "../box";
import Typography from "../typography";

import { Theme } from "@/theme";

interface Props extends ColorProps<Theme>, BackgroundColorProps<Theme> {
  text?: string;
  subText?: string;
  state?: "error" | "info";
  iconColor?: string;
  icon?: string;
}

export const DisplayState = (props: PropsWithChildren<Props>) => {
  const {
    children,
    text,
    state = "empty",
    subText,
    icon = "add-image",
    iconColor = "#80A6F9",
    backgroundColor = "light-primary",
  } = props;
  return (
    <Box alignItems="center" justifyContent="center">
      <Box
        backgroundColor={state === "error" ? "error-300" : backgroundColor}
        height={48}
        width={48}
        borderRadius={8}
        alignItems="center"
        justifyContent="center"
      >
        <AppIcon
          name={state === "error" ? "info" : icon}
          size={24}
          color={state === "error" ? "#D70015" : iconColor}
        />
      </Box>
      {text && (
        <Typography variant="h2-bold" marginTop={16}>
          {text}
        </Typography>
      )}
      {subText && (
        <Typography
          variant="body"
          textAlign="center"
          marginTop={8}
          color="neutral-500"
        >
          {subText}
        </Typography>
      )}
      <Box marginTop={16}>{children}</Box>
    </Box>
  );
};

export default DisplayState;
