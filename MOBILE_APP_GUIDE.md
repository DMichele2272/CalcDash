# CalcDash Mobile App - Setup & Implementation Guide

## 📱 Project Overview

Building a React Native app for iOS & Android with Expo, featuring:
- All 8 calculators from web version
- Premium in-app purchases via RevenueCat
- Calculation history & favorites
- Share & export functionality
- Custom themes
- Offline mode

---

## 🚀 Phase 1: Project Setup

### Step 1: Create New Expo Project

```bash
npx create-expo-app CalcDash-Mobile
cd CalcDash-Mobile
```

### Step 2: Install Dependencies

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install redux @reduxjs/toolkit react-redux
npm install typescript @types/react @types/react-native --save-dev
npm install react-native-revenuecat-ui @revenuecat/react-native-purchases
npm install @react-native-async-storage/async-storage
npm install react-native-share
npm install firebase react-native-google-mobile-ads
npm install expo-sharing expo-file-system
npm install reanimated
```

### Step 3: Create Project Structure

```
CalcDash-Mobile/
├── app/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CalculatorScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── PremiumScreen.tsx
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   ├── App.tsx
│   └── index.ts
├── src/
│   ├── components/
│   │   ├── calculators/
│   │   │   ├── BasicCalculator.tsx
│   │   │   ├── BMICalculator.tsx
│   │   │   ├── AgeCalculator.tsx
│   │   │   ├── LoanCalculator.tsx
│   │   │   ├── MortgageCalculator.tsx
│   │   │   ├── TipCalculator.tsx
│   │   │   ├── UnitConverter.tsx
│   │   │   └── PercentageCalculator.tsx
│   │   └── common/
│   │       ├── PremiumBanner.tsx
│   │       ├── CalculationCard.tsx
│   │       └── ThemePicker.tsx
│   ├── services/
│   │   ├── revenuecatService.ts
│   │   ├── storageService.ts
│   │   ├── analyticsService.ts
│   │   └── shareService.ts
│   ├── store/
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── userSlice.ts
│   │   │   ├── historySlice.ts
│   │   │   └── settingsSlice.ts
│   │   └── types.ts
│   ├── utils/
│   │   ├── calculations.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── constants/
│       ├── themes.ts
│       ├── calculators.ts
│       └── revenuecatIds.ts
├── app.json
├── eas.json
├── app.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔐 Phase 2: RevenueCat Setup (In-App Purchases)

### Step 1: Create RevenueCat Account
1. Go to https://www.revenuecat.com
2. Sign up and create account
3. Create a new project called "CalcDash"

### Step 2: Configure RevenueCat

Create `src/services/revenuecatService.ts`:

```typescript
import Purchases, { PurchasesError } from '@revenuecat/react-native-purchases';
import { Platform } from 'react-native';

const IOS_API_KEY = 'your_ios_api_key';
const ANDROID_API_KEY = 'your_android_api_key';
const PREMIUM_ENTITLEMENT_ID = 'premium';
const PREMIUM_PACKAGE_ID = 'premium_monthly'; // or use annual

export const initializePurchases = async () => {
  try {
    const apiKey = Platform.OS === 'ios' ? IOS_API_KEY : ANDROID_API_KEY;
    
    await Purchases.configure({
      apiKey: apiKey,
      appUserID: undefined, // Anonymous user initially
      observerMode: false,
      usesStoreKit2IfAvailable: true,
    });

    console.log('RevenueCat initialized');
  } catch (error) {
    console.error('RevenueCat init error:', error);
  }
};

export const getAvailablePackages = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages || [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
};

export const purchasePremium = async (package: any) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(package);
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
    return isPremium;
  } catch (error) {
    if ((error as PurchasesError).userCancelled) {
      console.log('User cancelled purchase');
    } else {
      console.error('Purchase error:', error);
    }
    return false;
  }
};

export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
    return isPremium;
  } catch (error) {
    console.error('Restore error:', error);
    return false;
  }
};

export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.error('Check premium error:', error);
    return false;
  }
};

export const logOut = async () => {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

### Step 3: Set Up RevenueCat Console

1. In RevenueCat dashboard:
   - Create entitlement: `premium`
   - Create product IDs:
     - iOS: `com.calculash.premium`
     - Android: `com.calculash.premium`
   - Create packages linking products to entitlements
   - Set price ($2.99)

---

## 💾 Phase 3: Local Storage Setup

Create `src/services/storageService.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CalculationRecord {
  id: string;
  calculator: string;
  inputs: Record<string, any>;
  result: any;
  timestamp: number;
  isFavorite: boolean;
}

const HISTORY_KEY = '@calcDash_history';
const FAVORITES_KEY = '@calcDash_favorites';
const THEME_KEY = '@calcDash_theme';
const PREMIUM_KEY = '@calcDash_premium';

export const saveCalculation = async (calculation: CalculationRecord) => {
  try {
    const existing = await getHistory();
    const updated = [calculation, ...existing];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving calculation:', error);
  }
};

export const getHistory = async (): Promise<CalculationRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const deleteCalculation = async (id: string) => {
  try {
    const history = await getHistory();
    const filtered = history.filter(calc => calc.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting calculation:', error);
  }
};

export const toggleFavorite = async (id: string) => {
  try {
    const history = await getHistory();
    const updated = history.map(calc => 
      calc.id === id ? { ...calc, isFavorite: !calc.isFavorite } : calc
    );
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

export const getFavorites = async (): Promise<CalculationRecord[]> => {
  try {
    const history = await getHistory();
    return history.filter(calc => calc.isFavorite);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};
```

---

## 📊 Phase 4: State Management (Redux)

Create `src/store/slices/userSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isPremium: boolean;
  userId: string | null;
  theme: 'light' | 'dark' | 'auto';
}

const initialState: UserState = {
  isPremium: false,
  userId: null,
  theme: 'dark',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPremium: (state, action: PayloadAction<boolean>) => {
      state.isPremium = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setPremium, setUserId, setTheme } = userSlice.actions;
export default userSlice.reducer;
```

---

## 🎨 Phase 5: Build Configuration

Create `app.json`:

```json
{
  "expo": {
    "name": "CalcDash",
    "slug": "calcdash",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.calculash.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.calculash.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "@react-native-firebase/app",
      ["@react-native-firebase/analytics"]
    ]
  }
}
```

Create `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📋 Phase 6: Implementation Checklist

- [ ] Create project structure
- [ ] Install all dependencies
- [ ] Set up RevenueCat account & configure API keys
- [ ] Implement storage services
- [ ] Set up Redux store
- [ ] Create navigation structure
- [ ] Build calculator components (port from web)
- [ ] Create HomeScreen
- [ ] Create HistoryScreen
- [ ] Create SettingsScreen
- [ ] Create PremiumScreen
- [ ] Implement share functionality
- [ ] Add Firebase Analytics
- [ ] iOS build & submission
- [ ] Android build & submission

---

## 💰 Submission Steps

### iOS App Store

1. Create Apple Developer account ($99/year)
2. Create app record in App Store Connect
3. Get signing certificate & provisioning profile
4. Run: `eas build --platform ios`
5. Submit for review

### Google Play Store

1. Create Google Play Developer account ($25 one-time)
2. Create app record in Google Play Console
3. Set up signing key
4. Run: `eas build --platform android`
5. Submit for review

---

## 📈 Post-Launch

- Monitor analytics
- Respond to reviews
- A/B test pricing ($0.99 vs $2.99 vs $4.99)
- Add new calculators based on user requests
- Create marketing materials

---

**Ready to build! Let me know when you want to proceed with implementation.** 🚀
