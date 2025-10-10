import { View, StyleSheet, Text, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/button";
import Entypo from '@expo/vector-icons/Entypo';
import { colors } from "@/constants/colors";
import { useThemeStore } from "@/store/useThemeStore";
import { useToastStore } from "@/store/useToastStore";

export default function Home() {
	const { theme, themes, toggleTheme } = useThemeStore();
	const { addToast } = useToastStore();

	const handleSuccessToast = () => {
		addToast({
			message: 'Success',
			type: 'success',
		})
	}

	const handleWarningToast = () => {
		addToast({
			message: 'Warning',
			type: 'warning',
		})
	}

	const handleErrorToast = () => {
		addToast({
			message: 'Error',
			type: 'error',
		})
	}

	const handleLoadingToast = () => {
		addToast({
			message: 'Promise',
			type: 'loading',
		})
	}

	const handleInfoToast = () => {
		addToast({
			message: 'Info',
			type: 'info',
		})
	}
	return (
		<SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: themes.background }]}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: themes.typography.h1}]}>Glowty</Text>
				<Text style={[styles.subtitle, { color: themes.typography.caption}]}>Beautiful, gesture-friendly toast library for React Native with Expo — built with haptics, keyboard-safe layouts, promise handling, and full UI customization.</Text>
				<Text style={[styles.author, { color: themes.typography["body-small"]}]}>
					Made with ❤️ by{' '}
					<Text style={styles.bold}>
						Sebastian Marat Urdanegui Bisalaya
					</Text>
				</Text>
			</View>
			<View style={styles.body}>
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
				<View style={styles.buttons}>
					<ScrollView
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.buttonCard}>
							<Button onPress={handleSuccessToast} type="success">
								<Text style={[styles.buttonCardText, { color: colors.white}]}>Render toast</Text>
							</Button>
						</View>
						<View style={styles.buttonCard}>
							<Text style={[styles.buttonCardDescription, { color: themes.typography["body-large"], borderColor: themes.border.light}]}>Warning</Text>
							<Button onPress={handleWarningToast} type="warning">
								<Text style={[styles.buttonCardText, { color: colors.white}]}>Render toast</Text>
							</Button>
						</View>
						<View style={styles.buttonCard}>
							<Text style={[styles.buttonCardDescription, { color: themes.typography["body-large"], borderColor: themes.border.light}]}>Error</Text>
							<Button onPress={handleErrorToast} type="error">
								<Text style={[styles.buttonCardText, { color: colors.white}]}>Render toast</Text>
							</Button>
						</View>
						<View style={styles.buttonCard}>
							<Text style={[styles.buttonCardDescription, { color: themes.typography["body-large"], borderColor: themes.border.light}]}>Info</Text>
							<Button onPress={handleInfoToast} type="info">
								<Text style={[styles.buttonCardText, { color: colors.white}]}>Render toast</Text>
							</Button>
						</View>
						<View style={styles.buttonCard}>
							<Text style={[styles.buttonCardDescription, { color: themes.typography["body-large"], borderColor: themes.border.light}]}>Loading</Text>
							<Button onPress={handleLoadingToast} type="loading">
								<Text style={[styles.buttonCardText, { color: colors.white}]}>Render toast</Text>
							</Button>
						</View>
					</ScrollView>
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
	header: {
		flexDirection: "column",
		gap: 24,
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		textAlign: "center",
	},
	subtitle: {
		textAlign: "center",
		maxWidth: "90%",
	},
	author: {
		textAlign: "center",
		fontSize: 12,
	},
	bold: {
		fontWeight: "600",
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
	body: {
		flex: 1,
	},
	buttons: {
		flex: 1,
	},
	buttonCard: {
		flexDirection: "column",
		gap: 16,
		padding: 16,
	},
	buttonCardDescription: {
		paddingBottom: 10,
		borderBottomWidth: 1,
		fontSize: 14,
		fontWeight: "600",
	},
	buttonCardText: {
		fontSize: 16,
		textAlign: "center",
	},
})