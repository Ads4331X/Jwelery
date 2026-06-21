import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AdminAccount } from "../../utils/adminUser";
import RoleChip from "./RoleChip";

type Props = {
  admins: AdminAccount[];
  onDelete: (a: AdminAccount) => void;
  onPromote: (a: AdminAccount) => void;
};

export default function AdminTable({ admins, onDelete, onPromote }: Props) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="border border-stone-100 rounded-xl hidden md:block"
    >
      <Table size="small">
        <TableHead className="bg-stone-50">
          <TableRow>
            {["Name", "Email", "Role", "Created", "Actions"].map((h) => (
              <TableCell
                key={h}
                align={h === "Actions" ? "right" : "left"}
                className="font-semibold text-stone-600 py-3"
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((adm) => (
            <TableRow key={adm.id} className="hover:bg-stone-50/50">
              <TableCell className="text-stone-800 font-medium">
                {adm.display_name}
              </TableCell>
              <TableCell className="text-stone-500 text-xs">
                {adm.email}
              </TableCell>
              <TableCell>
                <RoleChip adm={adm} onPromote={onPromote} />
              </TableCell>
              <TableCell className="text-stone-400 text-xs">
                {new Date(adm.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                {adm.role !== "SUPER_ADMIN" && (
                  <Tooltip title="Delete account">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(adm)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
