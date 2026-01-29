import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const ONBOARDING_KEY = 'yonima_has_seen_onboarding';

export function useOnboardingStatus() {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const value = await AsyncStorage.getItem(ONBOARDING_KEY);
            if (value === null) {
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        } catch (e) {
            console.error('Error checking onboarding status:', e);
            // Default to false in case of error to avoid stuck on onboarding
            setIsFirstLaunch(false);
        } finally {
            setIsLoading(false);
        }
    };

    const setOnboardingCompleted = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            setIsFirstLaunch(false);
        } catch (e) {
            console.error('Error setting onboarding status:', e);
        }
    };

    const resetOnboarding = async () => {
        try {
            await AsyncStorage.removeItem(ONBOARDING_KEY);
            setIsFirstLaunch(true);
        } catch (e) {
            console.error('Error resetting onboarding:', e);
        }
    }

    return { isFirstLaunch, isLoading, setOnboardingCompleted, resetOnboarding };
}
