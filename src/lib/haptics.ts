// Haptic Feedback Utility
// Works on devices that support the Vibration API

export function triggerHaptic(pattern: 'light' | 'medium' | 'heavy' = 'medium') {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) {
        return;
    }

    switch (pattern) {
        case 'light':
            navigator.vibrate(10);
            break;
        case 'medium':
            navigator.vibrate(20);
            break;
        case 'heavy':
            navigator.vibrate([20, 10, 20]);
            break;
    }
}

export function triggerClickHaptic() {
    triggerHaptic('light');
}

export function triggerSuccessHaptic() {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) {
        return;
    }
    // Double tap pattern
    navigator.vibrate([15, 10, 15]);
}

export function triggerErrorHaptic() {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) {
        return;
    }
    // Three quick taps
    navigator.vibrate([10, 5, 10, 5, 10]);
}
