import { StyleSheet } from 'react-native';

const MenuStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    headerSafeview: {
        flex: 0,
        backgroundColor: '#3A608C'
    },
    wrapUser: {
        flexDirection: "row",
        paddingHorizontal: 10,
        height: 120,
        backgroundColor: "#ACE6FF",
    },
    avatar: {
        borderColor: '#fff',
        borderRadius: 100,
        width: 64,
        height: 64,
        backgroundColor: '#fff',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    angle: {
        marginRight: 16,
        alignSelf: 'center',
    },
    changeClass: {
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapComponent: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        paddingLeft: 10,
    },
    txtComponent: {
        marginLeft: 20,
        fontSize: 14,
        flex: 1,
        fontFamily: 'Nunito-Bold',
        alignSelf: 'flex-start',
        lineHeight: 40,
        alignItems: 'center',
        marginTop: 6,
        color: '#4776AD'
    },
    wrapNew: {
        borderRadius: 50,
        paddingHorizontal: 5,
        backgroundColor: '#FF5353'
    },
    wrapEventDaily: {
        marginTop: 10,
    },
    styleImage: {
        marginHorizontal: 5,
        width: 16,
        height: 16,
        tintColor: '#4776AD'
    },
    textVersion: {
        alignSelf: 'center',
        marginHorizontal: 40,
        marginVertical: 20,
        color: '#999',
        fontSize: 11,
        fontFamily: 'Nunito-Regular'
    }
});

module.exports = MenuStyle;