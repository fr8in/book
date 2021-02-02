import { Tooltip, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import get from "lodash/get";
import _ from "lodash";
import isEmpty from "lodash/isEmpty";
import CopyToClipboard from "react-copy-to-clipboard";

const TrucksList = (props) => {
  const { branches } = props;

  const branch_data = !isEmpty(branches)
    ? branches.map((branch) => {
        const truck_types = _.chain({ data: branch })
          .flatMap("connected_cities")
          .flatMap("cities")
          .flatMap("trucks")
          .groupBy("truck_type.code")
          .value();
        return {
          name: branch.name,
          truck_types: truck_types,
        };
      })
    : [];

  const getMessage = (branch_data) => {
    let message = "";
    message = branch_data.map((branch) => {
      message = `FR8 Trucks available at ${branch.name}\n\n`;
      Object.entries(branch.truck_types).map(([key, value]) => {
        message += `${key}\n\n`;
        let i = 1;
        const sorted_data = value.sort((a, b) => b.tat - a.tat);
        sorted_data.map((truck) => {
          message += `${i++}) ${get(truck, 'partner.name')}\n`
          message += `${truck.truck_no} - ${get(truck, 'tat')} hrs\n`
          message += `O: ${get(truck, 'partner.partner_users[0].mobile','-') } / D: ${get(truck, 'driver.mobile','-') }\n`
          message += `City: ${truck.city.name}\n\n`
        });
      });
      return message;
    });
    return message.join(" ").trim();
  };

  const onCopy = () => {
    message.success("Copied!!");
  };

  return (
    <CopyToClipboard text={getMessage(branch_data)} onCopy={onCopy}>
      <Tooltip title="click to copy message">
        <Button
          size="small"
          shape="circle"
          type="primary"
          icon={<CopyOutlined />}
        />
      </Tooltip>
    </CopyToClipboard>
  );
};
export default TrucksList;
