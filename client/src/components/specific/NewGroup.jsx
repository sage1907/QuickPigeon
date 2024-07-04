import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";

const NewGroupDialog = () => {
  const groupName = useInputValidation("");

  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setMembers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, isAdded: !user.isAdded } : user
      )
    );
    // Handler implementation
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

  };

  return (
    <Dialog open
      PaperProps={{
        sx: {
          borderRadius: "12px",
        }
      }}
      onClose={closeHandler}
    >
      <Stack
        p={{ xs: "1rem", sm: "2rem" }}
        width="25rem"
        spacing={2}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <DialogTitle
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: "#333",
          }}
        >
          New Group
        </DialogTitle>

        <TextField
          placeholder="Group Name"
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: "#fff",
          }}
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <Typography textAlign="center" fontWeight="bold" color="#555">
          Members
        </Typography>

        <Stack
          spacing={1}
          sx={{
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRadius: "4px",
            padding: "8px",
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

        <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
          <Button
            variant="contained"
            sx={{
              minWidth: "100px",
            }}
            onClick={submitHandler}
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              minWidth: "100px",
            }}
            onClick={closeHandler}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroupDialog;
