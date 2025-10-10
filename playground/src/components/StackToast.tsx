import { useState, useRef, useEffect, useCallback } from "react";
import { 
	Animated,
	PanResponder,
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableWithoutFeedback,
} from "react-native";

interface Toast {
	id: string;
	message: string;
}

interface ToastStackProps {
	position?: "top" | "bottom" | "center";
	toasts: Toast[];
	onRemoveToast?: (id: string) => void;
}

export const StackToast: React.FC<ToastStackProps> = ({
	position = "bottom",
	toasts,
	onRemoveToast,
}) => {
	const [expanded, setExpanded] = useState<boolean>(false);
	const [toastHeights, setToastHeights] = useState<Map<string, number>>(new Map());
	const translateAnim = useRef(new Animated.Value(0)).current;

	const toggleExpand = useCallback(() => {
		if (toasts.length <= 1) return;
		
		const newExpandedState = !expanded;
		
		Animated.spring(translateAnim, {
			toValue: newExpandedState ? 1 : 0,
			useNativeDriver: true,
			damping: 20,
			stiffness: 300,
			mass: 0.8,
		}).start();

		setExpanded(newExpandedState);
	}, [expanded, toasts.length, translateAnim]);

	const handleToastLayout = useCallback((id: string, height: number) => {
		setToastHeights(prev => {
			const newMap = new Map(prev);
			newMap.set(id, height);
			return newMap;
		});
	}, []);

	const getAccumulatedOffset = useCallback((currentIndex: number): number => {
		let offset = 0;
		for (let i = 0; i < currentIndex; i++) {
			const toastId = toasts[i]?.id;
			const height = toastHeights.get(toastId) || 80;
			offset += height + 10;
		}
		return offset;
	}, [toasts, toastHeights]);

	useEffect(() => {
		if (toasts.length === 0 && expanded) {
			setExpanded(false);
			translateAnim.setValue(0);
		} else if (toasts.length === 1 && expanded) {
			setExpanded(false);
			Animated.spring(translateAnim, {
				toValue: 0,
				useNativeDriver: true,
				damping: 20,
				stiffness: 300,
			}).start();
		}
	}, [toasts.length, expanded, translateAnim]);

	return (
		<>
			{toasts.length > 0 && (
				<View
					style={[
						StyleSheet.absoluteFillObject,
						styles.container,
						position === "bottom" 
							? styles.bottom 
							: position === "top" 
							? styles.top 
							: styles.center
					]}
					pointerEvents="box-none"
				>
					{toasts.map((toast, index) => (
						<ToastItem
							key={toast.id}
							toast={toast}
							index={index}
							total={toasts.length}
							position={position}
							translateAnim={translateAnim}
							onRemove={onRemoveToast}
							isPaused={expanded}
							onToggleExpand={toggleExpand}
							onLayout={handleToastLayout}
							accumulatedOffset={getAccumulatedOffset(index)}
						/>
					))}
				</View>
			)}
		</>
	);
};

interface ToastItemProps {
	toast: Toast;
	index: number;
	total: number;
	position: "top" | "bottom" | "center";
	translateAnim: Animated.Value;
	onRemove?: (id: string) => void;
	isPaused: boolean;
	onToggleExpand: () => void;
	onLayout: (id: string, height: number) => void;
	accumulatedOffset: number;
}

