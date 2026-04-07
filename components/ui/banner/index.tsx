import { BackgroundColorProps } from "@shopify/restyle";
import React, { FC, PropsWithChildren } from "react";

import AppIcon from "../app-icon";
import Box from "../box";
import TextAction from "../text-action";
import Typography from "../typography";

import { Theme } from "@/theme";

interface BannerProps {
  text: string;
  variant: "info" | "warning" | "security";
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface BannerConfig extends BackgroundColorProps<Theme> {
  icon: string;
  iconColor: string;
}

export const Banner: FC<PropsWithChildren<BannerProps>> = (props) => {
  const getAlertColor = (): BannerConfig => {
    switch (props.variant) {
      case "info": {
        return {
          icon: props.icon ?? "check-fill",
          iconColor: "#2C67F6",
          backgroundColor: "light-primary",
        };
      }
      case "warning": {
        return {
          icon: props.icon ?? "info-fill",
          iconColor: "#F0960F",
          backgroundColor: "caution-300",
        };
      }
      case "security": {
        return {
          icon: props.icon ?? "security",
          iconColor: "#20B038",
          backgroundColor: "success-200",
        };
      }
      default:
        return {
          icon: props.icon ?? "check",
          iconColor: "#2C67F6",
          backgroundColor: "light-primary",
        };
    }
  };

  return (
    <Box
      flexDirection="row"
      width="100%"
      gap={8}
      backgroundColor={getAlertColor().backgroundColor}
      py={10}
      px={12}
      borderRadius={12}
    >
      <AppIcon
        name={getAlertColor().icon}
        size={20}
        color={getAlertColor().iconColor}
      />
      <Box flex={1} flexDirection="row" justifyContent="space-between">
        <Typography
          color="neutral-600"
          variant="body-medium"
          textBreakStrategy="highQuality"
        >
          {props.children ?? props.text}
        </Typography>
        {props.action && (
          <TextAction onPress={props.action.onPress}>
            {props.action.label}
          </TextAction>
        )}
      </Box>
    </Box>
  );
};
