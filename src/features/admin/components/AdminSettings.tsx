import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useAuth } from "../../../hooks/useAuth";
import {
  updateAdminUsername,
  updateAdminPassword,
  listAdmins,
  createAdmin,
  deleteAdminAccount,
  resetAdminAccount,
  isSuperAdmin,
  type AdminAccount,
} from "../utils/adminUser";

export default function AdminSettings() {
  const { user } = useAuth();
  const superAdmin = isSuperAdmin(user);

  // Profile fields
  const [username, setUsername] = useState(
    user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "",
  );
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Admin Management state
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPwd, setNewAdminPwd] = useState("");
  const [adminMgmtMsg, setAdminMgmtMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Destructive Actions state
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminAccount | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!superAdmin) return;
      const list = await listAdmins();
      if (!cancelled) setAdmins(list);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [superAdmin]);

  const refreshAdmins = async () => {
    if (!superAdmin) return;
    const list = await listAdmins();
    setAdmins(list);
  };

  // Profile Update handler
  const handleUpdateUsername = async () => {
    setProfileMsg(null);
    if (!username.trim()) {
      setProfileMsg({ type: "error", text: "Username cannot be empty." });
      return;
    }
    const ok = await updateAdminUsername(username.trim(), user?.id ?? "");
    if (ok) {
      setProfileMsg({
        type: "success",
        text: "Username updated successfully. Changes will apply on reload.",
      });
    } else {
      setProfileMsg({ type: "error", text: "Failed to update username." });
    }
  };

  // Password Update handler
  const handleUpdatePassword = async () => {
    setPwdMsg(null);
    if (!newPassword) {
      setPwdMsg({ type: "error", text: "Please enter a new password." });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    const currentUsername =
      user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "";
    const ok = await updateAdminPassword(newPassword, currentUsername);
    if (ok) {
      setPwdMsg({ type: "success", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPwdMsg({ type: "error", text: "Failed to update password." });
    }
  };

  // Add Admin handler
  const handleAddAdmin = async () => {
    setAdminMgmtMsg(null);
    if (!newAdminUser.trim() || !newAdminPwd) {
      setAdminMgmtMsg({ type: "error", text: "Please fill all fields." });
      return;
    }
    if (newAdminPwd.length < 6) {
      setAdminMgmtMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    const { error } = await createAdmin(newAdminUser.trim(), newAdminPwd);
    if (error) {
      setAdminMgmtMsg({ type: "error", text: error });
    } else {
      setAdminMgmtMsg({
        type: "success",
        text: `Admin account "${newAdminUser}" created.`,
      });
      setNewAdminUser("");
      setNewAdminPwd("");
      refreshAdmins();
    }
  };

  // Delete Admin handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const ok = await deleteAdminAccount(deleteTarget.id, deleteTarget.username);
    if (ok) {
      setDeleteTarget(null);
      refreshAdmins();
    }
  };

  // Reset Admin Password handler
  const handleResetConfirm = async () => {
    if (!resetTarget || !tempPassword) return;
    if (tempPassword.length < 6) {
      setResetMsg("Password must be at least 6 characters.");
      return;
    }
    const ok = await resetAdminAccount(resetTarget.username, tempPassword);
    if (ok) {
      setResetTarget(null);
      setTempPassword("");
      setResetMsg(null);
      setAdminMgmtMsg({
        type: "success",
        text: `Successfully reset credentials for "${resetTarget.username}".`,
      });
      refreshAdmins();
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
          Settings
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Manage your account profile, password, and administrative users.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} className="border border-stone-100 rounded-xl">
            <CardContent className="p-6">
              <Box className="flex items-center gap-2 mb-4">
                <PersonIcon className="text-amber-700" />
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-stone-800"
                >
                  Profile Section
                </Typography>
              </Box>
              <Divider className="mb-4" />

              {profileMsg && (
                <Alert severity={profileMsg.type} className="mb-4 text-sm">
                  {profileMsg.text}
                </Alert>
              )}

              <Box className="flex flex-col gap-4">
                <TextField
                  fullWidth
                  label="Username"
                  size="small"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleUpdateUsername}
                  className="normal-case bg-stone-800 hover:bg-stone-700 rounded-lg h-9 w-fit"
                >
                  Update Username
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} className="border border-stone-100 rounded-xl">
            <CardContent className="p-6">
              <Box className="flex items-center gap-2 mb-4">
                <SecurityIcon className="text-amber-700" />
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-stone-800"
                >
                  Security Section
                </Typography>
              </Box>
              <Divider className="mb-4" />

              {pwdMsg && (
                <Alert severity={pwdMsg.type} className="mb-4 text-sm">
                  {pwdMsg.text}
                </Alert>
              )}

              <Box className="flex flex-col gap-4">
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  size="small"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  size="small"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleUpdatePassword}
                  className="normal-case bg-stone-800 hover:bg-stone-700 rounded-lg h-9 w-fit"
                >
                  Update Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Super Admin Management section */}
        {superAdmin && (
          <Grid size={{ xs: 12 }}>
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

                <Grid container spacing={4} className="mb-8">
                  {/* Create Admin Form */}
                  <Grid size={{ xs: 12, md: 4 }}>
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
                        onClick={handleAddAdmin}
                        className="normal-case bg-amber-700 hover:bg-amber-600 text-white rounded-lg h-9"
                      >
                        Create Account
                      </Button>
                    </Box>
                  </Grid>

                  {/* Admin List */}
                  <Grid size={{ xs: 12, md: 8 }}>
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
                            <TableRow
                              key={adm.id}
                              className="hover:bg-stone-50/50"
                            >
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
                                      onClick={() => setResetTarget(adm)}
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
                                      onClick={() => setDeleteTarget(adm)}
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
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle className="text-stone-800 font-semibold">
          Delete Admin Account
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="text-stone-600">
            Are you sure you want to delete the admin account{" "}
            <strong>"{deleteTarget?.username}"</strong>? This will permanently
            revoke their access, and they will be logged out on their next
            action.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setDeleteTarget(null)}
            className="normal-case text-stone-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            className="normal-case rounded-lg"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog
        open={!!resetTarget}
        onClose={() => {
          setResetTarget(null);
          setResetMsg(null);
          setTempPassword("");
        }}
      >
        <DialogTitle className="text-stone-800 font-semibold">
          Reset Credentials
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="text-stone-600 mb-4">
            Reset the password for admin{" "}
            <strong>"{resetTarget?.username}"</strong>. The admin can log in
            with this temporary password.
          </Typography>
          {resetMsg && (
            <Alert severity="error" className="mb-4 text-xs">
              {resetMsg}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Temporary Password"
            size="small"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => {
              setResetTarget(null);
              setResetMsg(null);
              setTempPassword("");
            }}
            className="normal-case text-stone-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetConfirm}
            variant="contained"
            className="normal-case bg-stone-800 hover:bg-stone-700 text-white rounded-lg"
          >
            Reset Credentials
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
