package com.microsurance;

import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.touch.OnInterceptTouchEventListener;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.slider.ReactSliderEvent;
import com.github.channguyen.rsv.RangeSliderView;

/**
 * Created by hao on 23/04/2017.
 */

public class RangeSliderManager extends SimpleViewManager<RangeSliderView> {

    private String TAG = "RangeSliderManager";
    private static final String REACT_CLASS = "RCTRangeSlider";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RangeSliderView createViewInstance(ThemedReactContext context) {
        RangeSliderView view = new RangeSliderView(context);
        return view;
    }

    @ReactProp(name = "rangeCount", defaultInt = 5)
    public void setRangeCount(RangeSliderView view, int rangeCount) {
        view.setRangeCount(rangeCount);
    }

    @ReactProp(name = "barHeightPercent", defaultFloat = 0.10f)
    public void setBarHeightPercent(RangeSliderView view, float barHeightPercent) {
        view.setBarHeightPercent(barHeightPercent);
    }

    @ReactProp(name = "slotRadiusPercent", defaultFloat = 0.125f)
    public void setSlotRadiusPercent(RangeSliderView view, float slotRadiusPercent) {
        view.setSlotRadiusPercent(slotRadiusPercent);
    }

    @ReactProp(name = "sliderRadiusPercent", defaultFloat = 0.25f)
    public void setSliderRadiusPercent(RangeSliderView view, float sliderRadiusPercent) {
        view.setSliderRadiusPercent(sliderRadiusPercent);
    }

    @ReactProp(name = "filledColor")
    public void setFilledColor(RangeSliderView view,  String colorHexString) {
        view.setFilledColor(Color.parseColor(colorHexString));
    }

    @ReactProp(name = "emptyColor")
    public void setEmptyColor(RangeSliderView view,  String colorHexString) {
        view.setEmptyColor(Color.parseColor(colorHexString));
    }

    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, final RangeSliderView view) {
        final RangeSliderView.OnSlideListener listener = new RangeSliderView.OnSlideListener() {
            @Override
            public void onSlide(int index) {
                RangeSliderEvent rangeSliderEvent = new RangeSliderEvent(view.getId(), index, true);
                reactContext
                        .getNativeModule(UIManagerModule.class)
                        .getEventDispatcher()
                        .dispatchEvent(rangeSliderEvent);
//                Toast.makeText(
//                        reactContext,
//                        "Hi index: " + index,
//                        Toast.LENGTH_SHORT)
//                        .show();
            }
        };
        view.setOnSlideListener(listener);
    }
}
