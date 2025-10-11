import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/useThemeStore';

export default function Layout() {
	const { theme } = useThemeStore();
	return (
		<>
			<StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
			<Stack>
				<Stack.Screen name='index' options={{ headerShown: false, title: 'Home' }} />
			</Stack>
		</>
	)
}