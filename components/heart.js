import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { addChampion, removeChampion } from "../actions/championActions";

const HeartButton = ({ onPress, filled, item }) => {
  const [isFilled, setIsFilled] = useState(filled);

  const handlePress = () => {
    setIsFilled(!isFilled);
    onPress(item);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.heartContainer, isFilled && styles.filledHeart]}>
        <Ionicons
          name={isFilled ? "heart" : "heart-outline"}
          size={24}
          color={isFilled ? "red" : "black"}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  heartContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  filledHeart: {
    backgroundColor: "white",
    borderColor: "black",
  },
});

const mapStateToProps = null;

const mapDispatchToProps = {
  addChampion,
  removeChampion,
};

const ConnectedHeartButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeartButton);

export default ConnectedHeartButton;
