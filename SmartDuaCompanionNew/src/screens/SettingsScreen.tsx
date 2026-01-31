// =====================================================
// src/screens/SettingsScreen.tsx
// UPDATED: Added 'Auto' Theme Button
// =====================================================
import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  toggleTransliteration,
  toggleTranslation,
  toggleNotifications,
  updateFontSize,
  setLanguage,
  setTheme,
} from '../store/slices/settingsSlice';
import { fetchRemoteUpdate } from '../store/slices/duaSlice'; 
import { spacing, typography } from '../theme'; 
import { useThemeColors } from '../hooks/useThemeColors';

const SettingsScreen = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const settings = useSelector((state: RootState) => state.settings);
  const colors = useThemeColors();

  const REMOTE_JSON_URL = 'https://raw.githubusercontent.com/Ahtisham992/SmartDuaCompanion/main/SmartDuaCompanionNew/src/data/initial-duas.json';

  // --- HANDLERS ---
  const handleToggleTransliteration = () => { dispatch(toggleTransliteration()); };
  const handleToggleTranslation = () => { dispatch(toggleTranslation()); };
  const handleToggleNotifications = () => { dispatch(toggleNotifications()); };
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => { dispatch(updateFontSize(size)); };
  const handleLanguageChange = (lang: 'en' | 'ur' | 'ar') => { dispatch(setLanguage(lang)); };
  
  // UPDATED: Accepts 'system'
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => { dispatch(setTheme(theme)); };

  const handleCheckUpdate = async () => {
    Alert.alert(
        "Check for Updates",
        "Do you want to check online for new Duas?",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Check & Update", 
                onPress: async () => {
                    try {
                        const result = await dispatch(fetchRemoteUpdate(REMOTE_JSON_URL)).unwrap();
                        Alert.alert("Success", `App updated to Content Version ${result.version}`);
                    } catch (error: any) {
                        Alert.alert("Update Status", error || "You are already on the latest version.");
                    }
                } 
            }
        ]
    );
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:shamimuhmmad77@gmail.com?subject=Smart Dua Companion Feedback');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.default }]}>
      
      {/* 1. Language Settings */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Language / زبان</Text>
        <View style={styles.languageButtons}>
          {(['en', 'ur', 'ar'] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton,
                { 
                  backgroundColor: settings.language === lang ? colors.primary.main : colors.background.subtle,
                  borderColor: settings.language === lang ? colors.primary.dark : 'transparent',
                }
              ]}
              onPress={() => handleLanguageChange(lang)}
            >
              <Icon 
                name="translate" 
                size={24} 
                color={settings.language === lang ? '#fff' : colors.text.secondary}
              />
              <Text
                style={[
                  styles.languageButtonText,
                  { color: settings.language === lang ? '#fff' : colors.text.secondary },
                  settings.language === lang && styles.boldText,
                ]}
              >
                {lang === 'en' ? 'English' : lang === 'ur' ? 'اردو' : 'عربي'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. Theme Settings (UPDATED) */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {settings.language === 'ur' ? 'تھیم' : 'Theme'}
        </Text>

        <View style={styles.themeButtons}>
          {/* Light Button */}
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: settings.theme === 'light' ? colors.primary.main : colors.background.subtle }
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <Icon 
              name="white-balance-sunny" 
              size={24} 
              color={settings.theme === 'light' ? '#fff' : colors.text.secondary}
            />
            <Text style={[styles.themeButtonText, { color: settings.theme === 'light' ? '#fff' : colors.text.secondary }]}>
              {settings.language === 'ur' ? 'روشن' : 'Light'}
            </Text>
          </TouchableOpacity>

          {/* Dark Button */}
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: settings.theme === 'dark' ? colors.primary.main : colors.background.subtle }
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <Icon 
              name="moon-waning-crescent" 
              size={24} 
              color={settings.theme === 'dark' ? '#fff' : colors.text.secondary}
            />
            <Text style={[styles.themeButtonText, { color: settings.theme === 'dark' ? '#fff' : colors.text.secondary }]}>
              {settings.language === 'ur' ? 'تاریک' : 'Dark'}
            </Text>
          </TouchableOpacity>

          {/* Auto/System Button */}
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: settings.theme === 'system' ? colors.primary.main : colors.background.subtle }
            ]}
            onPress={() => handleThemeChange('system')}
          >
            <Icon 
              name="theme-light-dark" 
              size={24} 
              color={settings.theme === 'system' ? '#fff' : colors.text.secondary}
            />
            <Text style={[styles.themeButtonText, { color: settings.theme === 'system' ? '#fff' : colors.text.secondary }]}>
              {settings.language === 'ur' ? 'آٹو' : 'Auto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Display Settings */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {settings.language === 'ur' ? 'ڈسپلے' : 'Display'}
        </Text>

        <View style={[styles.row, { borderBottomColor: colors.background.subtle }]}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {settings.language === 'ur' ? 'تلفظ دکھائیں' : 'Show Transliteration'}
          </Text>
          <Switch
            value={settings.showTransliteration}
            onValueChange={handleToggleTransliteration}
            trackColor={{ false: '#ccc', true: colors.primary.light }}
            thumbColor={settings.showTransliteration ? colors.primary.main : '#f4f3f4'}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.background.subtle }]}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {settings.language === 'ur' ? 'ترجمہ دکھائیں' : 'Show Translation'}
          </Text>
          <Switch
            value={settings.showTranslation}
            onValueChange={handleToggleTranslation}
            trackColor={{ false: '#ccc', true: colors.primary.light }}
            thumbColor={settings.showTranslation ? colors.primary.main : '#f4f3f4'}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {settings.language === 'ur' ? 'فونٹ سائز' : 'Font Size'}
          </Text>
          <View style={styles.fontSizeButtons}>
            {(['small', 'medium', 'large'] as const).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  { 
                    backgroundColor: settings.fontSize === size ? colors.primary.main : colors.background.subtle,
                    borderColor: settings.fontSize === size ? colors.primary.dark : 'transparent',
                  }
                ]}
                onPress={() => handleFontSizeChange(size)}
              >
                <Text
                  style={[
                    styles.fontSizeButtonText,
                    { color: settings.fontSize === size ? '#fff' : colors.text.secondary }
                  ]}
                >
                  A
                </Text>
                <Text style={[
                  styles.fontSizeLabel,
                  { color: settings.fontSize === size ? '#fff' : colors.text.secondary }
                ]}>
                  {size === 'small' ? '12' : size === 'medium' ? '16' : '20'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 4. Notifications */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {settings.language === 'ur' ? 'اطلاعات' : 'Notifications'}
        </Text>
        <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {settings.language === 'ur' ? 'اطلاعات فعال کریں' : 'Enable Notifications'}
            </Text>
            <Text style={[styles.labelSubtext, { color: colors.text.secondary }]}>
              {settings.language === 'ur' 
                ? 'دن میں دعاؤں کی یاد دہانی حاصل کریں'
                : 'Get reminders for duas throughout the day'}
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#ccc', true: colors.primary.light }}
            thumbColor={settings.notificationsEnabled ? colors.primary.main : '#f4f3f4'}
          />
        </View>
      </View>

      {/* 5. Content Updates */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary.main }]}>
          {settings.language === 'ur' ? 'اپ ڈیٹس' : 'Content Updates'}
        </Text>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.primary.light + '20', borderColor: colors.primary.main }]} 
          onPress={handleCheckUpdate}
        >
          <Icon name="cloud-download" size={24} color={colors.primary.main} />
          <Text style={[styles.resetButtonText, { color: colors.primary.main }]}>
            {settings.language === 'ur' ? 'نئی دعائیں چیک کریں' : 'Check for New Duas'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 6. Contact & Feedback */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {settings.language === 'ur' ? 'رابطہ اور فیڈبیک' : 'Contact & Feedback'}
        </Text>
        
        <View style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <Text style={[styles.developerText, { color: colors.text.primary }]}>
            Created by <Text style={{ fontWeight: 'bold', color: colors.primary.main }}>Muhammad Ahtisham</Text>
          </Text>
          
          <Text style={[styles.feedbackText, { color: colors.text.secondary }]}>
            {settings.language === 'ur'
              ? 'اگر آپ کو کسی دعا یا ترجمہ میں کوئی غلطی نظر آئے تو براہ کرم ہمیں ای میل کریں۔'
              : 'Found a mistake in a Dua or translation? Please let us know.'}
          </Text>

          <TouchableOpacity 
            style={[styles.emailButton, { backgroundColor: colors.background.subtle }]} 
            onPress={handleEmailSupport}
          >
            <Icon name="email-outline" size={20} color={colors.text.primary} />
            <Text style={[styles.emailButtonText, { color: colors.text.primary }]}>
              shamimuhmmad77@gmail.com
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={[styles.section, { backgroundColor: colors.background.paper, marginBottom: spacing.xl }]}>
        <View style={styles.infoRow}>
          <Icon name="information-outline" size={18} color={colors.text.secondary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>Smart Dua Companion v2.0.0</Text>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { padding: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: 'bold', marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1 },
  label: { fontSize: typography.sizes.md, fontWeight: '500' },
  labelContainer: { flex: 1, marginRight: spacing.md },
  labelSubtext: { fontSize: typography.sizes.sm, marginTop: spacing.xs },
  languageButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  languageButton: { flex: 1, alignItems: 'center', padding: spacing.md, marginHorizontal: spacing.xs, borderRadius: 12, borderWidth: 2 },
  languageButtonText: { fontSize: typography.sizes.sm, marginTop: spacing.xs, fontWeight: '600' },
  boldText: { fontWeight: 'bold' },
  fontSizeButtons: { flexDirection: 'row' },
  fontSizeButton: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: spacing.sm, borderWidth: 2 },
  fontSizeButtonText: { fontSize: typography.sizes.md, fontWeight: 'bold' },
  fontSizeLabel: { fontSize: 10, marginTop: 2 },
  themeButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 }, // Added gap
  themeButton: { flex: 1, alignItems: 'center', padding: spacing.md, borderRadius: 12 },
  themeButtonText: { fontSize: typography.sizes.sm, marginTop: spacing.xs, fontWeight: '600' },
  resetButton: { padding: spacing.md, borderRadius: 12, alignItems: 'center', borderWidth: 1, flexDirection: 'row', justifyContent: 'center' },
  resetButtonText: { fontWeight: 'bold', marginLeft: 10, fontSize: typography.sizes.md },
  resetSubtext: { textAlign: 'center', fontSize: typography.sizes.sm, marginTop: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  infoText: { fontSize: typography.sizes.sm, marginLeft: spacing.xs },
  developerText: { fontSize: typography.sizes.md, marginBottom: 8 },
  feedbackText: { fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: 16, paddingHorizontal: 10 },
  emailButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  emailButtonText: { marginLeft: 8, fontWeight: '600' }
});

export default SettingsScreen;