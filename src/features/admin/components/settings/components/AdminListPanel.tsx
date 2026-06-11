import { Box, Chip, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import type { AdminAccount } from "../../../utils/adminUser";
import AdminCard from "./AdminCard";

type Props = {
  admins: AdminAccount[];
  adminsLoaded: boolean;
  onSetDeleteTarget: (admin: AdminAccount) => void;
  onSetPromoteTarget: (admin: AdminAccount) => void;
};

export default function AdminListPanel({
  admins,
  adminsLoaded,
  onSetDeleteTarget,
  onSetPromoteTarget,
}: Props) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        className="text-stone-700 font-semibold mb-3"
      >
        Admin Accounts
      </Typography>

      {!adminsLoaded ? (
        <Box className="flex justify-center py-6">
          <CircularProgress size={24} className="text-stone-400" />
        </Box>
      ) : admins.length === 0 ? (
        <Typography
          variant="body2"
          className="text-stone-400 py-4 text-center"
        >
          No admin accounts found.
        </Typography>
      ) : (
        <>
          <Box className="flex flex-col gap-3 md:hidden">
            {admins.map((adm) => (
              <AdminCard
                key={adm.id}
                adm={adm}
                onDelete={onSetDeleteTarget}
                onPromote={onSetPromoteTarget}
              />
            ))}
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            className="border border-stone-100 rounded-xl hidden md:block"
          >
            <Table size="small">
              <TableHead className="bg-stone-50">
                <TableRow>
                  <TableCell className="font-semibold text-stone-600 py-3">
                    Name
                  </TableCell>
                  <TableCell className="font-semibold text-stone-600 py-3">
                    Email
                  </TableCell>
                  <TableCell className="font-semibold text-stone-600 py-3">
                    Role
                  </TableCell>
                  <TableCell className="font-semibold text-stone-600 py-3">
                    Created
                  </TableCell>
                  <TableCell
                    align="right"
                    className="font-semibold text-stone-600 py-3"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((adm) => {
                  const isSuperAdmin = adm.role === "super_admin";
                  return (
                    <TableRow key={adm.id} className="hover:bg-stone-50/50">
                      <TableCell className="text-stone-800">
                        {adm.display_name}
                      </TableCell>
                      <TableCell className="text-stone-500 text-xs">
                        {adm.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isSuperAdmin ? "Super Admin" : "Admin"}
                          size="small"
                          className={
                            isSuperAdmin
                              ? "text-xs bg-amber-50 text-amber-700 border border-amber-200"
                              : "text-xs bg-stone-50 text-stone-500 border border-stone-200"
                          }
                        />
                      </TableCell>
                      <TableCell className="text-stone-400 text-xs">
                        {new Date(adm.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {!isSuperAdmin && (
                          <Box className="flex items-center gap-1 justify-end">
                            <Tooltip title="Promote to Super Admin">
                              <IconButton
                                size="small"
                                onClick={() => onSetPromoteTarget(adm)}
                              >
                                <StarIcon
                                  fontSize="small"
                                  sx={{ color: "#b45309" }}
                                />
                              </IconButton>
                            </Tooltip>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onSetDeleteTarget(adm)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

