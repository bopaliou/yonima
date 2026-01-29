import { OTPInput } from '@/components/auth/OTPInput';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

type AuthStep = 'PHONE' | 'OTP';

export default function LoginScreen() {
    const router = useRouter();
    const [step, setStep] = useState<AuthStep>('PHONE');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(59);
    const [error, setError] = useState(false);

    // Timer logic for OTP
    useEffect(() => {
        let interval: any;
        if (step === 'OTP' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendCode = () => {
        // Validation for Senegal number (9 digits, starts with 7)
        // Accepted prefixes: 70, 71, 75, 76, 77, 78 + 7 digits
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        const isValid = /^(70|71|75|76|77|78)[0-9]{7}$/.test(cleanNumber);

        if (!isValid) {
            setError(true);
            // Optional: Haptic feedback here
            return;
        }

        setError(false);
        setLoading(true);
        Keyboard.dismiss();

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep('OTP');
            setTimer(59);
        }, 1500);
    };

    const handleVerifyCode = (code: string) => {
        setLoading(true);
        // Simulate Verify API
        setTimeout(() => {
            setLoading(false);
            // Success! Redirect to home
            router.replace('/(tabs)');
        }, 1500);
    };

    const handleBack = () => {
        if (step === 'OTP') {
            setStep('PHONE');
            setError(false);
        } else {
            router.back();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>

                        {/* Header: Logo */}
                        <View style={styles.header}>
                            {/* Back Button */}
                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={24} color={BrandColors.navyBlue} />
                            </TouchableOpacity>

                            <Image
                                source={require('@/assets/images/logo-transparent.png')}
                                style={styles.logo}
                                contentFit="contain"
                            />
                        </View>

                        {/* Main Body */}
                        <View style={styles.formContainer}>

                            {/* Dynamic Titles */}
                            <Animated.View entering={FadeIn.duration(500)} key={step}>
                                <ThemedText style={styles.title}>
                                    {step === 'PHONE' ? 'Bienvenue chez YONIMA' : 'Vérification'}
                                </ThemedText>
                                <ThemedText style={styles.subtitle}>
                                    {step === 'PHONE'
                                        ? 'Entrez votre numéro de téléphone pour continuer.'
                                        : `Saisissez le code à 6 chiffres envoyé au +221 ${phoneNumber}`
                                    }
                                </ThemedText>
                            </Animated.View>

                            {/* Form Inputs with Transition */}
                            <View style={styles.inputArea}>
                                {step === 'PHONE' ? (
                                    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
                                        <PhoneInput
                                            value={phoneNumber}
                                            onChangeText={(t) => {
                                                setPhoneNumber(t);
                                                setError(false);
                                            }}
                                            error={error}
                                        />
                                        {error && (
                                            <ThemedText style={styles.errorText}>
                                                Numéro invalide. Veuillez vérifier le format (ex: 77...).
                                            </ThemedText>
                                        )}

                                        {/* Action Button */}
                                        <TouchableOpacity
                                            style={styles.ctaButton}
                                            onPress={handleSendCode}
                                            disabled={loading}
                                            activeOpacity={0.8}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#FFF" />
                                            ) : (
                                                <ThemedText style={styles.ctaText}>Recevoir le code</ThemedText>
                                            )}
                                        </TouchableOpacity>
                                    </Animated.View>
                                ) : (
                                    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
                                        <OTPInput
                                            length={6}
                                            onComplete={handleVerifyCode}
                                        />

                                        {loading && (
                                            <View style={{ marginTop: 20, alignItems: 'center' }}>
                                                <ActivityIndicator color={BrandColors.orange} size="large" />
                                                <ThemedText style={{ marginTop: 10, color: '#888' }}>Vérification...</ThemedText>
                                            </View>
                                        )}

                                        {/* Resend Timer */}
                                        {!loading && (
                                            <TouchableOpacity
                                                style={styles.resendContainer}
                                                disabled={timer > 0}
                                            >
                                                <ThemedText style={styles.resendText}>
                                                    {timer > 0
                                                        ? `Renvoyer le code dans (${timer < 10 ? `0${timer}` : timer})`
                                                        : 'Renvoyer le code'
                                                    }
                                                </ThemedText>
                                            </TouchableOpacity>
                                        )}
                                    </Animated.View>
                                )}
                            </View>

                        </View>

                        {/* Legal Footer */}
                        <View style={styles.footer}>
                            <ThemedText style={styles.legalText}>
                                En continuant, vous acceptez nos conditions d'utilisation. Vos données sont sécurisées par cryptage de bout en bout.
                            </ThemedText>
                        </View>

                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        marginBottom: 40,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 8,
    },
    logo: {
        width: 100,
        height: 35,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 20,
    },
    title: {
        fontFamily: 'Inter_800ExtraBold', // Extra Bold requested
        fontSize: 28,
        color: BrandColors.navyBlue,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        color: '#526975',
        marginBottom: 32,
        lineHeight: 22,
    },
    inputArea: {
        minHeight: 200,
    },
    ctaButton: {
        backgroundColor: BrandColors.orange,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: BrandColors.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    ctaText: {
        fontFamily: 'Inter_700Bold',
        color: '#FFFFFF',
        fontSize: 16,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 13,
        marginTop: 8,
        fontFamily: 'Inter_500Medium',
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        color: BrandColors.navyBlue,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    legalText: {
        fontSize: 11,
        color: '#A0A0A0',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 20,
    },
});
