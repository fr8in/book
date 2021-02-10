import { useReducer } from 'react'
import userContext from '../lib/userContaxt'
import filterContext from '../lib/filterContaxt'
import {defaultGlobalFilter} from '../context/defaultState'
import globalFilterReducer from '../context/reducer'


const AppState = (props) => {
    const {user} = props

    const [state,dispatch] = useReducer(globalFilterReducer,defaultGlobalFilter)

return(
  <filterContext.Provider value={{state,dispatch}}>
      <userContext.Provider value={user}>
        {props.children}
      </userContext.Provider>
  </filterContext.Provider>
)
}

export default AppState