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
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AdminAccount } from "../../utils/adminUser";

type Props = {
  admins: AdminAccount[];
  newAdminUser: string;
  setNewAdminUser: (v: string) => void;
  newAdminPwd: string;
  setNewAdminPwd: (v: string) => void;
  adminMgmtMsg: { type: "success" | "error"; text: string } | null;
  onAddAdmin: () => void;
  onSetDeleteTarget: (admin: AdminAccount) => void;
  onSetResetTarget: (admin: AdminAccount) => void;
};

export default function AdminManagement({
  admins,
  newAdminUser,
  setNewAdminUser,
  newAdminPwd,
  setNewAdminPwd,
  adminMgmtMsg,
  onAddAdmin,
  onSetDeleteTarget,
  onSetResetTarget,
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
            Admin Management Section (Super Admin Only)
          </Typography>
        </Box>
        <Divider className="mb-6" />

        {adminMgmtMsg && (
          <Alert severity={adminMgmtMsg.type} className="mb-6 text-sm">
            {adminMgmtMsg.text}
          </Alert>
        )}

        <Box className="grid gap-8">
          {/* Create Admin Form */}
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
                label="Admin Username"
                size="small"
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label="Admin Password"
                size="small"
                value={newAdminPwd}
                onChange={(e) => setNewAdminPwd(e.target.value)}
              />
              <Button
                variant="contained"
                disableElevation
                onClick={onAddAdmin}
                className="normal-case bg-amber-700 hover:bg-amber-600 text-white rounded-lg h-9"
              >
                Create Account
              </Button>
            </Box>
          </Box>

          {/* Admin List */}
          <Box>
            <Typography
              variant="subtitle2"
              className="text-stone-700 font-semibold mb-3"
            >
              Admin Accounts
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              className="border border-stone-100 rounded-xl"
            >
              <Table size="small">
                <TableHead className="bg-stone-50">
                  <TableRow>
                    <TableCell className="font-semibold text-stone-600 py-3">
                      Username
                    </TableCell>
                    <TableCell className="font-semibold text-stone-600 py-3">
                      Role
                    </TableCell>
                    <TableCell className="font-semibold text-stone-600 py-3">
                      Created At
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
                  {admins.map((adm) => (
                    <TableRow key={adm.id} className="hover:bg-stone-50/50">
                      <TableCell className="text-stone-800">
                        {adm.username}
                      </TableCell>
                      <TableCell className="text-stone-500">
                        {adm.username.toLowerCase() === "admin"
                          ? "Super Admin"
                          : "Admin"}
                      </TableCell>
                      <TableCell className="text-stone-400 text-xs">
                        {new Date(adm.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {adm.username.toLowerCase() !== "admin" && (
                          <Box className="flex justify-end gap-1">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onSetResetTarget(adm)}
                              title="Reset Password"
                            >
                              <VpnKeyIcon
                                fontSize="small"
                                className="text-stone-500 hover:text-stone-800"
                              />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onSetDeleteTarget(adm)}
                              title="Delete Account"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
