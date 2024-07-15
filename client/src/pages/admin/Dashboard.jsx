import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import moment from "moment";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { DoughnutCharts, LineChart } from "../../components/specific/Charts";

const Dashboard = () => {
  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: "1.5rem",
        margin: "1rem 0 2rem",
        borderRadius: "1rem",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <AdminPanelSettingsIcon sx={{ fontSize: "2.5rem" }} />
        <SearchField placeholder="Search" />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
          color={"rgba(0,0,0,0.7"}
          textAlign={"center"}
        >
          {moment().format("dddd, D MMMM YYYY")}
        </Typography>
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={3}
      justifyContent={"space-between"}
      alignItems={"stretch"}
      margin={"2rem 0"}
    >
      <Widget title={"Users"} value={34} Icon={<PersonIcon />} />
      <Widget title={"Chats"} value={3} Icon={<GroupIcon />} />
      <Widget title={"Messages"} value={453} Icon={<MessageIcon />} />
    </Stack>
  );

  return (
    <AdminLayout>
      <Container component={"main"} maxWidth="xl">
        {Appbar}

        <Box
          display={"flex"}
          flexDirection={{ xs: "column", lg: "row" }}
          gap={3}
          mb={3}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "1rem",
              flex: { lg: 2 },
              minWidth: { lg: 0 },
              width: { xs: "100%", lg: "auto" },
            }}
          >
            <Typography mb={2} variant="h5" fontWeight="bold">
              Last Messages
            </Typography>
            <LineChart value={[12, 23, 34, 21, 45]} />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: { lg: 1 },
              minWidth: { lg: 0 },
              width: { xs: "100%", lg: "auto" },
              position: "relative",
            }}
          >
            <DoughnutCharts
              labels={["Single Chats", "Group Chats"]}
              value={[23, 66]}
            />
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={1}
              width={"100%"}
              height={"100%"}
            >
              <GroupIcon /> <Typography>vs</Typography> <PersonIcon />
            </Stack>
          </Paper>
        </Box>

        {Widgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "1.5rem",
      borderRadius: "1rem",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Stack alignItems={"center"} spacing={2}>
      <Typography
        sx={{
          color: "rgba(0, 0, 0, 0.9)",
          borderRadius: "50%",
          border: "4px solid rgba(0, 0, 0, 0.9)",
          width: "4rem",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        {Icon}
        <Typography variant="h6" >{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
