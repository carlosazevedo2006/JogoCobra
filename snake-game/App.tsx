// App.tsx
// Entrada principal da app — configura navegação entre ecrãs.

import React from "react";
import { NavigationContainer } from "@react-navigation/native"; // container de navegação
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // stack navigator
import HomeScreen from "./src/screens/HomeScreen"; // ecrã principal / menu
import GameScreen from "./src/screens/GameScreen"; // ecrã do jogo
import GameOverScreen from "./src/screens/GameOverScreen"; // ecrã game over

// cria a stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // NavigationContainer envolve toda a app para gerir o estado de navegação
    <NavigationContainer>
      <Stack.Navigator>
        {/* Ecrã Home (menu) */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Snake — Menu" }}
        />
        {/* Ecrã do Jogo */}
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: "Jogo Snake" }}
        />
        {/* Ecrã Game Over */}
        <Stack.Screen
          name="GameOver"
          component={GameOverScreen}
          options={{ title: "Fim de Jogo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
