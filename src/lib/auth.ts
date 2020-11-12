import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Router from 'next/router'
import { message } from 'antd'
import jwt from 'jsonwebtoken'
import moment from 'moment'

if (!firebase.apps.length) {
  const { API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_ID } = process.env
  firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_ID
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
  // let userId = decodedToken.user_id;
  const appendExpiry = expiryTime + '000'
  const parsing = parseInt(appendExpiry) - 600000 // expire time minus 10 minutes
  if ((moment().diff(moment(parsing))) >= 0) {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken(true)
        localStorage.setItem('token', token)
      }
    })
  }
}

export { auth, signInWithGoogle, signOut, refreshToken }
