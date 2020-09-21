import * as Types from '../constants/type';

export const displayPackageModalAction = (visible) => ({ type: Types.DISPLAY_PACKAGE_MODAL_ACTION, visible: visible });

export const displayInputPhoneAction = () => ({ type: Types.DISPLAY_INPUT_PHONE_ACTION });

export const showResultConfirmAction = () => ({ type: Types.DISPLAY_RESULT_CONFIRM_ACTION });

export const upgradePhoneAction = (payload) => ({ type: Types.UPGRADE_PHONE_NOW_ACTION, payload })

export const displayWarningModalAction = (visible) => ({ type: Types.DISPLAY_WARNING_MODAL_ACTION, visible })
