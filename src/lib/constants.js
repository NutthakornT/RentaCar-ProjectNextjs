/** Shared business constants for the rental frontend (mock values for now). */
export const SERVICE_FEE = 25;
export const MILES_PER_DAY = 200;
export const PICKUP_LOCATIONS = [
  "Riverside Downtown",
  "Metro International Airport",
  "Harborfront Garage",
  "Uptown Station",
];

// Must match the CHECK constraints on public.cars in supabase/schema.sql.
export const CAR_TYPES = ["Sedan", "SUV", "Sports", "Luxury", "Electric", "Compact"];
export const TRANSMISSIONS = ["Automatic", "Manual"];
export const FUELS = ["Petrol", "Diesel", "Electric", "Hybrid"];
