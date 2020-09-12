/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

YellowBox.ignoreWarnings([
  'WebView',
  'useNativeDriver',
  'Calling `getNode()` on the ref of an Animated component is no longer necessary. You can now directly use the ref instead.',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation'
]);

AppRegistry.registerComponent(appName, () => App);

