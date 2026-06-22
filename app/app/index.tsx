import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { searchIngredients } from "../services/search";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const results = searchIngredients(query);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🍳 Woowoogys</Text>
        <Text style={styles.subtitle}>Cherchez par ingrédient</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Rechercher un ingrédient..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.ingredient}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "/results",
                params: { ingredient: item.ingredient },
              })
            }
          >
            <Text style={styles.ingredient}>{item.ingredient}</Text>
            <Text style={styles.count}>
              {item.recipes.length} recette{item.recipes.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E07A5F",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  ingredient: {
    fontSize: 16,
    color: "#333",
  },
  count: {
    fontSize: 14,
    color: "#888",
  },
});
