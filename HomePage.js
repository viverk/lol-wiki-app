import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Card, Button, ListItem } from "@rneui/themed";
import HeartButton from "./components/heart";
import {
  initChampions,
  addChampion,
  removeChampion,
} from "./actions/championActions";
import { useDispatch, useSelector } from "react-redux";

const HomePage = ({ champions, addChampion, removeChampion }) => {
  const [champs, setChamps] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const championsStore = useSelector((state) => state.champions);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    try {
      const response = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/13.9.1/data/fr_FR/champion.json"
      );
      const data = await response.json();
      const championList = Object.values(data.data);
      setChamps(championList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChampionSelect = async (champ) => {
    try {
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/13.9.1/data/fr_FR/champion/${champ.id}.json`
      );
      const data = await response.json();
      const championData = data.data[champ.id];
      setSelectedChampion(championData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchChampionsFromStorage = async () => {
      try {
        const championsFromStorage = await AsyncStorage.getItem("champions");
        if (championsFromStorage) {
          const parsedChampions = JSON.parse(championsFromStorage);
          dispatch(initChampions(parsedChampions));
        }
      } catch (error) {
        console.error("Error fetching champions from AsyncStorage:", error);
      }
    };

    fetchChampionsFromStorage();
  }, [dispatch]);

  const handleHeartPress = (champion) => {
    if (isChampionInFavorites(champion)) {
      removeChampion(champion);
    } else {
      addChampion(champion);
    }

    const saveChampionsToStorage = async () => {
      try {
        await AsyncStorage.setItem("champions", JSON.stringify(champions));
      } catch (error) {
        console.error("Error saving champions to AsyncStorage:", error);
      }
    };

    saveChampionsToStorage();
  };

  const isChampionInFavorites = (champion) => {
    return champions.some((c) => c.id === champion.id);
  };

  const renderChampion = ({ item }) => {
    return (
      <ListItem key={item.key} bottomDivider>
        <Image
          source={{
            uri: `https://ddragon.leagueoflegends.com/cdn/13.9.1/img/champion/${item.image.full}`,
          }}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            borderRadius: 10,
          }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
        </ListItem.Content>
        <HeartButton
          onPress={() => handleHeartPress(item)}
          filled={isChampionInFavorites(item)}
          item={item}
        ></HeartButton>
        <Button
          title="Détails"
          onPress={() => handleChampionSelect(item)}
          buttonStyle={{
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        />
      </ListItem>
    );
  };

  const filterChampions = (champs, searchText) => {
    return champs.filter((champ) =>
      champ.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          marginTop: 50,
        }}
      >
        Liste des champions de League of Legends
      </Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un champion..."
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <FlatList
        data={filterChampions(champs, searchText)}
        renderItem={renderChampion}
        keyExtractor={(item) => item.key}
      />
      {selectedChampion && (
        <View style={styles.championDetails}>
          <Text style={styles.championName}>
            {selectedChampion.name} ({selectedChampion.title})
          </Text>
          <ScrollView>
            <Text style={styles.abilityTitle}>Histoire :</Text>
            <View style={styles.spellContainer}>
              <Text style={styles.abilityDescription}>
                {selectedChampion.lore}
              </Text>
            </View>
            <Text style={styles.abilityTitle}>Passif:</Text>
            <View style={styles.spellContainer}>
              <Image
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/13.9.1/img/passive/${selectedChampion.passive.image.full}`,
                }}
                style={styles.abilityImage}
              />
              <Text style={styles.spellName}>
                {selectedChampion.passive.name}
              </Text>

              <Text style={styles.abilityDescription}>
                {selectedChampion.passive.description}
              </Text>
            </View>
            <View style={styles.abilityContainer}>
              <Text style={styles.abilityTitle}>Sorts:</Text>
              {selectedChampion.spells.map((spell, index) => (
                <View key={index} style={styles.spellContainer}>
                  <Image
                    source={{
                      uri: `https://ddragon.leagueoflegends.com/cdn/13.9.1/img/spell/${spell.image.full}`,
                    }}
                    style={styles.spellImage}
                  />
                  <Text style={styles.spellName}>{spell.name}</Text>
                  <Text style={styles.spellDescription}>
                    {spell.description}
                  </Text>
                </View>
              ))}
            </View>

            <Button
              title="Fermer"
              onPress={() => setSelectedChampion(null)}
              buttonStyle={{ marginTop: 10 }}
              style={{ marginBottom: 150 }}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    champions: state.champions,
  };
};

const mapDispatchToProps = {
  addChampion,
  removeChampion,
};

const styles = StyleSheet.create({
  championDetails: {
    padding: 10,
    backgroundColor: "lightgray",
    marginTop: 10,
    marginBottom: 130,
  },
  championName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  abilityContainer: {
    marginBottom: 10,
    textAlign: "justify",
  },
  abilityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  abilityImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  abilityDescription: {
    marginBottom: 5,
    textAlign: "justify",
  },
  spellContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 30,
  },
  spellImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginBottom: 10,
  },
  spellName: {
    fontWeight: "bold",
    marginRight: 5,
    marginBottom: 10,
  },
  spellDescription: {
    textAlign: "justify",
  },
  spellsContainer: {
    marginBottom: 10,
  },
  spellContent: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    margin: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
