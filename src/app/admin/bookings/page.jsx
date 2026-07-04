import { getAllBookings } from "@/services/bookings";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AdminPageHeader,
  Table,
  Td,
  DemoBanner,
} from "@/components/admin/admin-ui";
import { RowActions } from "@/components/admin/row-actions";
import { ConfirmReturnButton } from "@/components/admin/confirm-return-button";
import { removeBooking, confirmReturnAction } from "./actions";
import { BookingStatusBadge } from "@/components/booking/status-badge";
import { Badge } from "@/components/ui/badge";
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
      {/* <DemoBanner>
        <span className="font-semibold">Live data.</span> Bookings are read
        from Supabase. Confirm returns and delete bookings here; editing
        isn&apos;t available.
      </DemoBanner> */}

      {bookings.length === 0 ? (
        <EmptyState
          icon={<ClipboardIcon size={26} />}
          title="No bookings yet"
          description="Bookings will appear here as customers reserve cars."
        />
      ) : (
        <Table
          head={[
            "Reference",
            "Customer",
            "Phone",
            "Car",
            "Pick-up location",
            "Pick-up",
            "Return",
            "Status",
            "Total",
            "Return status",
            "",
          ]}
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
                {b.status === "completed" || b.return_status === "completed" ? (
                  <span className="text-xs font-medium text-emerald-600">
                    Returned{b.late_fee > 0 && ` · $${b.late_fee} late`}
                  </span>
                ) : b.status === "cancelled" ? (
                  <span className="text-slate-400">—</span>
                ) : (
                  <div className="flex items-center gap-2">
                    {b.return_status === "requested" && (
                      <Badge tone="accent">Requested</Badge>
                    )}
                    <ConfirmReturnButton
                      action={confirmReturnAction.bind(null, b.id)}
                      dueDate={formatDate(b.return_date)}
                      highlighted={b.return_status === "requested"}
                    />
                  </div>
                )}
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
