// countdown.util.ts
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
export const calculateCountdown = (endAt: string | undefined, status: string): Countdown => {
  if (!endAt || status === 'inactive' || status === 'ended') {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const endDate = new Date(endAt).getTime();
  const now = Date.now();
  const distance = endDate - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
};