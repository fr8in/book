
import { useState } from 'react'
import { Row, Checkbox, Collapse } from 'antd'
import filterData from '../../../mock/globalFilter/filterData'
import filterGroup from '../../../mock/globalFilter/filterGroup'
const { Panel } = Collapse
const CheckBoxGroup = Checkbox.Group

const GlobalFilter = () => {
  const [globalException, setGlobalException] = useState(false)
  const callBack = () => {
    console.log('callback clicked')
  }
  const changeExeceptionStatus = () => {
    setGlobalException(prev => !prev)
  }
  const getFiltersList = (data) => {
    return data && data.length > 0 ? data.map(t => {
      return {
        label: <span>{t.filtername}{t.groupId !== 8 && <span className='filterCount'>{t.positiveTatCount + '/' + t.count}</span>}</span>,
        value: t.filterId,
        groupId: t.groupId
      }
    }) : []
  }
  return (
    <Row>
      <div>
        <Checkbox name='Exception' onChange={changeExeceptionStatus} defaultChecked={globalException === true}>
            Exception
        </Checkbox>
      </div>
      <Collapse defaultActiveKey={['1']} onChange={callBack} className='global-filter'>
        {filterData && filterData.length > 0 ? filterData.map(data => {
          const nonZeroList = data.groupList && data.groupList.length > 0 ? data.groupList.filter(t => t.count > 0) : []
          const zeroList = data.groupList && data.groupList.length > 0 ? data.groupList : []
          const filtersList = getFiltersList(data.groupId === 2 || data.groupId === 7 ? nonZeroList : zeroList)
          return (
            <Panel
              header={<span><b>{data.groupName}</b></span>}
              key={data.groupId}
              extra={<span className='clear' onClick={(e) => e.stopPropagation()}>CLEAR</span>}
            >
              <ul className='filterMenu'>
                <li>
                  {filtersList &&
                    <CheckBoxGroup
                      options={filtersList}
                      onChange={callBack}
                      value={data.groupId === 1 ? filterGroup[0].customerManagerFilter.filterId
                        : data.groupId === 2 ? filterGroup[1].connectedCitiesFilter.filterId
                          : data.groupId === 3 ? filterGroup[2].laneManagerFilter.filterId
                            : data.groupId === 4 ? filterGroup[3].partnerFilter.filterId
                              : data.groupId === 5 ? filterGroup[4].orderFilter.filterId
                                : data.groupId === 6 ? filterGroup[5].truckTypeFilter.filterId
                                  : data.groupId === 7 ? filterGroup[6].truckLaneFilter.filterId
                                    : filterGroup[7].trafficManager.filterId}
                    />}
                </li>
              </ul>
            </Panel>
          )
        }) : []}
      </Collapse>
    </Row>
  )
}

export default GlobalFilter
