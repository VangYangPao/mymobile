MicroUmbrella
===

MicroUmbrella is a [mono-repo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) consisting of multiple Node packages. The mono-repo structure is supported with [lerna](https://github.com/lerna/lerna).

Please learn about the [mono-repp structure](https://github.com/babel/babel/blob/master/doc/design/monorepo.md), its benefits, and how to use Lerna.

**microumbrella-app**

Mobile app limited to Singapore and Malaysia. Contains the assets, React Native build scripts, and data needed to run the app.

**microumbrella-core**

Core mobile app source written in JavaScript (React Native). It's designed to be extensible to different components, views and functions (payments, chatbot, products). microumbrella-core is a shared package to encourage code-sharing between future white-labelled mobile app projects.


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
