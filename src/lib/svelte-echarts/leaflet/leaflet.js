/**
 * Leftlet component extension
 */

import { registerAction, registerCoordinateSystem } from 'echarts/core';
import LeafletCoordSys from './LeafletCoordSys';

import './LeafletModel';
import './LeafletView';

registerCoordinateSystem('leaflet', LeafletCoordSys);

registerAction(
  {
    type: 'leafletRoam',
    event: 'leafletRoam',
    update: 'updateLayout',
  },
  function(payload, ecModel) {
    ecModel.eachComponent('leaflet', function(leafletModel) {
      const leaflet = leafletModel.getLeaflet();
      const center = leaflet.getCenter();
      leafletModel.setCenterAndZoom(
        [center.lng, center.lat],
        leaflet.getZoom()
      );
    });
  }
);

export const version = '1.0.0';
