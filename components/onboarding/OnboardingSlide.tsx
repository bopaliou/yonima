import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, {
    Extrapolation,
    FadeInUp,
    interpolate,
    SharedValue,
    useAnimatedStyle
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProps {
    item: {
        image: ImageSourcePropType;
        title: string;
        subtitle: string;
    };
    index: number;
    scrollX: SharedValue<number>;
}

export function OnboardingSlide({ item, index, scrollX }: OnboardingSlideProps) {
    const { image, title, subtitle } = item;

    // Parallax effect on image
    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [-width * 0.3, 0, width * 0.3],
                        Extrapolation.CLAMP
                    ),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            {/* Illustration centered */}
            <View style={styles.imageContainer}>
                <Animated.View style={[styles.imageWrapper, imageAnimatedStyle]}>
                    <Image
                        source={image}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                    />
                </Animated.View>
            </View>

            {/* Text content below */}
            <View style={styles.textContainer}>
                <Animated.View entering={FadeInUp.delay(200).duration(500)}>
                    <ThemedText style={styles.title}>
                        {title}
                    </ThemedText>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(500)}>
                    <ThemedText style={styles.subtitle}>
                        {subtitle}
                    </ThemedText>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: BrandColors.white,
        paddingTop: 80, // Slightly higher visual center
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'flex-start', // Align context to top area
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    imageWrapper: {
        width: width * 0.85,
        height: height * 0.45, // Taller image for immersion
        borderRadius: 32,      // Super rounded (iOS modern style)
        overflow: 'hidden',
        shadowColor: BrandColors.navyBlue, // Colored shadow
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.12,   // Softer but deeper
        shadowRadius: 24,
        elevation: 12,
        backgroundColor: '#F5F7FA', // Subtle placeholder bg
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        paddingHorizontal: 32,
        paddingBottom: 180,
        alignItems: 'center',
        paddingTop: 48,
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 30, // Larger
        color: BrandColors.navyBlue, // Brand color instead of black
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 36,
        letterSpacing: -0.5, // Tighter tracking for modern feel
    },
    subtitle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: '#526975', // Sophisticated grey
        textAlign: 'center',
        lineHeight: 26, // Airy reading
        paddingHorizontal: 10,
    },
});
