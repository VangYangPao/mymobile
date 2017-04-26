package com.microsurance;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.github.channguyen.rsv.RangeSliderView;

/**
 * Created by hao on 23/04/2017.
 */


public class RangeSliderEvent extends Event<RangeSliderEvent> {

    public static final String EVENT_NAME = "topChange";

    private final int mValue;
    private final boolean mFromUser;

    public RangeSliderEvent(int viewId, int value, boolean fromUser) {
        super(viewId);
        mValue = value;
        mFromUser = fromUser;
    }

    public double getValue() {
        return mValue;
    }

    public boolean isFromUser() {
        return mFromUser;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public short getCoalescingKey() {
        return 0;
    }
    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("target", getViewTag());
        eventData.putDouble("index", getValue());
        eventData.putBoolean("fromUser", isFromUser());
        return eventData;
    }
}