import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import Box from "../ui/box";

const SplashScreen = () => {
  const pulseAnimation = useMemo(() => new Animated.Value(1), []);
  const insets = useSafeAreaInsets();
  const paddingBottom =
    Platform.OS === "android" ? Math.round(insets.bottom) + 20 : Math.round(insets.bottom) + 16;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    gradientBG: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: Math.round(insets.top),
      paddingBottom,
    },
    logoContainer: {
      width: 86,
      height: 86,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.25,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();

    return () => {
      pulseAnimation.setValue(1); // Reset animation value
    };
  }, [pulseAnimation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#000000', '#000000']}
        style={styles.gradientBG}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              flex: 1,
              transform: [{scale: pulseAnimation}]
            }
          ]}>
          <Svg width={50} height={50} viewBox="0 0 172 172">
            <Path
              fill="#fff"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M57.307 0.667969C25.8427 0.667969 0.335938 26.1748 0.335938 57.639V114.61C0.335938 146.074 25.8427 171.581 57.307 171.581H114.278C145.742 171.581 171.249 146.074 171.249 114.61V57.639C171.249 26.1748 145.742 0.667969 114.278 0.667969H57.307ZM45.5063 76.0534C39.9442 81.6155 39.9442 90.6335 45.5063 96.1957L75.7198 126.409C81.2819 131.971 90.2999 131.971 95.8621 126.409L126.076 96.1957C131.638 90.6335 131.638 81.6155 126.076 76.0534L95.8621 45.8399C90.2999 40.2778 81.2819 40.2778 75.7198 45.8399L45.5063 76.0534Z"
            />
          </Svg>
        </Animated.View>
      </LinearGradient>
      <Box
        style={{
          position: 'absolute',
          bottom: paddingBottom,
          alignItems: 'center'
        }}>
        <Svg width="63.24" height="20" viewBox="0 0 113 37" fill="none">
          <Path
            d="M14.7344 36.4922C13.1406 36.4922 11.5859 36.1406 10.0703 35.4375C8.55469 34.7344 7.3125 33.7812 6.34375 32.5781L6.36719 36H-0.0078125V0.65625H6.41406V13.2891C7.32031 12.1484 8.5 11.25 9.95312 10.5938C11.4062 9.92187 12.9375 9.59375 14.5469 9.60938C18.1875 9.59375 21.1719 10.8359 23.5 13.3359C25.8281 15.8359 27 19.0625 27.0156 23.0156C27.0312 26.9531 25.8906 30.1875 23.5938 32.7188C21.2969 35.2344 18.3438 36.4922 14.7344 36.4922ZM6.20312 22.9922C6.20312 25.1953 6.90625 27.0234 8.3125 28.4766C9.71875 29.9297 11.4375 30.6562 13.4688 30.6562C15.5156 30.6562 17.1719 29.9531 18.4375 28.5469C19.7188 27.125 20.3594 25.2734 20.3594 22.9922C20.3594 20.7109 19.7188 18.8672 18.4375 17.4609C17.1719 16.0547 15.5156 15.3594 13.4688 15.375C11.4219 15.3594 9.69531 16.0781 8.28906 17.5312C6.88281 18.9688 6.1875 20.7891 6.20312 22.9922ZM41.71 36.4922C39.3506 36.4922 37.2334 35.9141 35.3584 34.7578C33.4991 33.6016 32.0459 32 30.9991 29.9531C29.9678 27.8906 29.4522 25.5703 29.4522 22.9922C29.4678 19.0859 30.6475 15.875 32.9912 13.3594C35.335 10.8438 38.3037 9.59375 41.8975 9.60938C43.4756 9.59375 44.9912 9.90625 46.4444 10.5469C47.8975 11.1875 49.085 12.0547 50.0069 13.1484V10.1719H56.4287V36H50.0537L50.0772 32.7422C49.0616 33.8984 47.8037 34.8125 46.3037 35.4844C44.8037 36.1562 43.2725 36.4922 41.71 36.4922ZM36.1084 22.9922C36.1084 25.2734 36.7412 27.1328 38.0069 28.5703C39.2725 29.9922 40.9209 30.7031 42.9522 30.7031C44.9991 30.7031 46.7256 29.9766 48.1319 28.5234C49.5537 27.0703 50.2725 25.2266 50.2881 22.9922C50.2881 20.7734 49.5772 18.9453 48.1553 17.5078C46.7491 16.0547 45.0147 15.3281 42.9522 15.3281C40.9209 15.3281 39.2725 16.0391 38.0069 17.4609C36.7412 18.8828 36.1084 20.7266 36.1084 22.9922ZM61.2794 36V30.8906L74.2637 15.3281H61.4434V10.1719H82.2794V15.6094L69.8106 30.8438H82.5137V36H61.2794ZM98.6612 36.6094C96.0987 36.625 93.7941 36.0703 91.7472 34.9453C89.7159 33.8047 88.1222 32.2031 86.9659 30.1406C85.8097 28.0781 85.2316 25.7344 85.2316 23.1094C85.2316 20.5781 85.8175 18.2812 86.9894 16.2188C88.1769 14.1406 89.7941 12.5234 91.8409 11.3672C93.8878 10.2109 96.1534 9.63281 98.6378 9.63281C102.903 9.63281 106.286 11.0313 108.786 13.8281C111.302 16.6094 112.349 20.2266 111.927 24.6797H91.8409C91.9347 26.6328 92.63 28.2266 93.9269 29.4609C95.2237 30.6797 96.8409 31.2812 98.7784 31.2656C100.294 31.25 101.614 30.8828 102.739 30.1641C103.88 29.4453 104.646 28.5234 105.036 27.3984H111.739C111.146 30.1328 109.646 32.3594 107.239 34.0781C104.833 35.7812 101.974 36.625 98.6612 36.6094ZM91.9816 20.3438H105.271C105.099 18.7188 104.411 17.3984 103.208 16.3828C102.021 15.3672 100.56 14.8516 98.8253 14.8359C97.1222 14.8359 95.6378 15.3438 94.3722 16.3594C93.1066 17.375 92.3097 18.7031 91.9816 20.3438Z"
            fill="white"
          />
        </Svg>
      </Box>
    </View>
  )
};

export default SplashScreen;
