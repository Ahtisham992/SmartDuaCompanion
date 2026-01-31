// src/components/dua/DuaShareCard.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { Dua } from '../../types/dua.types';
import { RootState } from '../../store';
import { useThemeColors } from '../../hooks/useThemeColors';
import { spacing, typography } from '../../theme';

interface DuaShareCardProps {
  dua: Dua;
}

const DuaShareCard: React.FC<DuaShareCardProps> = ({ dua }) => {
  const viewShotRef = useRef<ViewShot>(null);
  const colors = useThemeColors();
  const language = useSelector((state: RootState) => state.settings.language);

  const getTitle = () => {
    if (language === 'ur' && dua.titleUrdu) return dua.titleUrdu;
    if (language === 'ar' && dua.titleArabic) return dua.titleArabic;
    return dua.title;
  };

  const getTranslation = () => {
    if (language === 'ur' && dua.translationUrdu) return dua.translationUrdu;
    return dua.translation;
  };

  const handleShare = async () => {
    try {
      // Null check for viewShotRef.current
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        Alert.alert('Error', 'Unable to generate image. Please try again.');
        return;
      }

      // Capture the view as image
      const uri = await viewShotRef.current.capture();

      // Share options
      const shareOptions = {
        title: 'Share Dua',
        message: `${getTitle()}\n\n${dua.arabicText}\n\n${getTranslation()}`,
        url: Platform.OS === 'android' ? `file://${uri}` : uri,
        type: 'image/png',
        subject: 'Dua from Smart Dua Companion',
      };

      await Share.open(shareOptions);
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share. Please try again.');
        console.error('Share error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Hidden View for Screenshot */}
      <View style={styles.hiddenContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{
            format: 'png',
            quality: 1.0,
          }}
          style={styles.shareCard}
        >
          {/* Gradient Background Effect */}
          <View style={[styles.cardBackground, { backgroundColor: colors.primary.main }]}>
            {/* Top Decoration */}
            <View style={styles.topDecoration}>
              <View style={[styles.decorCircle, { backgroundColor: colors.secondary.main }]} />
              <View style={[styles.decorCircle, { backgroundColor: colors.secondary.light }]} />
            </View>

            {/* Logo */}
            <View style={styles.logoSection}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
              />
              <Text style={styles.appName}>Smart Dua Companion</Text>
            </View>

            {/* Content */}
            <View style={styles.contentSection}>
              {/* Category Badge */}
              <View style={[styles.categoryBadge, { backgroundColor: colors.secondary.main }]}>
                <Text style={styles.categoryText}>{dua.category}</Text>
              </View>

              {/* Title */}
              <Text style={styles.title} numberOfLines={2}>
                {getTitle()}
              </Text>

              {/* Arabic Text */}
              <View style={styles.arabicContainer}>
                <Text style={styles.arabicText}>{dua.arabicText}</Text>
              </View>

              {/* Transliteration */}
              <Text style={styles.transliteration} numberOfLines={3}>
                {dua.transliteration}
              </Text>

              {/* Translation */}
              <Text style={styles.translation} numberOfLines={5}>
                {getTranslation()}
              </Text>
            </View>

            {/* Bottom Decoration */}
            <View style={styles.bottomDecoration}>
              <View style={[styles.decorLine, { backgroundColor: colors.secondary.main }]} />
              <Text style={styles.watermark}>smartduacompanion.app</Text>
              <View style={[styles.decorLine, { backgroundColor: colors.secondary.main }]} />
            </View>
          </View>
        </ViewShot>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: colors.primary.main }]}
        onPress={handleShare}
      >
        <Icon name="share-variant" size={24} color="#fff" />
        <Text style={styles.shareButtonText}>
          {language === 'ur' ? 'تصویر شیئر کریں' : 'Share as Image'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  hiddenContainer: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },
  shareCard: {
    width: 1080,
    height: 1920,
  },
  cardBackground: {
    flex: 1,
    padding: 60,
    justifyContent: 'space-between',
  },
  topDecoration: {
    flexDirection: 'row',
    gap: 20,
    opacity: 0.3,
  },
  decorCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  categoryBadge: {
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 30,
  },
  categoryText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  arabicContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
  },
  arabicText: {
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 72,
  },
  transliteration: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    opacity: 0.9,
  },
  translation: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 48,
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  decorLine: {
    flex: 1,
    height: 3,
    opacity: 0.5,
  },
  watermark: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.7,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 25,
    gap: spacing.sm,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});

export default DuaShareCard;