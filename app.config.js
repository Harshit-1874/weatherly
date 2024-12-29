import 'dotenv/config';

export default {
  "expo": {
    "name": "weatherly",
    "slug": "weatherly",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      package: 'com.harry1874.weatherly'
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "openWeatherApiKey": `${process.env.OPEN_WEATHER_API}`,
      "eas": {
        "projectId": "0b915f42-337c-4560-b0aa-0efb0c09065a"
      }
    }
  }
}
