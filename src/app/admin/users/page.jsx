import { getAllUsers } from "@/services/users";
import { formatDate } from "@/lib/utils";
import {
  AdminPageHeader,
  Table,
  Td,
  DemoBanner,
} from "@/components/admin/admin-ui";
import { RowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Users · Admin" };

/** Initials avatar chip for the users table. */
function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
      {initials}
    </span>
  );
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <>
      <AdminPageHeader
        title="Users"
        description={`${users.length} registered customers.`}
      />
      {/* <DemoBanner /> */}

      <Table head={["Customer", "Email", "Role", "Joined", "Bookings", ""]}>
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50/60">
            <Td>
              <div className="flex items-center gap-3">
                <Avatar name={u.name} />
                <span className="font-medium text-slate-900">{u.name}</span>
              </div>
            </Td>
            <Td className="text-slate-500">{u.email}</Td>
            <Td>
              <Badge tone={u.role === "admin" ? "accent" : "neutral"}>
                {u.role}
              </Badge>
            </Td>
            <Td className="text-slate-500">{formatDate(u.joined)}</Td>
            <Td className="font-semibold text-slate-900">
              {u.bookings_count ?? 0}
            </Td>
            <Td>
              <RowActions />
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
