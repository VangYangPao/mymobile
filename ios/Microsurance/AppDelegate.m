/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <ZDCChat/ZDCChat.h>
//#import <Google/Analytics.h>
//#import <Analytics/SEGAnalytics.h>
//#import "Mixpanel/Mixpanel.h"
@import Firebase;

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  
  [Fabric with:@[[Crashlytics class]]];
  
//  [Mixpanel sharedInstanceWithToken:@"453d7c637ef74b357bc856da82999f5c"];
//  
//  GAI *gai = [GAI sharedInstance];
//  [gai trackerWithTrackingId:@"UA-53448691-13"];
//  
//  // Optional: automatically report uncaught exceptions.
//  gai.trackUncaughtExceptions = YES;
//  
//  SEGAnalyticsConfiguration *configuration = [SEGAnalyticsConfiguration configurationWithWriteKey:@"r4ONfzIR3Njwbq6D1lTIl08cP4yOQRGj"];
//  
//  // Enable this to record certain application events automatically!
//  configuration.trackApplicationLifecycleEvents = YES;
//  
//  // Enable this to record screen views automatically!
//  configuration.recordScreenViews = YES;
//  
//  [SEGAnalytics setupWithConfiguration:configuration];
  
  [ZDCChat initializeWithAccountKey:@"54COnYxIyuuyQhBGnus5hkJkNUvs4zpi"];

  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Microsurance"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
