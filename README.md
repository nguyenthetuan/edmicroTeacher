#### Run Android
```
yarn install
```

##### using npx

```js
npx react-native run-android --variant=devDebug
npx react-native run-android --variant=stagingDebug
npx react-native run-android --variant=prodDebug
```

##### no use npx

```ruby
react-native run-android --variant=devDebug
react-native run-android --variant=stagingDebug
react-native run-android --variant=prodDebug
```

#### Build Android

```js
cd android & ./gradlew assembleDevRelease
cd android & ./gradlew assembleStagingRelease
cd android & ./gradlew assembleProdRelease
```

##### Build all

```js
cd android & ./gradlew assembleRelease
```

#### Run Ios
```
yarn install
pod install
```
```
yarn ios --schema SchoolDev --configuation debugDev --simulator = "iPhone 11 pro"
yarn ios --schema SchoolStaging --configuation debugStaging --simulator = "iPhone 11 pro" 
yarn ios --schema SchoolProd --configuation debugProd --simulator = "iPhone 11 pro"  
```


#### Configs
##### android
-gradle.propeties
```ruby
org.gradle.daemon=true
# org.gradle.jvmargs=-Xmx2560m
org.gradle.jvmargs=-Xmx8192m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -noverify
org.gradle.parallel=true

FLIPPER_VERSION=0.41.0
```