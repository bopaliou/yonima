import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-transparent.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <ThemedText type="title" style={styles.title}>Accueil YONIMA</ThemedText>
      <ThemedText style={styles.subtitle}>La carte arrivera bientôt ici.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  logo: {
    width: 200,
    height: 70,
    marginBottom: 20,
  },
  title: {
    color: BrandColors.navyBlue,
    marginBottom: 8,
  },
  subtitle: {
    color: '#526975',
  },
});
