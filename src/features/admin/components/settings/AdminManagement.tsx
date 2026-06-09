import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AdminAccount } from "../../utils/adminUser";

type Props = {
  admins: AdminAccount[];
  adminsLoaded: boolean;
  newAdminEmail: string;
  setNewAdminEmail: (v: string) => void;
  newAdminDisplayName: string;
  setNewAdminDisplayName: (v: string) => void;
  newAdminPwd: string;
  setNewAdminPwd: (v: string) => void;
  adminMgmtMsg: { type: "success" | "error"; text: string } | null;
  onAddAdmin: () => void;
  onSetDeleteTarget: (admin: AdminAccount) => void;
};

function AdminCard({
  adm,
  onDelete,
}: {
  adm: AdminAccount;
  onDelete: (adm: AdminAccount) => void;
}) {
  const isSuperAdmin = adm.role === "super_admin";
  return (
    <Box className="flex items-start justify-between gap-3 p-4 rounded-xl border border-stone-100 bg-white">
      <Box className="flex flex-col gap-1 min-w-0">
        <Box className="flex items-center gap-2 flex-wrap">
          <Typography variant="body2" className="font-semibold text-stone-800">
            {adm.display_name}
          </Typography>
          <Chip
            label={isSuperAdmin ? "Super Admin" : "Admin"}
            size="small"
            className={
              isSuperAdmin
                ? "text-xs bg-amber-50 text-amber-700 border border-amber-200"
                : "text-xs bg-stone-50 text-stone-500 border border-stone-200"
            }
          />
        </Box>
        <Typography variant="caption" className="text-stone-400 break-all">
          {adm.email}
        </Typography>
        <Typography variant="caption" className="text-stone-300">
          {new Date(adm.created_at).toLocaleDateString()}
        </Typography>
      </Box>
      {!isSuperAdmin && (
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(adm)}
          title="Delete Account"
          className="shrink-0"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

export default function AdminManagement({
  admins,
  adminsLoaded,
  newAdminEmail,
  setNewAdminEmail,
  newAdminDisplayName,
  setNewAdminDisplayName,
  newAdminPwd,
  setNewAdminPwd,
  adminMgmtMsg,
  onAddAdmin,
  onSetDeleteTarget,
}: Props) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center gap-2 mb-4">
          <GroupAddIcon className="text-amber-700" />
          <Typography
            variant="subtitle1"
            className="font-semibold text-stone-800"
          >
            Admin Management
          </Typography>
          <Chip
            label="Super Admin Only"
            size="small"
            className="text-xs bg-amber-50 text-amber-700 border border-amber-200 ml-1"
          />
        </Box>
        <Divider className="mb-6" />

        {adminMgmtMsg && (
          <Alert severity={adminMgmtMsg.type} className="mb-6 text-sm">
            {adminMgmtMsg.text}
          </Alert>
        )}

        <Box className="grid gap-8">
          {/* Create new admin */}
          <Box>
            <Typography
              variant="subtitle2"
              className="text-stone-700 font-semibold mb-3"
            >
              Create New Admin
            </Typography>
            <Box className="flex flex-col gap-4">
              <TextField
                fullWidth
                label="Display Name"
                size="small"
                value={newAdminDisplayName}
                onChange={(e) => setNewAdminDisplayName(e.target.value)}
                placeholder="e.g. Jane"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                size="small"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="e.g. jane@internal.admin"
                helperText="Use name@internal.admin to avoid sending verification emails."
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                size="small"
                value={newAdminPwd}
                onChange={(e) => setNewAdminPwd(e.target.value)}
              />
              <Button
                variant="contained"
                disableElevation
                onClick={onAddAdmin}
                className="normal-case bg-amber-700 hover:bg-amber-600 text-white rounded-lg h-9 w-fit"
              >
                Create Admin Account
              </Button>
            </Box>
          </Box>

          {/* Admin accounts list */}
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
                {/* Mobile: stacked cards */}
                <Box className="flex flex-col gap-3 md:hidden">
                  {admins.map((adm) => (
                    <AdminCard
                      key={adm.id}
                      adm={adm}
                      onDelete={onSetDeleteTarget}
                    />
                  ))}
                </Box>

                {/* Desktop: table */}
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
                          <TableRow
                            key={adm.id}
                            className="hover:bg-stone-50/50"
                          >
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
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => onSetDeleteTarget(adm)}
                                  title="Delete Account"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
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
        </Box>
      </CardContent>
    </Card>
  );
}
