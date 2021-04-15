import Mixpanel from 'react-native-mixpanel';
import Common from './Common';

class AnalyticsManager {
    constructor() {
        this.mixpanel = callback => Mixpanel.sharedInstanceWithToken(Common.MixpanelToken)
            .then(() => callback())
            .catch(error => console.log('Failed to initialize Mixpanel: ', error));
    }

    /*
    Send and event name with no properties
        event: string
     */
    track = async (event) => {
        if(!__DEV__){
            this.mixpanel(() => Mixpanel.track(event));
        }
    };

    reset = async () => {
        this.mixpanel(() => Mixpanel.reset());
    }

    /*
    Track event with properties
        event: string
        properties: Object
     */
    trackWithProperties = async (event, properties) => {
        if (!__DEV__) {
            this.mixpanel(() => Mixpanel.trackWithProperties(event, properties));
        }
    };

    /*
    Get the last distinct id set with identify or, if identify hasn't been
    called, the default mixpanel id for this device, e.g getDistinctId(function(id){})
        id: Function
     */
    getDistinctId = async (callback) => {
        this.mixpanel(() => Mixpanel.getDistinctId(callback));
    };

    //TODO: add docs (no docs in davodesign84/react-native-mixpanel)
    getSuperProperty = async (propertyName, callback) => {
        this.mixpanel(() => Mixpanel.getSuperProperty(propertyName, callback));
    };

    //TODO: add docs (no docs in davodesign84/react-native-mixpanel)
    flush = async () => {
        this.mixpanel(() => Mixpanel.flush());
    };


    //TODO: add docs (no docs in davodesign84/react-native-mixpanel)
    disableIpAddressGeolocalization = async () => {
        this.mixpanel(() => Mixpanel.disableIpAddressGeolocalization());
    };


    /*
    Create Alias from unique id, i.e. create a new mixpanel profile:
    to call when a user signs up, with a unique id that is not used
    by another mixpanel profile as param
        alias: string
     */
    createAlias = async (alias) => {
        this.mixpanel(() => Mixpanel.createAlias(alias));
    };


    /*
    Identify, i.e. associate to an existing mixpanel profile:
    to call when a user logs in and is already registered in Mixpanel
    with this unique id
     */
    identify = async (userId) => {
        this.mixpanel(() => Mixpanel.identify(userId));
    };


    /*
    Sets the start time for an action, for example uploading an image:
        timeEvent("Image Upload");
    to be followed by a tracking event to define the end time:
        track("Image Upload");

        event: string
     */
    timeEvent = async (event) => {
        this.mixpanel(() => Mixpanel.timeEvent(event));
    };


    /*
    Register super properties
        properties: Object
     */
    registerSuperProperties = async (properties) => {
        this.mixpanel(() => Mixpanel.registerSuperProperties(properties));
    };

    /*
    Register super properties Once
     */
    registerSuperPropertiesOnce = async (properties) => {
        this.mixpanel(() => Mixpanel.registerSuperPropertiesOnce(properties));
    };


    /*
    Android-only
    tell Mixpanel which user record in People Analytics should receive
    the messages when they are sent from the Mixpanel app,
    make sure you call this right after you call `identify`
     */
    initPushHandling = async (token) => {
        this.mixpanel(() => Mixpanel.initPushHandling(token));
    };


    /*
    Set People properties (warning: if no mixpanel profile has been assigned
    to the current user when this method is called, it will automatically
    create a new mixpanel profile and the user will no longer be anonymous in Mixpanel)
     */
    set = async (properties) => {
        if (properties && properties.Role && properties.Role != '' && !__DEV__) {
            this.mixpanel(() => Mixpanel.set(properties));
        }
    };


    /*
    Set People Properties Once (warning: if no mixpanel profile has been assigned
    to the current user when this method is called, it will automatically
    create a new mixpanel profile and the user will no longer be anonymous in Mixpanel)
     */
    setOnce = async (properties) => {
        this.mixpanel(() => Mixpanel.setOnce(properties));
    };


    //TODO: add docs (no docs in davodesign84/react-native-mixpanel)
    removePushDeviceToken = async (deviceToken) => {
        this.mixpanel(() => Mixpanel.removePushDeviceToken(deviceToken));
    };


    //TODO: add docs (no docs in davodesign84/react-native-mixpanel)
    removeAllPushDeviceTokens = async () => {
        this.mixpanel(() => Mixpanel.removeAllPushDeviceTokens());
    };


    /*
    Track Revenue
        charge: Number
     */
    trackCharge = async (charge) => {
        this.mixpanel(() => Mixpanel.trackCharge(charge));
    };


    /*
    Track Revenue with properties
        charge: Number
        properties: Object
     */
    trackChargeWithProperties = async (charge, properties) => {
        this.mixpanel(() => Mixpanel.trackChargeWithProperties(charge, properties));
    };


    /*
    increment property
        propertyName: string
        by: Number
     */
    increment = async (propertyName, by) => {
        this.mixpanel(() => Mixpanel.increment(propertyName, by));
    };


    //TODO: add docs (no docs in davodesign84/react-native-mixpanel)
    union = async (name, properties) => {
        this.mixpanel(() => Mixpanel.union(name, properties));
    };


    /*
    iOS-only
    Add device token for push notifications
        token: string
     */
    addPushDeviceToken = async (token) => {
        this.mixpanel(() => Mixpanel.addPushDeviceToken(token));
    };

}

export default new AnalyticsManager();