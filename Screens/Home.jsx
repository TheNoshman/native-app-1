import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import updateTimetableCacheAction from '../actionCreators/updateTimetableCacheAction';

// COMPONENTS
import Destination from '../Components/Destination';

// SERVICE FUNCTIONS
import { getCachedTimetable, getStationTimetable } from '../serviceAPI';
import { calculateLastTrain } from '../serviceFunctions';
import dayjs from 'dayjs';

import Swiper from 'react-native-deck-swiper';

import Card from '../Components/Card';
import IconButton from '../Components/IconButton';
// import OverlayLabel from '../Components/OverlayLabel';

const { height } = Dimensions.get('window');

// const photoCards = [
//   {
//     name: 'Austin Wade',
//     age: 22,
//     photo: require('../assets/01.jpg'),
//     key: 'caseex6qfO4TPMYyhorner',
//   },
//   {
//     name: 'Aleksander Borzenets',
//     age: 28,
//     photo: require('../assets/02.jpg'),
//     key: 'ozda-XbeP0k',
//   },
// ];

const Home = ({ navigation }) => {
  console.log('nav =', navigation);

  // STATE FOR REFRESH
  const [isRefreshing, setIsRefreshing] = useState(false);
  // REDUX
  const dispatch = useDispatch();
  const reduxTimetables = useSelector((state) => state.reduxTimetables);
  const reduxSelectedStation = useSelector(
    (state) => state.reduxSelectedTrainStation,
  );
  const reduxUserTravelTime = useSelector((state) => state.reduxUserTravelTime);
  const reduxSeenDestinations = useSelector(
    (state) => state.reduxSeenDestinationCache,
  );

  // SWIPER HANDLERS
  const useSwiper = useRef(null).current;
  const handleOnSwipedLeft = () => useSwiper.swipeLeft();
  const handleOnSwipedTop = () => useSwiper.swipeTop();
  const handleOnSwipedRight = () => useSwiper.swipeRight();

  return (
    <View style={styles.container}>
      {!reduxSeenDestinations.length ? (
        <SafeAreaView>
          <Text>Loading...</Text>
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          <View style={styles.swiperContainer}>
            <Swiper
              ref={useSwiper}
              animateCardOpacity
              containerStyle={styles.container}
              cards={reduxSeenDestinations}
              renderCard={(card) => (
                <Card navigation={navigation} card={card} />
              )}
              cardIndex={0}
              onTapCard={(event) => navigation.navigate('Details', { event })}
              backgroundColor="white"
              stackSize={2}
              infinite
              showSecondCard
              animateOverlayLabelsOpacity

              // NOT WORKING
              // overlayLabels={{
              //   left: {
              //     title: 'NOPE',
              //     element: <OverlayLabel label="NOPE" color="#E5566D" />,
              //     style: {
              //       wrapper: styles.overlayWrapper,
              //     },
              //   },
              //   right: {
              //     title: 'LIKE',
              //     element: <OverlayLabel label="LIKE" color="#4CCC93" />,
              //     style: {
              //       wrapper: {
              //         ...styles.overlayWrapper,
              //         alignItems: 'flex-start',
              //         marginLeft: 30,
              //       },
              //     },
              //   },
              // }}
            />
          </View>
          {/* BUTTONS */}
          <View style={styles.buttonsContainer}>
            <IconButton
              name="remove"
              onPress={handleOnSwipedLeft}
              color="white"
              backgroundColor="#ffb01f"
            />
            <IconButton
              name="add"
              onPress={handleOnSwipedRight}
              color="white"
              backgroundColor="#00dbdb"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  swiperContainer: {
    height: height - 115,
  },
  buttonsContainer: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '15%',
    paddingTop: 10,
    paddingBottom: 25,
  },
  overlayWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginLeft: -30,
  },
});

export default Home;
