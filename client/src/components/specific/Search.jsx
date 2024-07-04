import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/sampleData";

const SearchDialog = () => {
  const search = useInputValidation("");

  let isLoadingSendFriendRequest = false;

  const [users, setUsers] = useState(sampleUsers);

  const addFriendHandler = (id) => {
    console.log(id);
  };

  return (
    <Dialog 
      open
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundColor: "#f5f5f5",
        }
      }}
    >
      <Stack 
        p={{ xs: "1rem", sm: "2rem" }} 
        direction="column" 
        width="25rem"
        spacing={2}
      >
        <DialogTitle 
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: "#333",
            pb: 2,
          }}
        >
          Find People
        </DialogTitle>
        
        <TextField
          placeholder="Search users..."
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            backgroundColor: "#fff",
            borderRadius: "4px",
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#bdbdbd',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <List
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRadius: "4px",
            padding: "8px",
            '& > :not(:last-child)': {
              marginBottom: "8px",
            },
          }}
        >
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default SearchDialog;