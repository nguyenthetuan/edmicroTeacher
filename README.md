#### Run Android
- before script
    ```
    yarn install
    ```

- script

    ```js
    npx react-native run-android --variant=devDebug
    npx react-native run-android --variant=stagingDebug
    npx react-native run-android --variant=prodDebug
    ```

#### Build Android
- script
    ```js
    cd android & ./gradlew assembleDevRelease
    cd android & ./gradlew assembleStagingRelease
    cd android & ./gradlew assembleProdRelease
    ```

##### Build all
- script
    ```js
    cd android & ./gradlew assembleRelease
    ```

#### Run Ios
- before script
    ```
    yarn install
    pod install
    ```
    ```
    npx react-native run-ios --scheme school --configuration DebugDev --simulator="iPhone 8"
    npx react-native run-ios --scheme school --configuration DebugStaging --simulator="iPhone 8"
    npx react-native run-ios --scheme school --configuration DebugProd --simulator="iPhone 8"
    ```


#### Configs
##### android
- gradle.propeties
    ```ruby
    org.gradle.daemon=true
    org.gradle.jvmargs=-Xmx8192m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -noverify
    org.gradle.parallel=true
    FLIPPER_VERSION=0.41.0
    ```


#### Fix Image Xcode 12
- (void)displayLayer:(CALayer *)layer
{
  if (_currentFrame) {
    layer.contentsScale = self.animatedImageScale;
    layer.contents = (__bridge id)_currentFrame.CGImage;
  }else {
      [super displayLayer:layer];
  }
}
