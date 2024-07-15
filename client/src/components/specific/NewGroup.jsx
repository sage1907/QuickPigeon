import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";

const NewGroupDialog = () => {
  const theme = useTheme();
  const groupName = useInputValidation("");

  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setMembers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, isAdded: !user.isAdded } : user
      )
    );
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    // Handler implementation
  };

  const closeHandler = () => {
    // Handler implementation
  };

  return (
    <Dialog 
      open
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }
      }}
      onClose={closeHandler}
    >
      <Stack
        width="30rem"
        spacing={3}
        sx={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <DialogTitle
          textAlign="center"
          sx={{
            fontWeight: 700,
            color: "#2c3e50",
            fontSize: "2rem",
            padding: "2rem 2rem 0",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Create New Group
        </DialogTitle>

        <Stack spacing={3} p="0 2rem 2rem">
          <TextField
            placeholder="Enter Group Name"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                backgroundColor: "rgba(255,255,255,0.8)",
                transition: "all 0.3s ease",
                "&:hover, &.Mui-focused": {
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              },
            }}
            value={groupName.value}
            onChange={groupName.changeHandler}
          />

          <Typography 
            textAlign="center" 
            fontWeight={600} 
            color="#34495e"
            fontSize="1.2rem"
          >
            Select Members
          </Typography>

          <Stack
            spacing={1.5}
            sx={{
              maxHeight: "280px",
              overflowY: "auto",
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: "15px",
              padding: "1rem",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.05)",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              },
            }}
          >
            {members.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))}
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={2} mt={1}>
            <Button
              variant="contained"
              sx={{
                minWidth: "140px",
                borderRadius: "25px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(45deg, #3498db, #2980b9)",
                boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(52, 152, 219, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={submitHandler}
            >
              Create Group
            </Button>
            <Button
              variant="outlined"
              sx={{
                minWidth: "140px",
                borderRadius: "25px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "0.75rem 1.5rem",
                borderColor: "#95a5a6",
                color: "#34495e",
                "&:hover": {
                  backgroundColor: "rgba(149, 165, 166, 0.1)",
                  borderColor: "#7f8c8d",
                },
              }}
              onClick={closeHandler}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroupDialog;