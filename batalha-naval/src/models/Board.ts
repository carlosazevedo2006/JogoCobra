import { View, StyleSheet } from 'react-native';
import { Board as BoardModel } from '../models/Board';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardModel;
  onCellPress?: (row: number, col: number) => void;
  showShips?: boolean;
}

export function Board({ board, onCellPress, showShips = false }: BoardProps) {
  return (
    <View style={styles.board}>
      {board.grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              cell={cell}
              showShips={showShips}
              onPress={
                onCellPress
                  ? () => onCellPress(rowIndex, colIndex)
                  : undefined
              }
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    padding: 4,
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
});
