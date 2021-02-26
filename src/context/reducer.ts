import {defaultGlobalFilter} from './defaultState'
import { REGION_FILTER, BRANCHES_FILTER, CITIES_FILTER, MANAGER_FILTER, TRUCK_TYPE_FILTER,SPEED_FILTER} from './action'

const globalFilter = (state = defaultGlobalFilter, action) => {
    const { type, payload } = action
    switch (type) {
        case REGION_FILTER:
            return {
                ...state,
                regions: payload
            }
            case BRANCHES_FILTER:
                return {
                    ...state,
                    branches: payload
                }
                case CITIES_FILTER:
                    return {
                        ...state,
                        cities: payload
                    }
                    case MANAGER_FILTER:
                        return {
                            ...state,
                            managers: payload
                        }
                        case TRUCK_TYPE_FILTER:
                            return {
                                ...state,
                                types: payload
                            }
                            case SPEED_FILTER:
                            return {
                                ...state,
                                speed: payload
                            }
                            default:
                                return state
        
    }
}
export default globalFilter;