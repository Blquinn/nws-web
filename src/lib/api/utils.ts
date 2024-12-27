import moment from "moment";
import type { PropertyValue, UnitOfMeasure } from "./models";


interface pl {
  uom?: UnitOfMeasure,
  values: PropertyValue[],
}

// Re-indexes property list on an hourly interval
export function transformPropertyList(propertyList?: pl): pl | undefined {
  if (propertyList == null) return undefined;

  if (propertyList.values.length == 0) {
    return propertyList;
  }

  const currentHour = moment().startOf('hour');

  // Find first value
  var valuesIdx = propertyList.values.findLastIndex((v) =>
    currentHour.isSameOrAfter(v.validTime.startTime));

  if (valuesIdx < 0) {
    valuesIdx = 0;
  }

  const endTime = propertyList.values[propertyList.values.length - 1].validTime.startTime
    .add(propertyList.values[propertyList.values.length - 1].validTime.duration);

  const newValues: PropertyValue[] = []

  let time = currentHour;
  while (time.isBefore(endTime) || time.isSame(endTime)) {
    let val = propertyList.values[valuesIdx];

    // Move index to next value it applies to the current time.
    while (valuesIdx + 1 < propertyList.values.length &&
      (propertyList.values[valuesIdx + 1].validTime.startTime
        .isBefore(time) ||
        propertyList.values[valuesIdx + 1].validTime.startTime
          .isSame(time))) {
      val = propertyList.values[valuesIdx + 1];
      valuesIdx++;
    }

    newValues.push(
      {
        validTime: {
          startTime: time.clone(),
          duration: moment.duration(1, 'hour'),
        },
        value: val.value,
      },
    );

    time = time.add(moment.duration(1, 'hour'));
  }

  return { uom: propertyList.uom, values: newValues };
}
