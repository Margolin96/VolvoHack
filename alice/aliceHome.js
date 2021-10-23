const devicesInfo = require('./devicesInfo');

exports.getDevicesList = (requestId, userId) => {
  const devices = devicesInfo.getVehicleDevices('test', 'Тестовая');
  return {
    request_id: requestId,
    payload: {
      user_id: userId,
      devices,
    },
  };
};
