import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  formatRecipeName,
  getRecipesForIngredient,
} from "../services/search";

export default function ResultsScreen() {
  const { ingredient } = useLocalSearchParams<{ ingredient: string }>();
  const recipes = getRecipesForIngredient(ingredient ?? "") ?? [];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: ingredient ?? "" }} />

      <Text style={styles.header}>
        {recipes.length} recette{recipes.length > 1 ? "s" : ""} avec{" "}
        <Text style={styles.headerBold}>{ingredient}</Text>
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.fileName}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "/recipe",
                params: { fileName: item.fileName },
              })
            }
          >
            <Text style={styles.recipeName}>
              {formatRecipeName(item.fileName)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 15,
    color: "#888",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerBold: {
    color: "#E07A5F",
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  recipeName: {
    fontSize: 16,
    color: "#333",
  },
});
