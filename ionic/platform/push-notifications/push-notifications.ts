import {NativePlugin} from '../plugin';

/**
 * Access Network information and respond to changes in network state.
 *
 * @usage
 * ```js
 * let networkInfo = Network.getNetwork()
 * let isOnline = Network.isOnline()
 * let isOffline = Network.isOffline()
 * ```
 */
@NativePlugin({
  name: 'PushNotifications',
  platforms: ['ios', 'android'],
  engines: {
    cordova: 'phonegap-plugin-push'
  },
  pluginCheck: () => {
    return !!window.PushNotification;
  }
})
@Injectable()
export class PushNotifications {
  /**
   * Return network info.
   */
  static init(config) {
    return new Promise((resolve, reject) => {
      this.ifPlugin(() => {
        var push = window.PushNotifications.init(config);
        resolve(new PushNotificationService(push));
      }) || reject();
    });
  }
}

class PushNotificationService {

  constructor(pushInstance) {
    this._push = pushInstance;
    this._push.on('registration', function(data) {
    });
  }
}
