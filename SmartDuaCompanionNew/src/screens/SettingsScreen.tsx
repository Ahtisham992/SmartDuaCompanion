// =====================================================
// src/screens/SettingsScreen.tsx
// UPDATED: Complete with Update & Reset Features
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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

import { RootState, persistor } from '../store';
import {
  toggleTransliteration,
  toggleTranslation,
  toggleNotifications,
  updateFontSize,
  setLanguage,
  setTheme,
} from '../store/slices/settingsSlice';
import { fetchRemoteUpdate } from '../store/slices/duaSlice'; // <--- Import the Update Action
import { spacing, typography } from '../theme'; 
import { useThemeColors } from '../hooks/useThemeColors';

const SettingsScreen = () => {
  // Use typed dispatch for Thunks
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const settings = useSelector((state: RootState) => state.settings);
  const colors = useThemeColors();

// 👇 Use this RAW GitHub link
const REMOTE_JSON_URL = 'https://raw.githubusercontent.com/Ahtisham992/SmartDuaCompanion/main/SmartDuaCompanionNew/src/data/initial-duas.json';
  // --- HANDLERS ---

  const handleToggleTransliteration = () => { dispatch(toggleTransliteration()); };
  const handleToggleTranslation = () => { dispatch(toggleTranslation()); };
  const handleToggleNotifications = () => { dispatch(toggleNotifications()); };
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => { dispatch(updateFontSize(size)); };
  const handleLanguageChange = (lang: 'en' | 'ur' | 'ar') => { dispatch(setLanguage(lang)); };
  const handleThemeChange = (theme: 'light' | 'dark') => { dispatch(setTheme(theme)); };

  // --- UPDATE HANDLER ---
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
                        // Dispatches the Thunk to download and save new data
                        const result = await dispatch(fetchRemoteUpdate(REMOTE_JSON_URL)).unwrap();
                        Alert.alert("Success", `App updated to Content Version ${result.version}`);
                    } catch (error: any) {
                        // If "App is already up to date" or network error
                        Alert.alert("Update Status", error || "You are already on the latest version.");
                    }
                } 
            }
        ]
    );
  };

  // --- RESET HANDLER ---
  const handleResetData = async () => {
    Alert.alert(
      "Factory Reset",
      "This will wipe all downloaded data and restore the original Duas that came with the app. Your favorites will be cleared.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset Everything", 
          style: "destructive", 
          onPress: async () => {
            // 1. Wipe Disk Storage
            await persistor.purge();
            // 2. Wipe Redux Memory & Reload Initial JSON
            dispatch({ type: 'RESET_APP' });
            
            Alert.alert("Reset Complete", "The app has been restored to its original state.");
          }
        }
      ]
    );
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

      {/* 2. Display Settings */}
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

      {/* 3. Theme Settings */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {settings.language === 'ur' ? 'تھیم' : 'Theme'}
        </Text>

        <View style={styles.themeButtons}>
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

      {/* 5. Content Updates (NEW) */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary.main }]}>
          Content Updates
        </Text>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.primary.light + '20', borderColor: colors.primary.main }]} 
          onPress={handleCheckUpdate}
        >
          <Icon name="cloud-download" size={24} color={colors.primary.main} />
          <Text style={[styles.resetButtonText, { color: colors.primary.main }]}>
            Check for New Duas
          </Text>
        </TouchableOpacity>
        <Text style={[styles.resetSubtext, { color: colors.text.secondary }]}>
          Download latest translations and audio without updating the app.
        </Text>
      </View>

      {/* 6. Developer Tools (Factory Reset) */}
      {/*<View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent.error }]}>
          Advanced
        </Text>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' }]} 
          onPress={handleResetData}
        >
          <Icon name="database-refresh" size={24} color={colors.accent.error} />
          <Text style={[styles.resetButtonText, { color: colors.accent.error }]}>
            Factory Reset App
          </Text>
        </TouchableOpacity>
        <Text style={[styles.resetSubtext, { color: colors.text.secondary }]}>
          Use this if you encounter issues or want to clear all data.
        </Text>
      </View>
      */}

      {/* App Info */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <View style={styles.infoRow}>
          <Icon name="information-outline" size={20} color={colors.primary.main} />
          <Text style={[styles.infoText, { color: colors.text.primary }]}>Smart Dua Companion v1.0.0</Text>
        </View>
      </View>

      <View style={{ height: spacing.xl }} />
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
  themeButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  themeButton: { flex: 1, alignItems: 'center', padding: spacing.md, marginHorizontal: spacing.xs, borderRadius: 12 },
  themeButtonText: { fontSize: typography.sizes.sm, marginTop: spacing.xs, fontWeight: '600' },
  resetButton: { padding: spacing.md, borderRadius: 12, alignItems: 'center', borderWidth: 1, flexDirection: 'row', justifyContent: 'center' },
  resetButtonText: { fontWeight: 'bold', marginLeft: 10, fontSize: typography.sizes.md },
  resetSubtext: { textAlign: 'center', fontSize: typography.sizes.sm, marginTop: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  infoText: { fontSize: typography.sizes.md, marginLeft: spacing.sm, fontWeight: '600' },
});

export default SettingsScreen;