import { useCallback, useRef, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const SOUND_ENABLED_KEY = 'admin_sound_notifications';

export function useOrderNotification() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem(SOUND_ENABLED_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem(SOUND_ENABLED_KEY, String(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      // Create or resume AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create a pleasant notification sound
      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Two-tone notification
      oscillator1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      oscillator1.frequency.setValueAtTime(1100, ctx.currentTime + 0.1); // C#6
      oscillator2.frequency.setValueAtTime(660, ctx.currentTime); // E5
      oscillator2.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5

      oscillator1.type = 'sine';
      oscillator2.type = 'sine';

      // Fade in and out
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

      oscillator1.start(ctx.currentTime);
      oscillator2.start(ctx.currentTime);
      oscillator1.stop(ctx.currentTime + 0.4);
      oscillator2.stop(ctx.currentTime + 0.4);

      console.log('🔔 Order notification sound played');
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [soundEnabled]);

  const notifyNewOrder = useCallback((customerName: string) => {
    playNotificationSound();
    
    // Show toast notification
    toast({
      title: "🔔 New Order!",
      description: `New order from ${customerName}`,
    });

    // Request browser notification permission and show if granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Order!', {
        body: `New order from ${customerName}`,
        icon: '/favicon.ico',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, [playNotificationSound]);

  return { notifyNewOrder, playNotificationSound, soundEnabled, toggleSound };
}
