import React, { useEffect } from 'react';
import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Ocultar la pantalla de carga una vez montado el layout raíz
    SplashScreen.hideAsync().catch(() => {
      // Ignorar errores en caso de que ya se haya ocultado
    });
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0E17' },
        }}>
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}
