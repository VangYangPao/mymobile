// @flow
import Parse from "parse/react-native";

const NotificationDevice = Parse.Object.extend("NotificationDevice");

export function saveNewNotificationDevice(user, notifUserId, notifPushToken) {
  const notificationDevice = new NotificationDevice();
  notificationDevice.set("user", user);
  notificationDevice.set("notifUserId", notifUserId);
  notificationDevice.set("pushToken", notifPushToken);
  notificationDevice.setACL(new Parse.ACL(user));
  return notificationDevice.save();
}
