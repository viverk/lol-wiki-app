import React, { useEffect, useState } from "react";
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
import HeartButton from "./heart";

const HomePage = () => {
  const [champions, setChampions] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [searchText, setSearchText] = useState("");

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
      setChampions(championList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChampionSelect = async (champion) => {
    try {
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/13.9.1/data/fr_FR/champion/${champion.id}.json`
      );
      const data = await response.json();
      const championData = data.data[champion.id];
      setSelectedChampion(championData);
    } catch (error) {
      console.error(error);
    }
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
        <HeartButton></HeartButton>
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

  const filterChampions = (champions, searchText) => {
    return champions.filter((champion) =>
      champion.name.toLowerCase().includes(searchText.toLowerCase())
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
        data={filterChampions(champions, searchText)}
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

export default HomePage;
