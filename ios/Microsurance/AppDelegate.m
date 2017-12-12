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
#import <asl.h>
#import "RCTLog.h"

//#import <Google/Analytics.h>
//#import <Analytics/SEGAnalytics.h>
//#import "Mixpanel/Mixpanel.h"
@import Firebase;

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  
  [Fabric with:@[[Crashlytics class]]];
  
  RCTSetLogFunction(CrashlyticsReactLogFunction);
  
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:@"f33057ef-5bc4-4581-af40-9504d10e3d69"
                                                  settings:@{kOSSettingsKeyAutoPrompt: @false}];
  
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

RCTLogFunction CrashlyticsReactLogFunction = ^(
                                               RCTLogLevel level,
                                               __unused RCTLogSource source,
                                               NSString *fileName,
                                               NSNumber *lineNumber,
                                               NSString *message
                                               )
{
  NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);
  
#ifdef DEBUG
  fprintf(stderr, "%s\n", log.UTF8String);
  fflush(stderr);
#else
  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
#endif
  
  int aslLevel;
  switch(level) {
    case RCTLogLevelTrace:
      aslLevel = ASL_LEVEL_DEBUG;
      break;
    case RCTLogLevelInfo:
      aslLevel = ASL_LEVEL_NOTICE;
      break;
    case RCTLogLevelWarning:
      aslLevel = ASL_LEVEL_WARNING;
      break;
    case RCTLogLevelError:
      aslLevel = ASL_LEVEL_ERR;
      break;
    case RCTLogLevelFatal:
      aslLevel = ASL_LEVEL_CRIT;
      break;
  }
  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
  
  
};

@end
