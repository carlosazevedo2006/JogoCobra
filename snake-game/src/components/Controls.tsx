import React from "react";
import { View, Button } from "react-native";
import { Direction } from "../logic/gameTypes";

interface Props {
  onChangeDir: (dir: Direction) => void;
  onRestart: () => void;
}

export default function Controls({ onChangeDir, onRestart }: Props) {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ alignItems: "center" }}>
        <Button title="▲" onPress={() => onChangeDir(Direction.Up)} />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Button title="◀" onPress={() => onChangeDir(Direction.Left)} />
        <View style={{ width: 20 }} />
        <Button title="▶" onPress={() => onChangeDir(Direction.Right)} />
      </View>

      <View style={{ alignItems: "center" }}>
        <Button title="▼" onPress={() => onChangeDir(Direction.Down)} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Reiniciar" onPress={onRestart} />
      </View>
    </View>
  );
}
