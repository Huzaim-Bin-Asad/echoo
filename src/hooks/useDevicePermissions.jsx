// useDevicePermissions.js
import { useState, useEffect, useCallback } from 'react';

const useDevicePermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState({
    camera: 'prompt',
    microphone: 'prompt',
    geolocation: 'prompt',
    notifications: 'prompt',
    clipboard: 'prompt',
    midi: 'prompt',
    sensors: 'prompt',
  });

  const checkPermission = async (permissionName) => {
    try {
      if (permissionName === 'geolocation') {
        return new Promise((resolve) => {
          if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' })
              .then(result => resolve(result.state))
              .catch(() => resolve('not-supported'));
          } else {
            resolve('prompt');
          }
        });
      }

      if (permissionName === 'notifications') {
        return Notification.permission;
      }

      if (permissionName === 'clipboard-read') {
        return 'prompt'; // Cannot query directly
      }

      if (permissionName === 'midi') {
        return navigator.requestMIDIAccess ? 'prompt' : 'not-supported';
      }

      if (['accelerometer', 'gyroscope', 'magnetometer'].includes(permissionName)) {
        return 'prompt';
      }

      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: permissionName });
        return result.state;
      }

      return 'prompt';
    } catch (err) {
      console.error(`Error checking ${permissionName}:`, err);
      return 'not-supported';
    }
  };

  const checkSensorPermissions = async () => {
    if (!('Accelerometer' in window || 'Gyroscope' in window)) {
      return 'not-supported';
    }
    return 'prompt';
  };

  const checkAllPermissions = useCallback(async () => {
    const statuses = await Promise.all([
      checkPermission('camera'),
      checkPermission('microphone'),
      checkPermission('geolocation'),
      checkPermission('notifications'),
      checkPermission('clipboard-read'),
      checkPermission('midi'),
      checkSensorPermissions(),
    ]);

    setPermissionStatus({
      camera: statuses[0],
      microphone: statuses[1],
      geolocation: statuses[2],
      notifications: statuses[3],
      clipboard: statuses[4],
      midi: statuses[5],
      sensors: statuses[6],
    });
  }, []);

  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions]);

  const requestPermission = async (permissionName) => {
    try {
      let status = 'denied';

      switch (permissionName) {
        case 'camera':
        case 'microphone': {
          const constraints = permissionName === 'camera' ? { video: true } : { audio: true };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          stream.getTracks().forEach(t => t.stop());
          status = 'granted';
          break;
        }

        case 'geolocation':
          await new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(
              () => res(),
              err => rej(err)
            );
          });
          status = 'granted';
          break;

        case 'notifications':
          status = await Notification.requestPermission();
          break;

        case 'clipboard-read':
          await navigator.clipboard.readText();
          status = 'granted';
          break;

        case 'clipboard-write':
          await navigator.clipboard.writeText('test');
          status = 'granted';
          break;

        case 'midi':
          await navigator.requestMIDIAccess();
          status = 'granted';
          break;

        default:
          status = 'not-supported';
      }

      await checkAllPermissions();
      return status;
    } catch (err) {
      console.error(`Error requesting ${permissionName} permission:`, err);
      return err.name === 'NotAllowedError' ? 'denied' : 'not-supported';
    }
  };

  const requestMultiplePermissions = async (permissions) => {
    const results = await Promise.all(permissions.map(p => requestPermission(p)));
    return permissions.reduce((acc, p, i) => {
      acc[p] = results[i];
      return acc;
    }, {});
  };

  return {
    permissionStatus,
    checkPermission,
    requestPermission,
    requestMultiplePermissions,
    checkAllPermissions,
  };
};

export default useDevicePermissions;
