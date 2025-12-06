// src/components/InGameMenu.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";

const { height } = Dimensions.get("window");

export default function InGameMenu({
  visible,
  onClose,
  onRestart,
  onSettings,
  onExitToModeSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onExitToModeSelect: () => void;
}) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, anim]);

  // translateY from +height -> 0 (visible)
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.6, 0],
  });
  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  if (!visible) return null;

  return (
    <>
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: colors.backdrop, opacity: backdropOpacity },
        ]}
      />
      <Animated.View style={[styles.sheet, { transform: [{ translateY }], backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Menu</Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onClose}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card, borderColor: colors.textSecondary, borderWidth: 1 }]} onPress={onRestart}>
          <Text style={[styles.buttonTextSecondary, { color: colors.textPrimary }]}>Reiniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card, borderColor: colors.textSecondary, borderWidth: 1 }]} onPress={onSettings}>
          <Text style={[styles.buttonTextSecondary, { color: colors.textPrimary }]}>Definições</Text>
        </TouchableOpacity>

        <View style={styles.sep} />

        {/* Exit button - label "PAUSA" conforme escolha */}
        <TouchableOpacity style={[styles.button, { backgroundColor: "#d32f2f" }]} onPress={onExitToModeSelect}>
          <Text style={[styles.buttonText, { color: "#fff" }]}>PAUSA</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    paddingTop: 18,
    paddingBottom: 36,
    paddingHorizontal: 22,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    alignSelf: "center",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "600",
  },
  sep: {
    height: 10,
  },
});
