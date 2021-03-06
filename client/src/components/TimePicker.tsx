import { Dayjs } from "dayjs";
import * as React from "react";
import { PickerTimeProps } from "antd/es/date-picker/generatePicker";
import { Omit } from "antd/es/_util/type";
import DatePicker from "./DatePicker";

export interface TimePickerProps
  extends Omit<PickerTimeProps<Dayjs>, "picker"> {}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => (
  <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

TimePicker.displayName = "TimePicker";

export default TimePicker;
