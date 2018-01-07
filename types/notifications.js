export type OpenResultType = {
  notification: {
    payload: {
      body: string,
      additionalData: Object
    },
    isAppInFocus: boolean
  }
};

export type NotificationDeviceType = {
  userId: string,
  pushToken: string
};
