import React, { createContext, useState } from 'react'
import auth from '@react-native-firebase/auth'
import {
  Alert
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    return(
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, pass) => {
                    try{
                        await auth().signInWithEmailAndPassword(email, pass)
                        .then()
                        .catch(error => { 
                            Alert.alert('Error','User Not Found or Incorrect Credentials')
                        })
                    } catch(e){
                        Alert.alert('Error','Login Failed')
                    }
                },
                googleLogin: async () => {
                    // Get the users ID token
                    const { idToken } = await GoogleSignin.signIn();

                    // Create a Google credential with the token
                    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                    // Sign-in the user with the credential
                    return auth().signInWithCredential(googleCredential);
                },
                logout: async () => {
                    try {
                        try{
                            await GoogleSignin.revokeAccess();
                            await GoogleSignin.signOut();
                            auth()
                            .signOut()
                            .then(() => alert('Your are signed out!'));
                        } catch (e){
                            auth()
                            .signOut()
                            .then(() => alert('Your are signed out!'));
                        }
                    } catch (error) {
                        console.error(error);
                    }
                },
                register: async (email, pass) => {
                    try{
                        await auth().createUserWithEmailAndPassword(email, pass)
                    } catch(e){
                        console.log('Hello'+e)
                    }
                },
                // logout: async () => {
                //     try{
                //         await auth().signOut()
                //     } catch(e){
                //         console.log('Hello'+e)
                //     }
                // }
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}