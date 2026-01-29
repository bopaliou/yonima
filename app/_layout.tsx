import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashScreen as CustomSplash } from '@/components/splash-screen';
import { BrandColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';

// Keep native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { isFirstLaunch, isLoading: isOnboardingLoading } = useOnboardingStatus();
  const router = useRouter();

  // Load Inter fonts
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load any additional resources here
        // For example: await Asset.loadAsync([...]);

        // Artificial minimum delay for branding visibility (optional)
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.warn('Error loading resources:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady && !isOnboardingLoading) {
      // Hide native splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [appIsReady, isOnboardingLoading]);

  useEffect(() => {
    if (!isOnboardingLoading && isFirstLaunch && appIsReady) {
      // Use timeout to ensure navigation is ready
      setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
    }
  }, [isOnboardingLoading, isFirstLaunch, appIsReady]);

  const onSplashAnimationComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Wait for fonts to load before rendering
  if (!fontsLoaded || !appIsReady || isOnboardingLoading) {
    return null;
  }

  // Custom dark theme with YONIMA colors
  const YonimaDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: BrandColors.cyan,
      background: BrandColors.navyBlue,
      card: BrandColors.navyDark,
    },
  };

  const YonimaLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: BrandColors.cyan,
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? YonimaDarkTheme : YonimaLightTheme}>
        <View style={styles.container}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>

          {/* Custom animated splash overlay */}
          {showSplash && (
            <CustomSplash onAnimationComplete={onSplashAnimationComplete} />
          )}
        </View>

        {/* Status bar: light content during splash, auto otherwise */}
        <StatusBar style={showSplash ? 'light' : 'auto'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
