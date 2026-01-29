import { BrandColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PaginationDotsProps {
    data: any[];
    scrollX: SharedValue<number>;
}

export function PaginationDots({ data, scrollX }: PaginationDotsProps) {
    return (
        <View style={styles.container}>
            {data.map((_, index) => {
                return <Dot key={index} index={index} scrollX={scrollX} />;
            })}
        </View>
    );
}

interface DotProps {
    index: number;
    scrollX: SharedValue<number>;
}

function Dot({ index, scrollX }: DotProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const isActive = scrollX.value >= (index - 0.5) * width && scrollX.value < (index + 0.5) * width;

        // Active dot becomes a pill, inactive stays small circle
        const widthVal = withSpring(isActive ? 24 : 8, { damping: 15, stiffness: 120 });
        const backgroundColor = withTiming(isActive ? BrandColors.orange : '#E0E0E0', { duration: 200 });

        return {
            width: widthVal,
            backgroundColor,
        };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});
