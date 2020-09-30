import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Router from 'next/router'
import { message } from 'antd'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyD_CyxvqMnr-xH0lhJfNGCkegLizGtaLfQ',
    authDomain: 'track-fr8.firebaseapp.com',
    databaseURL: 'https://track-fr8.firebaseio.com',
    projectId: 'track-fr8',
    storageBucket: 'track-fr8.appspot.com',
    messagingSenderId: '664491790520'
  })
}

const auth = (setAuthState) => {
  return firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      if (user.email.endsWith('@fr8.in')) {
        const token = await user.getIdToken()
        let idTokenResult = await user.getIdTokenResult()
        let hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims']
        console.log('hasuraClaim', hasuraClaim)
        console.log('user', user)

        if (hasuraClaim) {
          // @ts-ignore
          const roles = hasuraClaim['x-hasura-allowed-roles']
          // roles.include(account_manager)
          console.log('roles', roles)
          setAuthState({ status: 'in', user, token, roles })
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
            idTokenResult = await user.getIdTokenResult()
            hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims']
            console.log('hasuraClaimm', hasuraClaim)
            if (hasuraClaim) {
              setAuthState({ status: 'in', user, token })
            } else {
              await firebase.auth().signOut()
              setAuthState({ status: 'out' })
            }
          })
        }
      } else {
        await firebase.auth().signOut()
        setAuthState({ status: 'out' })
        message.error('Please use FR8 email id')
      }
    } else {
      setAuthState({ status: 'out' })
    }
  })
}

const provider = new firebase.auth.GoogleAuthProvider()
const signInWithGoogle = async () => {
  try {
    console.log('provicde', provider)
    await firebase.auth().signInWithPopup(provider)
  } catch (error) {
    console.log(error)
  }
}
const signOut = async () => {
  try {
    await firebase.auth().signOut()
    Router.push('/login')
  } catch (error) {
    console.log(error)
  }
}

const hasuraClaim = async (user, setAuthState) => {
  const token = await user.getIdToken()
  const idTokenResult = await user.getIdTokenResult()
  const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims']
  console.log('hasuraClaim', hasuraClaim)
  console.log('user', user)
  if (hasuraClaim) {
    // @ts-ignore
    setAuthState({ status: 'in', user, token })
    return true
  } else {
    return false
  }
}

export { auth, signInWithGoogle, signOut }
