# Smart Dua Companion

<div align="center">
  <img src="website/logo.png" alt="Smart Dua Companion Logo" width="120" height="120" />
  <h1>Smart Dua Companion</h1>
  <p>
    <strong>Your Pocket Companion for Authentic Islamic Supplications</strong>
  </p>
  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-download">Download</a>
  </p>
</div>

---

## 📖 About The Project

**Smart Dua Companion** is a modern, feature-rich mobile application designed to help users access authentic Islamic supplications (Duas) from the Quran and Sunnah. Built with a focus on usability and accessibility, the app offers a seamless experience with bilingual support (English & Urdu), dark mode, and offline access.

Whether you are looking for morning/evening Azkar, protection duas, or supplications for specific needs, Smart Dua Companion provides them with accurate translations, transliterations, and authentic references.

## ✨ Key Features

* **📚 Authentic Collection:** Hundreds of Duas verified from the Quran and Sahih Hadith.
* **🌍 Bilingual Support:** Complete interface and content available in **English** and **Urdu (اردو)**.
* **🌙 Dark Mode:** Fully optimized dark theme for comfortable reading at night or in low light.
* **📶 Offline Access:** All data is stored locally; no internet connection required after download.
* **🔍 Smart Search:** Instantly find Duas by keywords in English or Urdu.
* **❤️ Favorites:** Save your most-used Duas for quick access.
* **🔤 Transliteration:** Roman English transliteration to help with pronunciation.
* **📖 Reference & Benefits:** Each Dua includes its authentic source and spiritual benefits.
* **⚙️ Customization:** Adjust font sizes and toggle translation/transliteration visibility.

## 📱 Screenshots

| Home Screen | Dark Mode | Urdu Interface | Dua Detail | Allah Names |
|:---:|:---:|:---:|:---:|:---:|
| <img src="./SmartDuaCompanionNew/src/assets/images/light theme.jpeg" width="200" alt="Home Light"/> | <img src="./SmartDuaCompanionNew/src/assets/images/dark theme.jpeg" width="200" alt="Home Dark"/> | <img src="./SmartDuaCompanionNew/src/assets/images/urdu language.jpeg" width="200" alt="Urdu Mode"/> | <img src="./SmartDuaCompanionNew/src/assets/images/Dua details.jpeg" width="200" alt="Detail Screen"/> | <img src="./SmartDuaCompanionNew/src/assets/images/Allah names.jpeg" width="200" alt="Allah names"/>

*(Note: Screenshots demonstrate the app's bilingual and theme capabilities)*

## 🛠️ Tech Stack

* **Framework:** [React Native](https://reactnative.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
* **Persistence:** [Redux Persist](https://github.com/rt2zz/redux-persist) (AsyncStorage)
* **Navigation:** [React Navigation](https://reactnavigation.org/)
* **Icons:** [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
* **Theme:** Custom Dynamic Hook (`useThemeColors`)

## 🚀 Getting Started

To run this project locally on your machine, follow these steps.

### Prerequisites

* Node.js (v18 or newer)
* Java Development Kit (JDK 17)
* Android Studio & Android SDK
* React Native CLI

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Ahtisham992/SmartDuaCompanion.git](https://github.com/Ahtisham992/SmartDuaCompanion.git)
    cd smart-dua-companion
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start Metro Bundler**
    ```bash
    npm start
    ```

4.  **Run on Android**
    ```bash
    npm run android
    ```

## 📦 Building the APK

To generate a release APK for installation on physical devices:

1.  Navigate to the android folder:
    ```bash
    cd android
    ```
2.  Run the build command:
    ```bash
    ./gradlew assembleRelease
    ```
3.  The APK will be generated at:
    `android/app/build/outputs/apk/release/app-release.apk`

## 🤝 Contributing

Contributions are welcome! If you have suggestions for new Duas or features:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/Ahtisham992/SmartDuaCompanion](https://github.com/Ahtisham992/SmartDuaCompanion)
