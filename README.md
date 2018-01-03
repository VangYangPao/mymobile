MicroUmbrella
===

MicroUmbrella is a mono-repo consisting of multiple Node packages.

1. **microumbrella-app -** Mobile app for Singapore and Malaysia.
2. **microumbrella-core -** Core mobile app code used for white-labelled apps and main mobile app.

Installation
---

```
git clone https://github.com/mavenave/MicroUmbrella.git
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

Debugging
---

Most issues arise from problems in installation and setup. The best way to fix this is to re-install all NPM dependencies and re-run the React Native packager.

```
# delete all node_modules from packages
npm run clean

# re-install all dependencies in packages
npm run bootstrap

watchman watch-del-all
cd microumbrella-app
npm start --reset-cache

```
