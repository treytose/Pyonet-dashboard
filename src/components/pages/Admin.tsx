import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Grid,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import UserPanel from "../blocks/admin/UserPanel/UserPanel";
import RolePanel from "../blocks/admin/RolePanel/RolePanel";
import PermissionPanel from "../blocks/admin/PermissionPanel";

const AdminPanel = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <>
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4"> Admin Dashboard </Typography>
        <br />
        <Tabs
          value={currentTab}
          onChange={(e, value) => setCurrentTab(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Users" />
          <Tab label="Roles" />
          <Tab label="Permissions" />
        </Tabs>
        <br />
        {currentTab === 0 && <UserPanel />}

        {currentTab === 1 && <RolePanel />}
        {currentTab === 2 && <PermissionPanel />}
      </Container>
    </>
  );
};

export default AdminPanel;
