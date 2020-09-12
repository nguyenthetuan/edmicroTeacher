/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 04:22:46
 * @modify date 2018-04-17 04:22:46
 * @desc [description]
*/

import * as Types from '../constants/type';

export const displayPackageModalAction = (visible) => ({ type: Types.DISPLAY_PACKAGE_MODAL_ACTION, visible: visible });

export const displayInputPhoneAction = () => ({ type: Types.DISPLAY_INPUT_PHONE_ACTION });

export const showResultConfirmAction = () => ({ type: Types.DISPLAY_RESULT_CONFIRM_ACTION });

export const upgradePhoneAction = (payload) => ({ type: Types.UPGRADE_PHONE_NOW_ACTION, payload })

export const displayWarningModalAction = (visible) => ({ type: Types.DISPLAY_WARNING_MODAL_ACTION, visible })
