import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    error?: boolean;
}

export function PhoneInput({ value, onChangeText, error }: PhoneInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    // Filter non-numeric characters
    const handleTextChange = (text: string) => {
        const numeric = text.replace(/[^0-9]/g, '');
        onChangeText(numeric);
    };

    return (
        <View style={[
            styles.container,
            isFocused && styles.containerFocused,
            error && styles.containerError
        ]}>
            {/* Country Code Block */}
            <View style={styles.countryContainer}>
                <ThemedText style={styles.flag}>🇸🇳</ThemedText>
                <ThemedText style={styles.code}>+221</ThemedText>
                <View style={styles.divider} />
            </View>

            {/* Input Field */}
            <TextInput
                style={[styles.input, { flex: 1, color: BrandColors.navyBlue }]}
                value={value}
                onChangeText={handleTextChange}
                placeholder="77 000 00 00"
                placeholderTextColor="#A0A0A0"
                keyboardType="number-pad"
                maxLength={9} // 9 digits for Senegal
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={BrandColors.orange}
                cursorColor={BrandColors.orange}
            />

            {/* Validation Icon (if needed later) */}
            {value.length === 9 && !error && (
                <Ionicons name="checkmark-circle" size={20} color={BrandColors.navyBlue} />
            )}
            {error && (
                <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA', // Light grey background
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: 'transparent',
        height: 60, // Slightly taller input
    },
    containerFocused: {
        borderColor: BrandColors.navyBlue,
        backgroundColor: '#FFF',
    },
    containerError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF0F0',
    },
    countryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    flag: {
        fontSize: 24, // Larger flag
        marginRight: 8,
    },
    code: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: BrandColors.navyBlue,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E0E0E0',
        marginLeft: 12,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: BrandColors.navyBlue, // Ensure color is set here too
        height: '100%',
        paddingVertical: 0, // CRITICAL: Removes Android default padding
        textAlignVertical: 'center', // Centers text vertically on Android
    },
});
