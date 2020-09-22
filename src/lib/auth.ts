import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Router from 'next/router'




if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyD_CyxvqMnr-xH0lhJfNGCkegLizGtaLfQ',
    authDomain: 'track-fr8.firebaseapp.com',
    databaseURL: 'https://track-fr8.firebaseio.com',
    projectId: 'track-fr8',
    storageBucket: 'track-fr8.appspot.com',
    messagingSenderId: '664491790520',
  });}

const auth =  (setAuthState) => {
        return firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                const token = await user.getIdToken();
                const idTokenResult = await user.getIdTokenResult();
                const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims'];
                if (hasuraClaim) {
                    // @ts-ignore
                    setAuthState({ status: 'in', user, token })
                } else {
                    // Check if refresh is required.
                    const metadataRef = firebase
                        .database()
                        .ref('metadata/' + user.uid + '/refreshTime')

                    metadataRef.on('value', async data => {
                        if (!data.exists) {
                            return
                        }
                        const token = await user.getIdToken(true)
                        // @ts-ignore
                        setAuthState({ status: 'in', user, token })
                    })
                }
            } else {
                setAuthState({ status: 'out' })
            }
        })}
        const provider = new firebase.auth.GoogleAuthProvider();
        const signInWithGoogle = async () => {
            try {
                await firebase.auth().signInWithPopup(provider)
            } catch (error) {
                console.log(error)
            }
        }
        const signOut = async () => {
            try {
              await firebase.auth().signOut();
              Router.push('/login')
        
            } catch (error) {
              console.log(error)
            }
          };



export  {auth,signInWithGoogle,signOut}
