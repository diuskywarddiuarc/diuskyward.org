import { triggerClickHaptic, triggerSuccessHaptic, triggerErrorHaptic } from './haptics';
import { playClickSound, playHoverSound, playSuccessSound, playErrorSound } from './interaction-sounds';

export function useInteractionFeedback() {
    const triggerClick = (enableSound = true, enableHaptic = true) => {
        if (enableHaptic) triggerClickHaptic();
        if (enableSound) playClickSound();
    };

    const triggerHover = (enableSound = true, enableHaptic = false) => {
        if (enableHaptic) triggerClickHaptic();
        if (enableSound) playHoverSound();
    };

    const triggerSuccess = (enableSound = true, enableHaptic = true) => {
        if (enableHaptic) triggerSuccessHaptic();
        if (enableSound) playSuccessSound();
    };

    const triggerError = (enableSound = true, enableHaptic = true) => {
        if (enableHaptic) triggerErrorHaptic();
        if (enableSound) playErrorSound();
    };

    return {
        triggerClick,
        triggerHover,
        triggerSuccess,
        triggerError
    };
}
