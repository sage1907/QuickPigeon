import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalenderIcon
} from "@mui/icons-material";
import moment from 'moment';

const Profile = () => {
  return (
    <Stack direction={"column"} spacing={"2rem"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"They were like summer and winter."} />
      <ProfileCard heading={"Username"} text={"flamingo_786"} Icon={<UsernameIcon />} />
      <ProfileCard heading={"Name"} text={"Flamingo Mingo"} Icon={<FaceIcon />} />
      <ProfileCard heading={"Joined"} text={moment("2024-04-04T18:30:00.000Z").fromNow()} Icon={<CalenderIcon />} />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}

    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography variant="caption" color={"grey"}>
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
