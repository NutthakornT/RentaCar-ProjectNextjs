import Link from "next/link";
import { getAllCars } from "@/services/cars";
import { getAllBookings, getBookingStats } from "@/services/bookings";
import { getAllUsers } from "@/services/users";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AdminPageHeader,
  StatCard,
  Table,
  Td,
  DemoBanner,
} from "@/components/admin/admin-ui";
import { BookingStatusBadge } from "@/components/booking/status-badge";
import {
  CarIcon,
  ClipboardIcon,
  UsersIcon,
  TagIcon,
} from "@/components/ui/icons";

export const metadata = { title: "Dashboard · Admin" };

export default async function AdminDashboardPage() {
  const [cars, bookings, users, stats] = await Promise.all([
    getAllCars(),
    getAllBookings(),
    getAllUsers(),
    getBookingStats(),
  ]);

  const recent = bookings.slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="An overview of your fleet, bookings, and customers."
      />
      {/* <DemoBanner /> */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CarIcon}
          label="Cars in fleet"
          value={cars.length}
          sub={`${cars.filter((c) => c.available).length} available now`}
          tone="primary"
        />
        <StatCard
          icon={ClipboardIcon}
          label="Total bookings"
          value={stats.total}
          sub={`${stats.active} active · ${stats.upcoming} upcoming`}
          tone="info"
        />
        <StatCard
          icon={UsersIcon}
          label="Customers"
          value={users.length}
          tone="success"
        />
        <StatCard
          icon={TagIcon}
          label="Revenue"
          value={formatCurrency(stats.revenue)}
          sub="Excludes cancellations"
          tone="accent"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent bookings
        </h2>
        <Link
          href="/admin/bookings"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all
        </Link>
      </div>

      <Table
        head={["Reference", "Customer", "Car", "Dates", "Status", "Total"]}
      >
        {recent.map((b) => (
          <tr key={b.id} className="hover:bg-slate-50/60">
            <Td className="font-medium text-slate-900">{b.id}</Td>
            <Td>{b.customer_name}</Td>
            <Td>{b.car_name}</Td>
            <Td className="text-slate-500">
              {formatDate(b.pickup_date)} → {formatDate(b.return_date)}
            </Td>
            <Td>
              <BookingStatusBadge status={b.status} />
            </Td>
            <Td className="font-semibold text-slate-900">
              {formatCurrency(b.total_price)}
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
