import { Preferences } from "@capacitor/preferences";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { BASE_URL } from "../env";
export const useSignalR = () => {
  var connection: HubConnection | undefined = undefined;

  const connectToSignalR = async () => {
    const accessToken = await Preferences.get({ key: "_accessToken" });
    const connect = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/notification`, {
        accessTokenFactory: () => accessToken.value || "",
      })
      .withAutomaticReconnect()
      .build();
      try {
        await connect.start()
      } catch (e) {
        console.log('Error start signalr server: ', e)
      }
    connection = connect;
  };

  const getInstance = async () : Promise<HubConnection> => {
    if (connection) return connection;
    else {
      await connectToSignalR();
      return connection as unknown as HubConnection;
    }
  };
  return {getInstance};
};
