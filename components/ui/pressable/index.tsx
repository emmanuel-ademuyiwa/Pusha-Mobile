import * as Haptics from "expo-haptics";
import React, { FC, PropsWithChildren } from "react";
import { Pressable } from "react-native";

interface Props {
  onPress?: () => any;
  onPressIn?: () => (Promise<void> | void | null) | undefined;
  onPressOut?: () => (Promise<void> | void | null) | undefined;
  onLongPress?: () => (Promise<void> | void | null) | undefined;
  margin?: number;
  padding?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  disabled?: boolean;
  position?: "absolute" | "relative";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  height?: number;
  width?: number;
  backgroundColor?: string;
  zIndex?: number;
  borderRadius?: number;
  style?: any;
  flex?: number;
  display?: "flex" | "none";
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  justifyContent?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  flexDirection?: "row" | "column";
  gap?: number;
  overflow?: "scroll" | "hidden";
  opacity?: number;
  shadowColor?: string;
}

export const AppPressable: FC<PropsWithChildren<Props>> = (props) => {
  const {
    children,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    disabled,
    style,
    ...layoutStyle
  } = props

  return (
    <Pressable
      disabled={disabled}
      role="button"
      accessibilityRole="button"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLongPress={onLongPress}
      onPress={() => {
        // Haptics.impactAsync()
        onPress?.()
      }}
      style={({pressed}) => [
        layoutStyle,
        style,
        pressed ? {opacity: 0.75} : {opacity: 1},
        disabled ? {opacity: 0.75} : null,
      ]}>
      {children}
    </Pressable>
  )
}

export default AppPressable;
