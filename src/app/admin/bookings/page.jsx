import { getAllBookings } from "@/services/bookings";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AdminPageHeader,
  Table,
  Td,
  DemoBanner,
} from "@/components/admin/admin-ui";
import { RowActions } from "@/components/admin/row-actions";
import { removeBooking } from "./actions";
import { BookingStatusBadge } from "@/components/booking/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ClipboardIcon } from "@/components/ui/icons";

export const metadata = { title: "Bookings · Admin" };

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <>
      <AdminPageHeader
        title="Bookings"
        description={`${bookings.length} bookings across all customers.`}
      />
      <DemoBanner>
        <span className="font-semibold">Live data.</span> Bookings are read
        from Supabase. You can delete a booking here; editing isn&apos;t
        available.
      </DemoBanner>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<ClipboardIcon size={26} />}
          title="No bookings yet"
          description="Bookings will appear here as customers reserve cars."
        />
      ) : (
        <Table
          head={["Reference", "Customer", "Phone", "Car", "Pick-up location", "Pick-up", "Return", "Status", "Total", ""]}
        >
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-slate-50/60">
              <Td className="font-medium uppercase text-slate-900">
                {b.id.slice(0, 8)}
              </Td>
              <Td>{b.customer_name}</Td>
              <Td className="text-slate-500">{b.phone || "—"}</Td>
              <Td className="text-slate-500">{b.car_name}</Td>
              <Td className="text-slate-500">{b.pickup_location || "—"}</Td>
              <Td className="text-slate-500">{formatDate(b.pickup_date)}</Td>
              <Td className="text-slate-500">{formatDate(b.return_date)}</Td>
              <Td>
                <BookingStatusBadge status={b.status} />
              </Td>
              <Td className="font-semibold text-slate-900">
                {formatCurrency(b.total_price)}
              </Td>
              <Td>
                <RowActions
                  deleteAction={removeBooking.bind(null, b.id)}
                  deleteConfirm={`Delete booking ${b.id.slice(0, 8).toUpperCase()}? This can't be undone.`}
                />
              </Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
