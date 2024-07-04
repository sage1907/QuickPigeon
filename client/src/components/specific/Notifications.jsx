import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography, Divider } from "@mui/material";
import React, { memo } from "react";
import { sampleNotifications } from "../../constants/sampleData";

const NotificationsDialog = () => {
  const friendRequestHandler = ({ _id, accept }) => {
    // Handler implementation
  };

  return (
    <Dialog 
      open
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
          maxWidth: "400px",
          width: "100%",
        }
      }}
    >
      <Stack p={{ xs: "1.5rem", sm: "2rem" }} spacing={2}>
        <DialogTitle 
          textAlign="center" 
          sx={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold", 
            color: "#1a237e",
            pb: 1,
          }}
        >
          Notifications
        </DialogTitle>
        <Divider />
        {sampleNotifications.length > 0 ? (
          sampleNotifications.map((i, index) => (
            <React.Fragment key={i._id}>
              <NotificationItem
                sender={i.sender}
                _id={i._id}
                handler={friendRequestHandler}
              />
              {index < sampleNotifications.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Typography 
            textAlign="center"
            sx={{ 
              fontStyle: "italic", 
              color: "#757575",
              py: 2,
            }}
          >
            No notifications yet.
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem disablePadding sx={{ py: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        width="100%"
      >
        <Avatar 
          src={avatar} 
          sx={{ 
            width: 50, 
            height: 50,
            border: "2px solid #e0e0e0",
          }}
        />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            fontWeight: "medium",
            color: "#37474f",
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            onClick={() => handler({_id, accept: true})}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Accept
          </Button>
          <Button 
            onClick={() => handler({_id, accept: false})}
            variant="outlined"
            size="small"
            sx={{
              color: "#f44336",
              borderColor: "#f44336",
              "&:hover": {
                backgroundColor: "#ffebee",
                borderColor: "#d32f2f",
              },
            }}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default NotificationsDialog;