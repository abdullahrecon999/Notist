import React, { useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { TabView, TabBar } from 'react-native-tab-view';
import { LoginRoute } from '../Screens/login';
import { SignupRoute } from '../Screens/signup';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const image = {
  uri: 'https://theabbie.github.io/blog/assets/official-whatsapp-background-image.jpg',
};

const initialLayout = { width: Dimensions.get('window').width };

// const renderScene = SceneMap({
//   first: <LoginRoute/>,
//   second: SignupRoute,
// });

// const renderScene = ({ route, navigation }) => {
//   switch (route.key) {
//     case 'first':
//       return <LoginRoute navigation={navigation} />;
//     case 'second':
//       return <SignupRoute navigation={navigation} />;
//     default:
//       return null;
//   }
// };

export function AuthStack({ navigation }) {

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Login' },
    { key: 'second', title: 'Register' },
  ]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '49900173854-o7ik4ado3dpus9nsu48ttcii4ruimdiv.apps.googleusercontent.com',
    });
  }, [])
  

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#6DDD9D' }}
      style={{ backgroundColor: '#FAF8FF', height:45, justifyContent:"center", borderTopLeftRadius:24, borderTopRightRadius:24 }}
      labelStyle={{ backgroundColor:'#000000', color:'#000000' }}
      renderLabel={({ route, focused, color }) => (
        <Text style={focused ? {color:'#000000', fontSize:19 }:{color:'#0000008F', fontSize:19 }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.overlay}>
          <View
            style={{
              borderWidth: 0,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Shadow distance={15} offset={[3, 8]}>
              <View style={styles.logo}>
                <Image
                  style={styles.logo}
                  source={require('../assets/Notist.png')}
                />
              </View>
            </Shadow>
          </View>

          <View style={{ borderWidth: 0, flex: 3, paddingLeft:5, paddingRight:5 }}>
            <KeyboardAvoidingView behavior='height' style={{ flex: 3 }}>
                <TabView
                  navigationState={{ index, routes }}
                  onIndexChange={setIndex}
                  initialLayout={initialLayout}
                  style={styles.tabContainer}
                  renderTabBar={renderTabBar}
                  renderScene={({ route }) => {
                    switch (route.key) {
                      case 'first':
                        return <LoginRoute navigation={navigation} />;
                      case 'second':
                        return <SignupRoute navigation={navigation} />;
                      default:
                        return null;
                    }
                  }}
                />
            </KeyboardAvoidingView>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  tabContainer:{
    backgroundColor: '#FAF8FF',
    borderTopLeftRadius:24,
    borderTopRightRadius:24,
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
    marginBottom:20,
    elevation:5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    opacity: 1,
  },
  logo: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    // elevation: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#33ad76c0',
  },
  scene: {
    flex: 1,
    height:'100%',
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
    paddingLeft:10,
    paddingRight:10,
  },
  panel: {
    flex: 1,
    paddingTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    paddingBottom: 1,
    backgroundColor: '#FAF8FF',
    borderWidth: 1,
    height: '95%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
  },
});
