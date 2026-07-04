"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CAR_TYPES, TRANSMISSIONS, FUELS } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

const initialState = { error: null };

/**
 * Admin car form, shared by "add car" and "edit car". Submits via a Server
 * Action (`action`), which validates against the same constraints as the
 * `cars` table — RLS requires the caller to be an admin. When `car` is
 * passed, fields are prefilled and a hidden `id` input is included so the
 * action knows which row to update.
 * @param {{ action: (prevState: any, formData: FormData) => Promise<any>, car?: import("@/types").Car, submitLabel?: string, pendingLabel?: string }} props
 */
export function CarForm({ action, car, submitLabel = "Add car", pendingLabel = "Adding car…" }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const featuresDefault = car?.features?.join(", ") ?? "";

  return (
    <form action={formAction} className="space-y-6">
      {car && <input type="hidden" name="id" value={car.id} />}

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Basics</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Brand">
            <Input name="brand" placeholder="Tesla" defaultValue={car?.brand} required />
          </Field>
          <Field label="Model name">
            <Input
              name="name"
              placeholder="Model 3 Long Range"
              defaultValue={car?.name}
              required
            />
          </Field>
          <Field label="Type">
            <Select name="type" defaultValue={car?.type ?? ""} required>
              <option value="" disabled>
                Select a type
              </option>
              {CAR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tagline (optional)">
            <Input
              name="tagline"
              placeholder="Silent, quick, effortless"
              defaultValue={car?.tagline ?? ""}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Specifications</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Price per day (USD)">
            <Input
              name="price_per_day"
              type="number"
              min="0"
              step="1"
              placeholder="119"
              defaultValue={car?.price_per_day}
              required
            />
          </Field>
          <Field label="Transmission">
            <Select name="transmission" defaultValue={car?.transmission ?? ""} required>
              <option value="" disabled>
                Select transmission
              </option>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fuel">
            <Select name="fuel" defaultValue={car?.fuel ?? ""} required>
              <option value="" disabled>
                Select fuel
              </option>
              {FUELS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Seats">
            <Input
              name="seats"
              type="number"
              min="1"
              step="1"
              placeholder="5"
              defaultValue={car?.seats}
              required
            />
          </Field>
          <Field label="Doors (optional)">
            <Input
              name="doors"
              type="number"
              min="0"
              step="1"
              placeholder="4"
              defaultValue={car?.doors ?? ""}
            />
          </Field>
          <Field label="Year (optional)">
            <Input
              name="year"
              type="number"
              min="1980"
              step="1"
              placeholder="2024"
              defaultValue={car?.year ?? ""}
            />
          </Field>
          <Field label="Availability">
            <Select name="available" defaultValue={String(car?.available ?? true)}>
              <option value="true">Available</option>
              <option value="false">Out of stock</option>
            </Select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Details</h2>
        <div className="mt-5 space-y-4">
          <Field label="Description (optional)">
            <Textarea
              name="description"
              placeholder="A short paragraph describing the car…"
              defaultValue={car?.description ?? ""}
            />
          </Field>
          <Field
            label="Features (optional)"
            hint="Comma-separated, e.g. Autopilot, Glass roof, Premium audio"
          >
            <Input
              name="features"
              placeholder="Autopilot, Glass roof, Premium audio"
              defaultValue={featuresDefault}
            />
          </Field>
          <Field label="Cover image URL (optional)">
            <Input
              name="image_url"
              type="url"
              placeholder="https://…"
              defaultValue={car?.image_url ?? ""}
            />
          </Field>
        </div>
      </section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
        <Link href="/admin/cars" className={buttonVariants({ variant: "ghost", size: "lg" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
