import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

@NativePlugin({
  name: 'FileSystem',
  platforms: {
    cordova: 'cordova-plugin-file'
  }
})
export class File {
  static DATA_DIRECTORY = 'dataDirectory'

  static exists(file) {
    return new Promise((resolve, reject) => {

      try {
        var directory = path + dir;

        window.resolveLocalFileSystemURL(File.DATA_DIRECTORY + file, (fileSystem) => {
          console.log('Got local file', file);
          /*
          if (fileSystem.isDirectory === true) {
            resolve(true);
          } else {
          }
          */
        }, (err) => {
          error.message = err.code;//$cordovaFileError[error.code];
          reject(error);
        });
      } catch (err) {
        err.message = err.code;//$cordovaFileError[err.code];
        reject(err);
      }

    });

  }
}
