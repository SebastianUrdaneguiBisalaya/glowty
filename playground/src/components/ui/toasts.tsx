import React from "react";
import { View, StyleSheet, Text, Pressable, TextStyle, StyleProp, ViewStyle } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

type TypeToast = 'success' | 'error' | 'info' | 'warning' | 'loading';

type ThemeType = 'light' | 'dark';

type PositionToast = 'top' | 'bottom' | 'center';

type UIToast = 'essential' | 'interactive' | 'contextual' | 'rich' | 'full-bleed';

type IconFamily = 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'FontAwesome6' | 'Fontisto' | 'Foundation' | 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'Octicons' | 'SimpleLineIcons' | 'Zocial';

interface IconProps {
	familyName: IconFamily;
	name: string;
	size?: number;
	color?: string;
	style?: StyleProp<TextStyle>;
}

interface DefaultToastProps {
	id: string;
	title?: string;
	message: string;
	type?: TypeToast;
	duration?: number;
	persistent?: boolean;
	position?: PositionToast;
	theme?: ThemeType;
	ui?: UIToast;
	contentOnPressToAction?: string;
	contentOnPressToActionStyle?: StyleProp<TextStyle>;
	containerOnPressToAction?: StyleProp<ViewStyle>;
	containerCustomOnPressToAction?: React.ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
	containerTextStyle?: StyleProp<ViewStyle>;
	titleTextStyle?: StyleProp<TextStyle>;
	messageTextStyle?: StyleProp<TextStyle>;
	icon?: IconProps;
	iconCustom?: React.ReactNode;
	iconClose?: IconProps;
	iconCloseCustom?: React.ReactNode;
	width?: number;
	height?: number;
	onPressToAction?: () => void;
}

interface CustomDefaultToastProps {
	customToast?: React.ComponentType<{ toast: Partial<DefaultToastProps> }>;
}

interface ToastProps {
	defaults: Partial<DefaultToastProps>;
	custom?: Partial<CustomDefaultToastProps>;
}

interface RenderIconProps {
	icon?: IconProps;
	iconCustom?: React.ReactNode;
}

const getIconFamily = (familyName: IconFamily) => {
	switch (familyName) {
		case 'AntDesign':
			return require('@expo/vector-icons/AntDesign').default;
		case 'Entypo':
			return require('@expo/vector-icons/Entypo').default;
		case 'EvilIcons':
			return require('@expo/vector-icons/EvilIcons').default;
		case 'Feather':
			return require('@expo/vector-icons/Feather').default;
		case 'FontAwesome':
			return require('@expo/vector-icons/FontAwesome').default;
		case 'FontAwesome5':
			return require('@expo/vector-icons/FontAwesome5').default;
		case 'FontAwesome6':
			return require('@expo/vector-icons/FontAwesome6').default;
		case 'Fontisto':
			return require('@expo/vector-icons/Fontisto').default;
		case 'Foundation':
			return require('@expo/vector-icons/Foundation').default;
		case 'Ionicons':
			return require('@expo/vector-icons/Ionicons').default;
		case 'MaterialCommunityIcons':
			return require('@expo/vector-icons/MaterialCommunityIcons').default;
		case 'MaterialIcons':
			return require('@expo/vector-icons/MaterialIcons').default;
		case 'Octicons':
			return require('@expo/vector-icons/Octicons').default;
		case 'SimpleLineIcons':
			return require('@expo/vector-icons/SimpleLineIcons').default;
		case 'Zocial':
			return require('@expo/vector-icons/Zocial').default;
		default:
			return require('@expo/vector-icons/AntDesign').default;
	}
}

const renderIcon = ({ icon, iconCustom }: RenderIconProps) => {
	if (React.isValidElement(iconCustom)) {
		return iconCustom;
	}
	if (icon?.familyName) {
		const Icon = getIconFamily(icon.familyName);
		return (
			<Icon
				name={icon.name}
				size={icon.size}
				color={icon.color}
				style={icon.style}
			/>
		)
	} else {
		return null;
	}
}

const EssentialToast: React.FC<ToastProps> = (props) => {
	const { themes } = useThemeStore();
	const containerStyle = StyleSheet.flatten([
		styles.container,
		{
			backgroundColor: themes.toast.background,
		},
		props.defaults.containerStyle,
	]);
	const containerTextStyle = StyleSheet.flatten([
		styles.containerText,
		props.defaults.containerTextStyle,
	]);
	const titleTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.titleTextStyle,
	]);
	const messageTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.messageTextStyle,
	]);
	return (
		<View style={containerStyle}>
			{ renderIcon({ icon: props.defaults.icon, iconCustom: props.defaults.iconCustom }) }
			<View style={containerTextStyle}>
				{ props.defaults.title && <Text style={titleTextStyle}>{props.defaults.title}</Text> }
				<Text style={messageTextStyle}>{props.defaults.message}</Text>
			</View>
		</View>
	)
}

