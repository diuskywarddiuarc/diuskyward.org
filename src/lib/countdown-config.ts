// Target date for all countdowns across the site
// Format: ISO 8601 - represents a universal point in time
export const COUNTDOWN_TARGET_DATE = "2027-06-15T00:00:00Z";

// Universal countdown calculator - works same for all users
export function getTimeUntilTarget() {
    const target = new Date(COUNTDOWN_TARGET_DATE).getTime();
    const now = Date.now(); // Current time in milliseconds
    const distance = target - now;

    if (distance < 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isComplete: true
        };
    }

    return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
        isComplete: false
    };
}
