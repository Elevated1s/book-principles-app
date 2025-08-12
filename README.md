# Book Principles Android App

This is the Android version of your Book Principles PWA, converted using Trusted Web Activity (TWA).

## 🚀 **Quick Build Instructions**

### **Option 1: Build with Android Studio (Recommended)**
1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to this folder and select it
4. Wait for Gradle sync to complete
5. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
6. Your APK will be in `app/build/outputs/apk/debug/`

### **Option 2: Build with Command Line**
1. Make sure you have Java 17 and Android SDK installed
2. Run: `./gradlew assembleDebug` (Linux/Mac) or `gradlew.bat assembleDebug` (Windows)
3. Your APK will be in `app/build/outputs/apk/debug/`

## 📱 **App Details**
- **Package Name**: `com.digitalelevations.bookprinciples`
- **App Name**: Book Principles
- **Version**: 1.0.0
- **Target URL**: https://bright-crepe-8aea7d.netlify.app/

## 🔧 **Customization**
- Edit `twa-manifest.json` to change app details
- Edit `app/src/main/res/values/strings.xml` to change app name
- Edit `app/src/main/res/values/styles.xml` to change colors

## 📋 **Next Steps**
1. Build the APK
2. Test on your device
3. Generate a signed APK for Play Store
4. Upload to Google Play Console

## 🆘 **Troubleshooting**
- If build fails, make sure Java 17 and Android SDK are installed
- Check that all dependencies are resolved in build.gradle files
- Ensure your PWA is accessible at the target URL 