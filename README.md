MicroUmbrella
===

MicroUmbrella is an insurance mobile application.

**microumbrella-core**

Core mobile app source written in JavaScript (React Native). It's designed to be extensible to different components, views and functions (payments, chatbot, products). microumbrella-core is a shared package to encourage code-sharing between future white-labelled mobile app projects.

**microumbrella-core-sg**

Core mobile app source but freezed for Singapore launch. This is to ensure stability before release.


Installation
---

```
git clone --depth 1 https://github.com/mavenave/MicroUmbrella.git
cd microumbrella-app
react-native run-ios
react-native run-android
```

Debugging
---

Most issues arise from problems in installation and setup. The best way to fix this is to re-install all NPM dependencies and re-run the React Native packager.

```
watchman watch-del-all
cd microumbrella-app
npm start --reset-cache

```
