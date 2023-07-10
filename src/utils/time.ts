import { _ } from "./number";

export const scaleTime = (
  data,
  type: "1M" | "5M" | "30M" | "1H" | "4H" | "1D" | "30D"
) => {
  if (type == "5M") {
    data = [
      ...data
        .reduce((map, log) => {
          const minutes = new Date(log.time * 1000).getMinutes();
          const hour = new Date(log.time * 1000).getHours();
          const day = new Date(log.time * 1000).getDate();
          const month = new Date(log.time * 1000).getMonth();
          const fullYear = new Date(log.time * 1000).getFullYear();
          if (
            map.has(
              `${Math.floor(minutes / 5)}-${hour}-${day}-${month}-${fullYear}`
            )
          ) {
            map
              .get(
                `${Math.floor(minutes / 5)}-${hour}-${day}-${month}-${fullYear}`
              )
              .push(log);
          } else {
            map.set(
              `${Math.floor(minutes / 5)}-${hour}-${day}-${month}-${fullYear}`,
              [log]
            );
          }
          return map;
        }, new Map())
        .values(),
    ];
  } else if (type == "30M") {
    data = [
      ...data
        .reduce((map, log) => {
          const minutes = new Date(log.time * 1000).getMinutes();
          const hour = new Date(log.time * 1000).getHours();
          const day = new Date(log.time * 1000).getDate();
          const month = new Date(log.time * 1000).getMonth();
          const fullYear = new Date(log.time * 1000).getFullYear();
          if (
            map.has(
              `${minutes < 30 ? 30 : 60}-${hour}-${day}-${month}-${fullYear}`
            )
          ) {
            map
              .get(
                `${minutes < 30 ? 30 : 60}-${hour}-${day}-${month}-${fullYear}`
              )
              .push(log);
          } else {
            map.set(
              `${minutes < 30 ? 30 : 60}-${hour}-${day}-${month}-${fullYear}`,
              [log]
            );
          }
          return map;
        }, new Map())
        .values(),
    ];
  } else if (type == "1H") {
    data = [
      ...data
        .reduce((map, log) => {
          const hour = new Date(log.time * 1000).getHours();
          const day = new Date(log.time * 1000).getDate();
          const month = new Date(log.time * 1000).getMonth();
          const fullYear = new Date(log.time * 1000).getFullYear();
          if (map.has(`${hour}-${day}-${month}-${fullYear}`)) {
            map.get(`${hour}-${day}-${month}-${fullYear}`).push(log);
          } else {
            map.set(`${hour}-${day}-${month}-${fullYear}`, [log]);
          }
          return map;
        }, new Map())
        .values(),
    ];
  } else if (type == "4H") {
    data = [
      ...data
        .reduce((map, log) => {
          const hour = new Date(log.time * 1000).getHours();
          const day = new Date(log.time * 1000).getDate();
          const month = new Date(log.time * 1000).getMonth();
          const fullYear = new Date(log.time * 1000).getFullYear();
          if (map.has(`${Math.floor(hour / 4)}-${day}-${month}-${fullYear}`)) {
            map
              .get(`${Math.floor(hour / 4)}-${day}-${month}-${fullYear}`)
              .push(log);
          } else {
            map.set(`${Math.floor(hour / 4)}-${day}-${month}-${fullYear}`, [
              log,
            ]);
          }
          return map;
        }, new Map())
        .values(),
    ];
  } else if (type == "1D") {
    data = [
      ...data
        .reduce((map, log) => {
          const day = new Date(log.time * 1000).getDate();
          const month = new Date(log.time * 1000).getMonth();
          const fullYear = new Date(log.time * 1000).getFullYear();
          if (map.has(`${day}-${month}-${fullYear}`)) {
            map.get(`${day}-${month}-${fullYear}`).push(log);
          } else {
            map.set(`${day}-${month}-${fullYear}`, [log]);
          }
          return map;
        }, new Map())
        .values(),
    ];
  } else if (type == "30D") {
    data = [
      ...data
        .reduce((map, log) => {
          const month = new Date(log.time * 1000).getMonth();
          const fullYear = new Date(log.time * 1000).getFullYear();
          if (map.has(`${month}-${fullYear}`)) {
            map.get(`${month}-${fullYear}`).push(log);
          } else {
            map.set(`${month}-${fullYear}`, [log]);
          }
          return map;
        }, new Map())
        .values(),
    ];
  }

  return data.map((list) => {
    const value = {
      jetton_id: 0,
      jetton_volume: 0,
      volume: 0,
      price_close: 0,
      price_high: 0,
      price_low: 0,
      price_open: 0,
      source: "",
      time: 0,
    };

    if (Array.isArray(list)) {
      list.forEach((item) => {
        value.jetton_volume += _(item.pair1_volume);
        value.volume += _(item.pair2_volume);
        value.price_high =
          _(item.price_high) >= value.price_high
            ? _(item.price_high)
            : value.price_high;
        value.price_low =
          !value.price_low || _(item.price_low) <= value.price_low
            ? _(item.price_low)
            : value.price_low;
      });
    } else {
      return list;
    }

    if (list) {
      value.source = list[0].source;
      value.time = list[0].time;
      value.jetton_id = list[0].jetton_id;
      value.price_open += _(list[0].price_open);
      value.price_close += _(list[list.length - 1].price_close);
    }

    return value;
  });
};

export function nearestDate(dates, target) {
  if (!target) {
    target = Date.now();
  } else if (target instanceof Date) {
    target = target.getTime();
  }

  let nearest = Infinity;
  let winner = -1;

  dates.forEach(function (date) {
    if (date instanceof Date) {
      date = date.getTime();
    }
    const distance = Math.abs(date - target);
    if (distance < nearest) {
      nearest = distance;
      winner = date;
    }
  });

  return winner;
}
