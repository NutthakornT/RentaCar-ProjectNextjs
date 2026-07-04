/**
 * Shared JSDoc typedefs. This project is JavaScript, so these serve as
 * editor-level documentation of the data shapes rather than compile-time types.
 *
 * @typedef {"Sedan"|"SUV"|"Sports"|"Luxury"|"Electric"|"Compact"} CarType
 * @typedef {"Automatic"|"Manual"} Transmission
 * @typedef {"Petrol"|"Diesel"|"Electric"|"Hybrid"} Fuel
 *
 * @typedef {Object} Car
 * @property {string} id
 * @property {string} name
 * @property {string} brand
 * @property {CarType} type
 * @property {number} price_per_day
 * @property {string} description
 * @property {Transmission} transmission
 * @property {Fuel} fuel
 * @property {number} seats
 * @property {number} [doors]
 * @property {number} [year]
 * @property {number} [rating]
 * @property {number} [reviews_count]
 * @property {string} image_url
 * @property {boolean} available
 * @property {string} [tagline]
 * @property {string[]} [features]
 * @property {number} [gallery] - number of gallery frames to render as placeholders
 *
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {number} rating
 * @property {string} quote
 *
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string|null} avatar_url
 * @property {"admin"|"customer"} role
 * @property {string} joined
 * @property {number} [bookings_count]
 *
 * @typedef {"confirmed"|"active"|"completed"|"cancelled"} BookingStatus
 *
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} user_id
 * @property {string} [customer_name]
 * @property {string} car_id
 * @property {string} [car_name]
 * @property {string} pickup_date
 * @property {string} return_date
 * @property {number} total_price
 * @property {BookingStatus} status
 * @property {string} [pickup_location]
 * @property {string} [phone]
 * @property {string|null} [notes]
 *
 * @typedef {Object} CarFilters
 * @property {string} [q]
 * @property {CarType} [type]
 * @property {Transmission} [transmission]
 * @property {Fuel} [fuel]
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {number} [seats]
 * @property {string} [sort]
 */

// เพิ่มReview type definition
/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} user_id
 * @property {string} car_id
 * @property {string|null} [booking_id]
 * @property {number} rating
 * @property {string|null} [comment]
 * @property {string} created_at
 * @property {string} [author_name]
 * @property {string} [car_name]
 */
export {};
