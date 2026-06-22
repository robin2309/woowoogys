import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#E07A5F",
        headerTitleStyle: { color: "#333" },
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerBackTitle: "Retour",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="results" />
      <Stack.Screen name="recipe" />
    </Stack>
  );
}
