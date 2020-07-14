import { Tabs } from 'antd';

import React from 'react'
const { TabPane } = Tabs;
export default function document() {
    return (
        <div>
            <Tabs type="card">
      <TabPane tab="Main" key="1">
        <p>Main</p>
        
      </TabPane>
      <TabPane tab="Sub Company" key="2">
        <p>Company</p>
       
      </TabPane>
            </Tabs>
        </div>
    )
}
