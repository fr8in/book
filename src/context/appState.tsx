import { useReducer } from 'react'
import {filterContext} from './index'
import {defaultGlobalFilter} from '../context/defaultState'
import globalFilterReducer from '../context/reducer'


const AppState = (props) => {
  
    const [state,dispatch] = useReducer(globalFilterReducer,defaultGlobalFilter)

return(
  <filterContext.Provider value={{state,dispatch}}>
        {props.children}
  </filterContext.Provider>
)
}

export default AppState