import { ADMIN_CONFIG_UPDATE_SUCCESS } from '../actions/admin';
import {
  SOAPBOX_CONFIG_REQUEST_SUCCESS,
  SOAPBOX_CONFIG_REQUEST_FAIL,
} from '../actions/soapbox';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import { ConfigDB } from 'soapbox/utils/config_db';

const initialState = ImmutableMap();

const fallbackState = ImmutableMap({
  brandColor: '#0482d8', // Azure
});

const updateFromAdmin = (state, config) => {
  const configs = config.get('configs', ImmutableList());

  try {
    return ConfigDB.find(configs, ':pleroma', ':frontend_configurations')
      .get('value')
      .find(value => value.getIn(['tuple', 0]) === ':soapbox_fe')
      .getIn(['tuple', 1]);
  } catch {
    return state;
  }
};

export default function soapbox(state = initialState, action) {
  switch(action.type) {
  case SOAPBOX_CONFIG_REQUEST_SUCCESS:
    return fromJS(action.soapboxConfig);
  case SOAPBOX_CONFIG_REQUEST_FAIL:
    return fallbackState.mergeDeep(state.get('soapbox'));
  case ADMIN_CONFIG_UPDATE_SUCCESS:
    return updateFromAdmin(state, fromJS(action.config));
  default:
    return state;
  }
};
