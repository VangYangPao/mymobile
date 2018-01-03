MicroUmbrella
===

MicroUmbrella is a mono-repo consisting of multiple Node packages.

1. **microumbrella-app -** Mobile app for Singapore and Malaysia.
2. **microumbrella-core -** Core mobile app code used for white-labelled apps and main mobile app.

Installation
---

```
git clone 
npm install
npm run bootstrap

# Run the app, either ios or android
cd microumbrella-app
npm start -- --platform ios
npm start -- --platform android

# On another terminal window, run this command
cd microumbrella-app
react-native run-ios
react-native run-android
```

