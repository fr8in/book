import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Router from 'next/router'
import { message } from 'antd'
import jwt from 'jsonwebtoken'
import moment from 'moment'


if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ID
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
  if(token){
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
}

export { auth, signInWithGoogle, signOut, refreshToken }
