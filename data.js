import { devices } from "./energy_data.json";

export const rooms = Object.values(
  devices.reduce((rooms, device) => {
    if (rooms[device.room] === undefined) {
      rooms[device.room] = {
        name: device.room,
        consumption: [...device.consumption],
      };
    } else {
      for (let i = 0; i < device.consumption.length; i++)
        rooms[device.room].consumption[i] += device.consumption[i];
    }
    return rooms;
  }, {})
);

console.log(rooms);

export const totalConsumption = devices.reduce((prev, cur) => {
  if (prev.length <= 0) return [...cur.consumption];

  for (let i = 0; i < cur.consumption.length; i++)
    prev[i] += cur.consumption[i];

  return prev;
}, []);

export const getSankeyGraph = (hour) => ({
  nodes: [
    { node: 0, name: "total" },
    ...rooms.map((room, i) => ({
      node: i + 1,
      name: room.name,
    })),
    ...devices.map((device, i) => ({
      node: rooms.length + i + 1,
      name: device.name,
    })),
  ],
  links: [
    ...rooms.map((room, i) => ({
      target: 0,
      source: i + 1,
      value: room.consumption[hour],
    })),
    ...devices.map((device, i) => ({
      target: rooms.findIndex((r) => r.name === device.room) + 1,
      source: rooms.length + i + 1,
      value: device.consumption[hour],
    })),
  ],
});
