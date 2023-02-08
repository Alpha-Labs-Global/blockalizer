import * as amplitude from "@amplitude/analytics-browser";
import platform from "platform";

export const initAmplitude = () => {
  const key = process.env.REACT_APP_AMPLITUDE || "amplitude_key";
  amplitude.init(key);
};

export const setAmplitudeUserDevice = (installationToken: string) => {
  amplitude.setDeviceId(installationToken);
};

export const setAmplitudeUserId = (userId: string) => {
  amplitude.setUserId(userId);
};

export const sendAmplitudeData = (eventType: string, eventProperties: any) => {
  amplitude.logEvent(eventType, eventProperties);
};

export const trackAmplitude = (event: string) => {
  amplitude.track(event);
};

export const identifyAmplitude = () => {
  let properties = new Map<string, string>();
  if (platform.name) properties.set("browser", platform.name);
  if (platform.version) properties.set("version", platform.version);
  if (platform.os) properties.set("os", platform.os.toString());
  if (platform.product) properties.set("product", platform.product);
  navigator.languages.forEach((lang: string, i: number) => {
    properties.set("langugage" + i, lang);
  });

  const event = new amplitude.Identify();
  properties.forEach((value: string, key: string) => {
    event.set(key, value);
  });
  amplitude.identify(event);
};
