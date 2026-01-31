// src/screens/TasbihScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootState } from '../store';
import { increment, reset, setTarget } from '../store/slices/tasbihSlice';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, typography } from '../theme';

const { width } = Dimensions.get('window');
const COUNTER_SIZE = width * 0.6; // 60% of screen width

// Define the history item type
interface HistoryItem {
  date: string;
  count: number;
}

const TasbihScreen = () => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const { count, target, history } = useSelector((state: RootState) => state.tasbih);
  const language = useSelector((state: RootState) => state.settings.language);

  // Haptic feedback options
  const hapticOptions = {
    enableVibrateFallback: false, // Don't use deprecated Vibration API
    ignoreAndroidSystemSettings: false,
  };

  const handleIncrement = () => {
    // Use haptic feedback (works on both iOS and Android without permissions)
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    dispatch(increment());
  };

  const handleReset = () => {
    // Stronger haptic feedback for reset
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    dispatch(reset());
  };

  const handleTargetChange = (newTarget: number) => {
    dispatch(setTarget(newTarget));
  };

  const getProgressPercentage = () => {
    return Math.min((count / target) * 100, 100);
  };

  const getText = (key: string) => {
    const translations: any = {
      title: {
        en: 'Digital Tasbih',
        ur: 'ڈیجیٹل تسبیح',
        ar: 'التسبيح الرقمي',
      },
      count: {
        en: 'Count',
        ur: 'گنتی',
        ar: 'العدد',
      },
      target: {
        en: 'Target',
        ur: 'ہدف',
        ar: 'الهدف',
      },
      reset: {
        en: 'Reset',
        ur: 'دوبارہ شروع',
        ar: 'إعادة تعيين',
      },
      tapToCount: {
        en: 'Tap to Count',
        ur: 'گننے کے لیے تھپتھپائیں',
        ar: 'انقر للعد',
      },
      completed: {
        en: 'Target Completed!',
        ur: 'ہدف مکمل!',
        ar: 'الهدف اكتمل!',
      },
      history: {
        en: 'Recent History',
        ur: 'حالیہ سرگزشت',
        ar: 'التاريخ الأخير',
      },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const isCompleted = count >= target;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.default }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Progress Ring */}
      <View style={styles.counterSection}>
        <View
          style={[
            styles.progressRing,
            {
              width: COUNTER_SIZE,
              height: COUNTER_SIZE,
              borderColor: colors.background.subtle,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: COUNTER_SIZE - 20,
                height: COUNTER_SIZE - 20,
                backgroundColor: isCompleted
                  ? colors.accent.success
                  : colors.primary.main,
                opacity: getProgressPercentage() / 100,
              },
            ]}
          />

          {/* Counter Display */}
          <View style={styles.counterDisplay}>
            <Text
              style={[
                styles.counterText,
                { color: colors.text.primary, fontSize: COUNTER_SIZE * 0.25 },
              ]}
            >
              {count}
            </Text>
            <Text style={[styles.targetText, { color: colors.text.secondary }]}>
              / {target}
            </Text>
          </View>
        </View>

        {/* Tap to Count Hint */}
        <TouchableOpacity
          style={[styles.tapButton, { backgroundColor: colors.primary.light }]}
          onPress={handleIncrement}
          activeOpacity={0.7}
        >
          <Icon name="hand-pointing-up" size={32} color="#fff" />
          <Text style={styles.tapButtonText}>{getText('tapToCount')}</Text>
        </TouchableOpacity>

        {isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: colors.accent.success }]}>
            <Icon name="check-circle" size={24} color="#fff" />
            <Text style={styles.completedText}>{getText('completed')}</Text>
          </View>
        )}
      </View>

      {/* Target Selection */}
      <View style={[styles.targetSection, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {getText('target')}
        </Text>
        <View style={styles.targetButtons}>
          {[11, 33, 99, 100, 500, 1000].map((targetValue) => (
            <TouchableOpacity
              key={targetValue}
              style={[
                styles.targetButton,
                {
                  backgroundColor:
                    target === targetValue ? colors.primary.main : colors.background.subtle,
                  borderColor: colors.primary.light,
                },
              ]}
              onPress={() => handleTargetChange(targetValue)}
            >
              <Text
                style={[
                  styles.targetButtonText,
                  {
                    color:
                      target === targetValue ? '#fff' : colors.text.primary,
                  },
                ]}
              >
                {targetValue}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.accent.error }]}
        onPress={handleReset}
      >
        <Icon name="refresh" size={24} color="#fff" />
        <Text style={styles.resetButtonText}>{getText('reset')}</Text>
      </TouchableOpacity>

      {/* History Section */}
      {history.length > 0 && (
        <View style={[styles.historySection, { backgroundColor: colors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {getText('history')}
          </Text>
          {history.slice(0, 5).map((item: HistoryItem, index: number) => (
            <View
              key={index}
              style={[styles.historyItem, { borderBottomColor: colors.background.subtle }]}
            >
              <Text style={[styles.historyDate, { color: colors.text.secondary }]}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text style={[styles.historyCount, { color: colors.text.primary }]}>
                {item.count}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  counterSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  progressRing: {
    borderRadius: 1000,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressFill: {
    position: 'absolute',
    borderRadius: 1000,
  },
  counterDisplay: {
    alignItems: 'center',
  },
  counterText: {
    fontWeight: 'bold',
  },
  targetText: {
    fontSize: typography.sizes.lg,
    marginTop: spacing.xs,
  },
  tapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 30,
    gap: spacing.sm,
  },
  tapButtonText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  completedText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  targetSection: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  targetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  targetButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
  },
  targetButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 25,
    gap: spacing.sm,
    width: '100%',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  historySection: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  historyDate: {
    fontSize: typography.sizes.sm,
  },
  historyCount: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});

export default TasbihScreen;