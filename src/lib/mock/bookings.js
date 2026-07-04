/**
 * Mock bookings. Shape mirrors the planned `bookings` table
 * (id, user_id, car_id, pickup_date, return_date, total_price, status)
 * plus denormalized display fields (customer_name, car_name) for admin tables.
 * status: "confirmed" | "active" | "completed" | "cancelled"
 * @typedef {import("@/types").Booking} Booking
 * @type {Booking[]}
 */
export const bookings = [
  {
    id: "BK-2041",
    user_id: "u_1003",
    customer_name: "Elena Rossi",
    car_id: "mercedes-s-class",
    car_name: "Mercedes-Benz S 500 Sedan",
    pickup_date: "2026-07-08",
    return_date: "2026-07-12",
    total_price: 1196,
    status: "confirmed",
  },
  {
    id: "BK-2040",
    user_id: "u_1001",
    customer_name: "Sophia Nguyen",
    car_id: "tesla-model-3",
    car_name: "Tesla Model 3 Long Range",
    pickup_date: "2026-07-02",
    return_date: "2026-07-06",
    total_price: 476,
    status: "active",
  },
  {
    id: "BK-2039",
    user_id: "u_1006",
    customer_name: "James Carter",
    car_id: "audi-etron-gt",
    car_name: "Audi e-tron GT quattro",
    pickup_date: "2026-06-24",
    return_date: "2026-06-27",
    total_price: 807,
    status: "completed",
  },
  {
    id: "BK-2038",
    user_id: "u_1002",
    customer_name: "Marcus Bennett",
    car_id: "ford-mustang",
    car_name: "Ford Mustang GT Convertible",
    pickup_date: "2026-06-20",
    return_date: "2026-06-23",
    total_price: 567,
    status: "completed",
  },
  {
    id: "BK-2037",
    user_id: "u_1005",
    customer_name: "Hannah Schmidt",
    car_id: "honda-crv",
    car_name: "Honda CR-V EX-L",
    pickup_date: "2026-07-15",
    return_date: "2026-07-20",
    total_price: 445,
    status: "confirmed",
  },
  {
    id: "BK-2036",
    user_id: "u_1004",
    customer_name: "David Okafor",
    car_id: "bmw-x5",
    car_name: "BMW X5 xDrive40i",
    pickup_date: "2026-06-10",
    return_date: "2026-06-14",
    total_price: 556,
    status: "cancelled",
  },
  {
    id: "BK-2035",
    user_id: "u_1003",
    customer_name: "Elena Rossi",
    car_id: "porsche-911",
    car_name: "Porsche 911 Carrera",
    pickup_date: "2026-05-30",
    return_date: "2026-06-01",
    total_price: 698,
    status: "completed",
  },
];
