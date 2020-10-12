import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Router from 'next/router'
import { message } from 'antd'
import jwt from 'jsonwebtoken'
import moment from 'moment'

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

        if (hasuraClaim) {
          // @ts-ignore
          const roles = hasuraClaim['x-hasura-allowed-roles']
          // roles.include(account_manager)
          console.log('roles', roles)
          localStorage.setItem('token', token)
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
              localStorage.setItem('token', token)
              const roles = hasuraClaim['x-hasura-allowed-roles']
              setAuthState({ status: 'in', user, token, roles })
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

const refreshToken = () => {
  const token = localStorage.getItem('token')
  const decodedToken = jwt.decode(token)
  const expiryTime = decodedToken.exp
  const currentTime = new Date().getTime()
  console.log('expiryToime', expiryTime)
  console.log('currentTime', currentTime)
  // let userId = decodedToken.user_id;
  const appendExpiry = expiryTime + '000'
  const parsing = parseInt(appendExpiry) - 120000 // expire time minus 2 minutes
  console.log('im out', (moment().diff(moment(parsing))) >= 0)
  if ((moment().diff(moment(parsing))) >= 0) {
    console.log('im in', (moment().diff(moment(parsing))) >= 0)

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken(true)
        localStorage.setItem('token', token)
      }
    })
  }
}

// const hasuraClaim = async (user, setAuthState) => {
//   const token = await user.getIdToken()
//   const idTokenResult = await user.getIdTokenResult()
//   const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims']
//   console.log('hasuraClaim', hasuraClaim)
//   console.log('user', user)
//   if (hasuraClaim) {
//     // @ts-ignore
//     setAuthState({ status: 'in', user, token })
//     return true
//   } else {
//     return false
//   }
// }

export { auth, signInWithGoogle, signOut, refreshToken }
