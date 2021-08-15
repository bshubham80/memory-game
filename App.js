import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

import {Headline, Paragraph} from 'react-native-paper';

const MAX_CARD = 16;

const COLUMN_COUNT = 4;

const PARENT_LEFT_PADDING = 32;

const CELL_RIGHT_SPACING = 8;

const {width} = Dimensions.get('screen');

const CHOICES = [
  'A',
  'A',
  'B',
  'B',
  'C',
  'C',
  'D',
  'D',
  'E',
  'E',
  'F',
  'F',
  'G',
  'G',
  'H',
  'H',
];

const suffleArray = () => {
  return CHOICES.sort((a, b) => 0.5 - Math.random()).map(item => {
    return {
      value: item,
      is_open: false,
    };
  });
};

export default props => {
  const [turn, setTurn] = useState(0);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState(suffleArray());
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentSelection, setCurrentSelection] = useState([]);

  useEffect(() => {
    if (score === MAX_CARD / 2) {
      Alert.alert(
        'Awesome!',
        'You complete the game. Press the button to restart',
        [{title: 'Ok', onPress: restartGame}]
      );
    }
  }, [restartGame, score]);

  const restartGame = useCallback(() => {
    setTurn(0);
    setScore(0);
    setCurrentSelection([]);
    setSelectedCards([]);
    setCards(suffleArray());
  }, []);

  const onCardPress = useCallback(
    (item, index) => {
      const isClosed = !currentSelection.includes(index);
      const isNotInSelectedCards = !selectedCards.includes(item.value);

      let SCORE = score;
      let TURNS = turn;
      let CARDS = [...cards];
      const SELECTED_CARDS = [...selectedCards];

      if (isClosed && isNotInSelectedCards) {
        let enable = true;
        CARDS[index].is_open = true;

        // add item into selected cards
        let OPEN_CARDS = [...currentSelection, index];

        if (OPEN_CARDS.length === 2) {
          const [first, second] = OPEN_CARDS;
          // update turn count
          TURNS += 1;

          if (CARDS[first].value === CARDS[second].value) {
            SCORE += 1;
            SELECTED_CARDS.push(item.value);
          } else {
            enable = false;

            CARDS[OPEN_CARDS[0]].is_open = false;
            setTimeout(() => {
              CARDS[index].is_open = false;
              setCards(CARDS);
            }, 500);
          }
          OPEN_CARDS = [];
        }

        // update cards array in state
        if (enable) {
          setCards(CARDS);
        }
        // updated open cards array
        setCurrentSelection(OPEN_CARDS);
        // update score
        setScore(SCORE);
        // update turn
        setTurn(TURNS);
        // update selected card
        setSelectedCards(SELECTED_CARDS);
      }
    },
    [cards, turn, score, currentSelection, setCurrentSelection, selectedCards]
  );

  const renderCard = useCallback(
    (item, index) => {
      const {value, is_open} = item;
      const isAlreadyVerified = selectedCards.includes(value);
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            isAlreadyVerified ? styles.verifiedCard : styles.normal,
          ]}
          onPress={() => {
            if (!is_open) {
              onCardPress(item, index);
            }
          }}>
          {is_open && <Text>{item.value}</Text>}
        </TouchableOpacity>
      );
    },
    [selectedCards, onCardPress]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>{cards.map(renderCard)}</View>
      <View style={styles.row}>
        <View>
          <Headline>Your Score</Headline>
          <Paragraph style={styles.paragraph}>{score}</Paragraph>
        </View>
        <View>
          <Headline>Total Turns</Headline>
          <Paragraph style={styles.paragraph}>{turn}</Paragraph>
        </View>
      </View>
      <Paragraph style={styles.paragraph}>Tap on the card to play !!</Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 40,
    paddingHorizontal: PARENT_LEFT_PADDING / 2,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#aaa',
    borderRadius: 8,
    paddingLeft: CELL_RIGHT_SPACING,
    paddingTop: CELL_RIGHT_SPACING,
  },
  card: {
    width:
      width / COLUMN_COUNT -
      PARENT_LEFT_PADDING / COLUMN_COUNT -
      CELL_RIGHT_SPACING / COLUMN_COUNT -
      CELL_RIGHT_SPACING,
    height: 80,
    marginRight: CELL_RIGHT_SPACING,
    marginBottom: CELL_RIGHT_SPACING,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  verifiedCard: {
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
  },
  normal: {
    backgroundColor: 'red',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
