import { View, StyleSheet, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/button";
import Entypo from '@expo/vector-icons/Entypo';
import { useThemeStore } from "@/store/useThemeStore";
import Toast from "@/components/ui/toasts";

export default function Home() {
	const { theme, themes, toggleTheme } = useThemeStore();
	return (
		<SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: themes.background }]}>
			<View style={styles.main}>
				<View style={[styles.containerSwitch, { borderColor: themes.border.light }]}>
					<View style={styles.containerText}>
						<Entypo name="light-down" size={24} color={themes.typography["body-small"]} />
						<Text style={[{ color: themes.typography["body-small"]}]}>Change the theme</Text>
					</View>
					<Switch
						onValueChange={toggleTheme}
						value={theme === 'dark'}
					/>
				</View>
				<View style={styles.body}>
					<Button>
						<Text style={[styles.buttonCardText, { color: themes.typography.button }]}>Render toast</Text>
					</Button>
					<Toast
						defaults={{
							message: 'Saved to Database',
						}}
					/>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		gap: 16,
		justifyContent: "flex-start",
		alignItems: "center",
		padding: 16,
	},
	containerSwitch: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 16,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		padding: 16,
	},
	containerText: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	main: {
		flexDirection: "column",
		gap: 20,
	},
	body: {
		flex: 1,
		flexDirection: "column",
		gap: 16,
	},
	buttonCardText: {
		fontSize: 16,
		textAlign: "center",
		fontWeight: "600",
	},
})