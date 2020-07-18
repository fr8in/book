import React from "react";
import { Row, Col, Switch, Space } from "antd";
import LabelWithData from "../common/labelWithData";
import fuelDetail from "../../../mock/card/fuelCard";
export default function partnerfuelDetail() {
  return (
    <div>
      <Row gutter={15}>
        <Col xs={24} sm={24} md={24}>
          <LabelWithData
            label="Card ID"
            data={
              <Space>
                <span>{fuelDetail.id}</span>
              </Space>
            }
            labelSpan={10}
            dataSpan={14}
          />
          <LabelWithData
            label="Card Number"
            data={
              <Space>
                <span>{fuelDetail.cardNumber}</span>
              </Space>
            }
            labelSpan={10}
            dataSpan={14}
          />
          <LabelWithData
            label="Balance"
            data={
              <Space>
                <span>{fuelDetail.balance}</span>
              </Space>
            }
            labelSpan={10}
            dataSpan={14}
          />
          <LabelWithData
            label=" Linked Mobile"
            data={
              <Space>
                <span>{fuelDetail.mobileNo}</span>
              </Space>
            }
            labelSpan={10}
            dataSpan={14}
          />
          <LabelWithData
            label="Status"
            data={
              <Space>
                <Switch size="small" defaultChecked />
              </Space>
            }
            labelSpan={10}
            dataSpan={14}
          />
        </Col>
      </Row>
    </div>
  );
}
