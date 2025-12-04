// App.tsx
import React from "react";
import { SafeAreaView } from "react-native";
import { useFonts } from "expo-font";
import Game from "./src/screens/Game";

export default function App() {
  const [fontsLoaded] = useFonts({
    PixelFont: require("./assets/fonts/PixelFont.ttf"),
  });

  // nada de AppLoading — Expo 54 não usa isso
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <Game />
    </SafeAreaView>
  );
}
