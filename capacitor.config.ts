import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "io.ionic.onecx",
    appName: "1CX",
    webDir: "build",
    bundledWebRuntime: false,
    server: {
        androidScheme: "http",
        allowNavigation: [
            "https://apijjph.hqsoft.vn",
            "https://192.168.120.3/1CX_Catalogs",
            "https://192.168.120.3/1CX_Catalogs_temp",
        ],
    },
    plugins: {
        Keyboard: {
            resizeOnFullScreen: true,
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound"],
        },
    },
};

export default config;
