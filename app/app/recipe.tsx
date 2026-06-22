import { ScrollView, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Markdown from "react-native-markdown-display";
import { formatRecipeName } from "../services/search";
import recipes from "../assets/data/recipes.json";

const recipesData = recipes as Record<string, string>;

export default function RecipeScreen() {
  const { fileName } = useLocalSearchParams<{ fileName: string }>();
  const content = recipesData[fileName ?? ""] ?? "Recette introuvable.";
  const title = formatRecipeName(fileName ?? "");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Markdown style={markdownStyles}>{content}</Markdown>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
});

const markdownStyles = StyleSheet.create({
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E07A5F",
    marginBottom: 8,
    marginTop: 16,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  heading3: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
  },
  bullet_list_icon: {
    color: "#E07A5F",
  },
  ordered_list_icon: {
    color: "#E07A5F",
  },
  strong: {
    fontWeight: "700",
  },
  hr: {
    backgroundColor: "#EEE",
    height: 1,
    marginVertical: 16,
  },
});
