import NetInfo from "@react-native-community/netinfo";

const checkConnection = () => {
    NetInfo.fetch().then((connectionInfo) => {
        console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    });
}

module.exports = {
    checkConnection
}