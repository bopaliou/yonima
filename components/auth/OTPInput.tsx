import { BrandColors } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
    const [code, setCode] = useState<string[]>(new Array(length).fill(''));
    const inputs = useRef<TextInput[]>([]);

    const focusInput = (index: number) => {
        inputs.current[index]?.focus();
    };

    const handleChange = (text: string, index: number) => {
        const newCode = [...code];

        // Handle paste event (if text length > 1)
        if (text.length > 1) {
            const pastedCode = text.slice(0, length).split('');
            for (let i = 0; i < length; i++) {
                newCode[i] = pastedCode[i] || '';
            }
            setCode(newCode);
            if (newCode.every(digit => digit !== '')) {
                onComplete(newCode.join(''));
                inputs.current[length - 1]?.blur();
            } else {
                // Focus first empty
                const firstEmpty = newCode.findIndex(d => d === '');
                if (firstEmpty !== -1) focusInput(firstEmpty);
            }
            return;
        }

        // Handle single character
        newCode[index] = text;
        setCode(newCode);

        // Move to next input if value is entered
        if (text && index < length - 1) {
            focusInput(index + 1);
        }

        // Trigger onComplete if full code is entered
        if (newCode.every(digit => digit !== '')) {
            onComplete(newCode.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (!code[index] && index > 0) {
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                focusInput(index - 1);
            }
        }
    };

    // Auto-focus first input on mount
    useEffect(() => {
        setTimeout(() => focusInput(0), 100);
    }, []);

    return (
        <View style={styles.container}>
            {code.map((digit, index) => (
                <View
                    key={index}
                    style={[
                        styles.cellBox,
                        digit ? styles.cellFilled : null,
                    ]}
                >
                    <TextInput
                        ref={(ref) => {
                            if (ref) inputs.current[index] = ref;
                        }}
                        style={styles.cellText}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={6} // Allow paste up to 6 chars, logic handles split
                        selectTextOnFocus
                        selectionColor={BrandColors.orange}
                        cursorColor={BrandColors.orange}
                    />
                    {/* Bottom Line Indicator */}
                    <View style={[
                        styles.underline,
                        digit ? { backgroundColor: BrandColors.navyBlue } : null
                    ]} />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    cellBox: {
        width: 48,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA', // Light bg
        borderRadius: 8,
    },
    cellFilled: {
        backgroundColor: '#FFF8E1', // Light Orange-ish bg
        borderWidth: 1.5,
        borderColor: BrandColors.orange,
    },
    cellText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: BrandColors.navyBlue,
        textAlign: 'center',
        width: '100%',
        height: '100%',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        backgroundColor: 'transparent',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
});
