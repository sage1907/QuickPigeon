import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { useRef } from "react";
import { IconButton, Stack } from "@mui/material";
import { grayColor } from "../constants/color";
import {
  Send as SendIcon,
  AttachFileOutlined
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import { sampleMessage } from "../constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";

const user = {
  _id: "ddvb",
  name: "Bobby Singh",
}

const Chat = () => {
  const containerRef = useRef(null);

  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {sampleMessage.map(i => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
      </Stack>

      <form
        style={{
          height: "10%",
        }}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton sx={{
            rotate: "40deg",
            position: "absolute",
            left: "1.5rem",
          }}
          
          >
            <AttachFileOutlined />
          </IconButton>

          <InputBox placeholder="Type a message" />

          <IconButton type="submit" sx={{
            marginLeft: "1rem",
            padding: "0.5rem",
            "&:hover": {

            }
          }} >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu  />
    </>
  );
};

export default AppLayout()(Chat);
