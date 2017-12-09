package com.microumbrella.app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.smixx.fabric.FabricPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.rnfs.RNFSPackage;
import com.fileopener.FileOpenerPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.views.image.ReactImageManager;
import com.upinion.VectordrawableAndroid.ReactVectorDrawableAndroidPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FabricPackage(),
            new ReactNativeOneSignalPackage(),
            new RNFSPackage(),
            new FileOpenerPackage(),
            new ImagePickerPackage(),
            new RNSoundPackage(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
            new ReactVectorDrawableAndroidPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Fabric.with(this, new Crashlytics());
  }
}