const ToastItem: React.FC<ToastItemProps> = ({
	toast,
	index,
	total,
	position,
	translateAnim,
	onRemove,
	isPaused,
	onToggleExpand,
	onLayout,
	accumulatedOffset,
}) => {
	const opacity = useRef(new Animated.Value(0)).current;
	const swipeTranslate = useRef(new Animated.Value(0)).current;
	const removeTranslateY = useRef(new Animated.Value(0)).current;
	const stackPositionAnim = useRef(new Animated.Value(index)).current;
	
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const remainingTimeRef = useRef<number>(5000);
	const startTimeRef = useRef<number>(Date.now());

	const handleLayout = useCallback((event: any) => {
		const { height } = event.nativeEvent.layout;
		onLayout(toast.id, height);
	}, [toast.id, onLayout]);

	useEffect(() => {
		Animated.spring(stackPositionAnim, {
			toValue: index,
			useNativeDriver: true,
			damping: 15,
			stiffness: 150,
			mass: 0.8,
		}).start();
	}, [index, stackPositionAnim]);

	useEffect(() => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [opacity]);

	useEffect(() => {
		const startTimer = () => {
			startTimeRef.current = Date.now();
			timerRef.current = setTimeout(() => {
				handleRemove(false);
			}, remainingTimeRef.current);
		};

		const clearTimer = () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
				const elapsed = Date.now() - startTimeRef.current;
				remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
			}
		};

		if (isPaused) {
			clearTimer();
		} else {
			if (remainingTimeRef.current > 0) {
				startTimer();
			}
		}

		return () => {
			clearTimer();
		};
	}, [isPaused]);

	const handleRemove = useCallback((isSwiped: boolean, swipeDirection?: number) => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (isSwiped && swipeDirection !== undefined) {
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.timing(swipeTranslate, {
					toValue: swipeDirection > 0 ? 400 : -400,
					duration: 250,
					useNativeDriver: true,
				})
			]).start(() => {
				onRemove?.(toast.id);
			});
		} else {
			const exitDirection = position === "bottom" ? 100 : position === "top" ? -100 : 0;
			
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.timing(removeTranslateY, {
					toValue: exitDirection,
					duration: 250,
					useNativeDriver: true,
				})
			]).start(() => {
				onRemove?.(toast.id);
			});
		}
	}, [opacity, swipeTranslate, removeTranslateY, position, onRemove, toast.id]);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => false,
			onMoveShouldSetPanResponder: (_, gestureState) => {
				return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
			},
			onPanResponderGrant: () => {
			},
			onPanResponderMove: (_, gestureState) => {
				swipeTranslate.setValue(gestureState.dx);
			},
			onPanResponderRelease: (_, gestureState) => {
				if (Math.abs(gestureState.dx) > 120) {
					handleRemove(true, gestureState.dx);
				} else {
					Animated.spring(swipeTranslate, {
						toValue: 0,
						useNativeDriver: true,
						damping: 20,
						stiffness: 300,
					}).start();
				}
			},
			onPanResponderTerminationRequest: () => false,
		})
	).current;

	const getStackOffset = () => {
		const collapsedOffset = position === "bottom" ? -12 : 12;
		const expandedOffset = position === "bottom" ? -accumulatedOffset : accumulatedOffset;
		
		return { 
			collapsed: collapsedOffset, 
			expanded: expandedOffset 
		};
	};

	const stackOffset = getStackOffset();

	const stackTranslateY = translateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [
			stackOffset.collapsed * index,
			stackOffset.expanded
		]
	});

	const scale = translateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [1 - index * 0.05, 1]
	});

	const toastOpacity = translateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [index === 0 ? 1 : 0.7 - index * 0.1, 1]
	});

	return (
		<Animated.View
			{...panResponder.panHandlers}
			onLayout={handleLayout}
			style={[
				styles.toast,
				{
					opacity: Animated.multiply(opacity, toastOpacity),
					transform: [
						{ translateY: stackTranslateY },
						{ translateY: removeTranslateY },
						{ translateX: swipeTranslate },
						{ scale },
					],
					zIndex: total - index,
				}
			]}
		>
			<TouchableWithoutFeedback onPress={onToggleExpand}>
				<View style={styles.toastContent}>
					<Text style={styles.text}>{toast.message}</Text>					
					<Pressable 
						style={styles.button}
						onPress={(e) => {
							e.stopPropagation();
							console.log("Button pressed:", toast.id);
						}}
					>
						<Text style={styles.buttonText}>Action</Text>
					</Pressable>
				</View>
			</TouchableWithoutFeedback>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: "100%",
		height: "100%",
		alignItems: "center",
		flexDirection: "column",
	},
	top: {
		justifyContent: "flex-start",
		top: 60,
	},
	bottom: {
		justifyContent: "flex-end",
		bottom: 60,
	},
	center: {
		justifyContent: "center",
	},
	toast: {
		position: "absolute",
		width: "100%",
		borderRadius: 10,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 10,
	},
	toastContent: {
		padding: 16,
		alignItems: "center",
	},
	text: {
		fontSize: 14,
		color: "#000",
		marginBottom: 8,
	},
	button: {
		backgroundColor: "#007AFF",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
		marginTop: 8,
	},
	buttonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	}
});