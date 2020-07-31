import { Card } from "antd";
import LabelData from "../../components/common/labelData";

const AvailableBalance = (props) => {
  return (
    <Card size="small">
      <LabelData label="Wallet" value={props.wallet || 0} />
      <LabelData label="Fuel Card" value={props.fuel} />
      <LabelData label="FasTag" value={props.fasTag} />
    </Card>
  );
};

export default AvailableBalance;