const InteractiveToast: React.FC<ToastProps> = (props) => {
	const { themes } = useThemeStore();
	const containerStyle = StyleSheet.flatten([
		styles.container,
		{
			backgroundColor: themes.toast.background,
		},
		props.defaults.containerStyle,
	]);
	const containerTextStyle = StyleSheet.flatten([
		styles.containerText,
		props.defaults.containerTextStyle,
	]);
	const titleTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.titleTextStyle,
	]);
	const messageTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.messageTextStyle,
	]);
	const containerOnPressToActionStyle = StyleSheet.flatten([
		styles.containerOnPressToAction,
		props.defaults.containerOnPressToAction,
	]);
	const contentOnPressToActionStyle = StyleSheet.flatten([
		styles.textAction,
		{
			color: themes.toast.color,
		},
		props.defaults.contentOnPressToActionStyle,
	]);
	
	return (
		<View style={containerStyle}>
			{ renderIcon({ icon: props.defaults.icon, iconCustom: props.defaults.iconCustom }) }
			<View style={containerTextStyle}>
				{ props.defaults.title && <Text style={titleTextStyle}>{props.defaults.title}</Text> }
				<Text style={messageTextStyle}>{props.defaults.message}</Text>
			</View>
			<Pressable style={containerOnPressToActionStyle} onPress={() => {}}>
				<Text style={contentOnPressToActionStyle}>{props.defaults.contentOnPressToAction}</Text>
			</Pressable>
		</View>
	)
}

const ContextualToast: React.FC<ToastProps> = (props) => {
	const { themes } = useThemeStore();
	const containerStyle = StyleSheet.flatten([
		styles.container,
		{
			backgroundColor: themes.toast.background,
		},
		props.defaults.containerStyle,
	]);
	const containerTextStyle = StyleSheet.flatten([
		styles.containerText,
		props.defaults.containerTextStyle,
	]);
	const titleTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.titleTextStyle,
	]);
	const messageTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.messageTextStyle,
	]);
	
	return (
		<View style={containerStyle}>
			{ renderIcon({ icon: props.defaults.icon, iconCustom: props.defaults.iconCustom }) }
			<View style={containerTextStyle}>
				{ props.defaults.title && <Text style={titleTextStyle}>{props.defaults.title}</Text> }
				<Text style={messageTextStyle}>{props.defaults.message}</Text>
			</View>
		</View>
	)
}

const RichToast: React.FC<ToastProps> = (props) => {
	const { themes } = useThemeStore();
	const containerStyle = StyleSheet.flatten([
		styles.container,
		{
			backgroundColor: themes.toast.background,
		},
		props.defaults.containerStyle,
	]);
	const containerTextStyle = StyleSheet.flatten([
		styles.containerText,
		props.defaults.containerTextStyle,
	]);
	const titleTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.titleTextStyle,
	]);
	const messageTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.messageTextStyle,
	]);
	const containerOnPressToActionStyle = StyleSheet.flatten([
		styles.containerOnPressToAction,
		props.defaults.containerOnPressToAction,
	]);
	const contentOnPressToActionStyle = StyleSheet.flatten([
		styles.textAction,
		{
			color: themes.toast.color,
		},
		props.defaults.contentOnPressToActionStyle,
	]);
	
	return (
		<View style={containerStyle}>
			{ renderIcon({ icon: props.defaults.icon, iconCustom: props.defaults.iconCustom }) }
			<View style={containerTextStyle}>
				{ props.defaults.title && <Text style={titleTextStyle}>{props.defaults.title}</Text> }
				<Text style={messageTextStyle}>{props.defaults.message}</Text>
			</View>
			<Pressable style={containerOnPressToActionStyle} onPress={() => {}}>
				<Text style={contentOnPressToActionStyle}>{props.defaults.contentOnPressToAction}</Text>
			</Pressable>
		</View>
	)
}

const FullBleedToast: React.FC<ToastProps> = (props) => {
	const { themes } = useThemeStore();
	const containerStyle = StyleSheet.flatten([
		styles.container,
		{
			backgroundColor: themes.toast.background,
		},
		props.defaults.containerStyle,
	]);
	const containerTextStyle = StyleSheet.flatten([
		styles.containerText,
		props.defaults.containerTextStyle,
	]);
	const titleTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.titleTextStyle,
	]);
	const messageTextStyle = StyleSheet.flatten([
		styles.text,
		{
			color: themes.toast.color,
		},
		props.defaults.messageTextStyle,
	]);
	
	return (
		<View style={containerStyle}>
			{ renderIcon({ icon: props.defaults.icon, iconCustom: props.defaults.iconCustom }) }
			<View style={containerTextStyle}>
				{ props.defaults.title && <Text style={titleTextStyle}>{props.defaults.title}</Text> }
				<Text style={messageTextStyle}>{props.defaults.message}</Text>
			</View>
		</View>
	)
}

const Toast: React.FC<ToastProps> = (props) => {
	if (props?.custom?.customToast) {
		return <props.custom.customToast toast={props.defaults} />
	}
	switch (props.defaults.ui) {
		case 'essential':
			return <EssentialToast {...props} />
		case 'interactive':
			return <InteractiveToast {...props} />
		case 'contextual':
			return <ContextualToast {...props} />
		case 'rich':
			return <RichToast {...props} />
		case 'full-bleed':
			return <FullBleedToast {...props} />
		default:
			return <EssentialToast {...props} />
	}
}

export default Toast;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		padding: 16,
		borderRadius: 10,
	},
	text: {
		fontSize: 16,
	},
	textAction: {
		fontSize: 14,
		textDecorationLine: "underline",
	},
	containerText: {
		flexGrow: 1,
		flexDirection: "column",
		gap: 6,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	containerOnPressToAction: {

	}
})