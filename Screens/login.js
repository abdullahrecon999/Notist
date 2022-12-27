import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HorizontalRule, InputField } from '../Components/UIessentials';
import * as yup from 'yup'
import { Formik } from 'formik'
import { AuthContext } from '../Navigation/AuthProvider';

export const LoginRoute = ({ navigation }) => {
    
  const {login, googleLogin} = useContext(AuthContext)

    return(  
        <Formik
          initialValues={{ 
            email: '', 
            password: '' 
          }}
          onSubmit={values => login(values.email, values.password)}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email('Invalid Email')
              .required('Email is a required Field'),
            password: yup
              .string()
              .min(6)
              .max(10, 'Password should not exceed 10 chars')
              .required('Password is a required Field'),
          })}
       >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View style={[styles.scene, { backgroundColor: '#FAF8FF', flexDirection:"column", alignItems:"center", justifyContent:"space-evenly", paddingTop:5 }]}>

            <InputField
              onChangeText={handleChange('email')}
              value={values.email}
              placeholder="Enter Email" 
              icon1='email-outline' 
              onBlur={() => setFieldTouched('email')}
              error={errors.email}
              label='Email' />

            <InputField 
              onChangeText={handleChange('password')}
              onBlur={() => setFieldTouched('password')}
              value={values.password}
              pass={true}
              placeholder="Enter Password" 
              icon1='account-key-outline' 
              error={errors.password}
              label='Password' />

        <HorizontalRule title="Login Using" width={120} />
        <View style={{height:'15%', borderWidth:0, width:'75%', flexDirection:"row", justifyContent:"space-around"}}>
          <View>
            <Icon.Button
              name="login-variant"
              backgroundColor="#005AA2"
              onPress={handleSubmit}
              style={{paddingRight:0}}
              size={40}
              borderRadius={50}
              iconStyle={{marginRight:9}}
              >
            </Icon.Button>
          </View>
          <View>
            <Icon.Button
              name="google"
              backgroundColor="#EA4335"
              onPress={() => googleLogin()}
              style={{paddingRight:0}}
              size={40}
              borderRadius={50}
              iconStyle={{marginRight:9}}
              >
            </Icon.Button>
          </View>
        </View>
      </View>
      )}
      </Formik>
    );
  };

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    height:'100%',
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
    paddingLeft:10,
    paddingRight:10,
  },
});