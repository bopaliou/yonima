import { BrandColors } from '@/constants/theme';
import { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SplashScreenProps {
    onAnimationComplete: () => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
    const insets = useSafeAreaInsets();

    // Animation values
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.8);
    const taglineOpacity = useSharedValue(0);
    const taglineTranslateY = useSharedValue(20);
    const containerOpacity = useSharedValue(1);

    useEffect(() => {
        // Logo entrance animation
        logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        logoScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) });

        // Tagline entrance with delay
        taglineOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
        taglineTranslateY.value = withDelay(400, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

        // Fade out entire screen after 3 seconds
        const timeout = setTimeout(() => {
            containerOpacity.value = withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, (finished) => {
                if (finished) {
                    runOnJS(onAnimationComplete)();
                }
            });
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const taglineAnimatedStyle = useAnimatedStyle(() => ({
        opacity: taglineOpacity.value,
        transform: [{ translateY: taglineTranslateY.value }],
    }));

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
    }));

    return (
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
            {/* Logo centered */}
            <View style={styles.logoContainer}>
                <Animated.View style={logoAnimatedStyle}>
                    <Image
                        source={require('@/assets/images/logo-splash.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* Loading indicator */}
                <ActivityIndicator
                    size="large"
                    color={BrandColors.navyBlue}
                    style={styles.loader}
                />
            </View>

            {/* Tagline at bottom */}
            <Animated.View style={[styles.taglineContainer, { paddingBottom: insets.bottom + 40 }, taglineAnimatedStyle]}>
                <Animated.Text style={styles.tagline}>
                    Digitaliser la confiance
                </Animated.Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: BrandColors.white,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: Math.min(SCREEN_WIDTH * 0.8, 320),
        height: Math.min(SCREEN_WIDTH * 0.8, 320),
    },
    loader: {
        marginTop: 32,
    },
    taglineContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    tagline: {
        fontFamily: 'Inter_300Light',
        fontSize: 16,
        color: BrandColors.navyBlue,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});
