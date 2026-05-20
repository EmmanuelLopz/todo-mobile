import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import type { Href } from "expo-router";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

const LOGIN_ROUTE: Href = { pathname: '/login' };
const TABS_ROUTE: Href = { pathname: '/(tabs)' };

export const unstable_settings = {
  anchor: "(tabs)",
};

function NavigationGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === null) return; // still loading

    // Only the login screen is the "public" area. Every other route
    // (the tabs AND nested screens like /lists/[id]) is authenticated.
    const onLoginScreen = segments[0] === 'login';

    if (!isAuthenticated && !onLoginScreen) {
      // Unauthenticated users get sent to login from anywhere else.
      router.replace(LOGIN_ROUTE);
    } else if (isAuthenticated && onLoginScreen) {
      // Authenticated users should not sit on the login screen.
      router.replace(TABS_ROUTE);
    }
    // Authenticated users on any other route (tabs, /lists/[id], modal)
    // are left alone — this is what allows navigation into list detail.
  }, [isAuthenticated, segments]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <GluestackUIProvider mode="light">
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <NavigationGuard />
          <RootStack />
          <StatusBar style="auto" />
        </ThemeProvider>
      </GluestackUIProvider>
    </AuthProvider>
  );
}

function RootStack() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return null; // splash while checking token

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}
