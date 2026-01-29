import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View, ViewToken } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';

import { OnboardingSlide } from '@/components/onboarding/OnboardingSlide';
import { PaginationDots } from '@/components/onboarding/PaginationDots';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/theme';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        image: require('@/assets/images/onboarding/slide1-scooter.jpg'),
        title: 'Envoyez vos colis partout au Sénégal',
        subtitle: 'Dites-nous où livrer, et nous trouvons le meilleur livreur près de chez vous.',
    },
    {
        id: '2',
        image: require('@/assets/images/onboarding/slide2-tracking.png'),
        title: 'Suivez en temps réel',
        subtitle: 'Localisez votre colis à chaque instant grâce au suivi GPS haute précision.',
    },
    {
        id: '3',
        image: require('@/assets/images/onboarding/slide3-trust.png'),
        title: 'Tarifs transparents, sans surprises',
        subtitle: 'Obtenez le prix exact avant d\'envoyer. Payez uniquement ce qui est affiché.',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { setOnboardingCompleted } = useOnboardingStatus();
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useSharedValue(0);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const triggerHaptic = () => {
        Haptics.selectionAsync();
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0] && viewableItems[0].index !== null) {
            const newIndex = viewableItems[0].index;
            if (newIndex !== currentIndex) {
                runOnJS(triggerHaptic)();
                setCurrentIndex(newIndex);
            }
        }
    }).current;

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            await finishOnboarding();
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
            });
        }
    };

    const handleSkip = async () => {
        await finishOnboarding();
    };

    const finishOnboarding = async () => {
        await setOnboardingCompleted();
        router.replace('/auth/login');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            {/* Sticky Logo Header */}
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/logo-transparent.png')}
                    style={styles.logo}
                    contentFit="contain"
                />
            </View>

            {/* Back Button (Top Left) - only show after first slide */}
            {currentIndex > 0 && (
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>
            )}

            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={({ item, index }) => (
                    <OnboardingSlide
                        item={item}
                        index={index}
                        scrollX={scrollX}
                    />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={scrollHandler}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                scrollEventThrottle={16}
            />

            {/* Bottom Navigation */}
            <View style={styles.footer}>
                {/* Pagination Dots */}
                <PaginationDots data={SLIDES} scrollX={scrollX} />

                {/* Navigation Row */}
                <View style={styles.navRow}>
                    {/* Skip Button */}
                    <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <ThemedText style={styles.skipText}>PASSER</ThemedText>
                    </TouchableOpacity>

                    {/* Next Button / Commencer */}
                    <TouchableOpacity
                        onPress={handleNext}
                        style={[
                            styles.nextButton,
                            currentIndex === SLIDES.length - 1 && styles.startButton // Adaptive style
                        ]}
                        activeOpacity={0.8}
                    >
                        {currentIndex === SLIDES.length - 1 ? (
                            <ThemedText style={styles.startButtonText}>YONIMA</ThemedText>
                        ) : (
                            <Ionicons name="arrow-forward" size={24} color={BrandColors.white} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BrandColors.white,
    },
    header: {
        position: 'absolute',
        top: 60, // Safe area
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5, // Above slides
    },
    logo: {
        width: 120,
        height: 40,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 50, // Slightly lower
        left: 0,
        right: 0,
        paddingHorizontal: 32,
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 48,
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    skipText: {
        fontFamily: 'Inter_600SemiBold', // Slightly bolder
        color: '#909090',
        fontSize: 13,
        letterSpacing: 1.5, // Spaced out caps
    },
    nextButton: {
        width: 64, // Larger click area
        height: 64,
        borderRadius: 32,
        backgroundColor: BrandColors.orange,
        justifyContent: 'center',
        alignItems: 'center',
        // Glow Effect
        shadowColor: BrandColors.orange,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    startButton: {
        width: 160,
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        gap: 8,
    },
    startButtonText: {
        color: '#FFF',
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});
