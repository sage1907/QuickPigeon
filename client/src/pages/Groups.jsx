import {
  KeyboardBackspaceOutlined,
  Menu as MenuIcon,
  Edit as EditIcon,
  Done as DoneIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Button,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats, sampleUsers } from "../constants/sampleData";
import UserItem from "../components/shared/UserItem";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const isAddMember = false;

const Groups = () => {
  const theme = useTheme();
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const navigateBack = () => navigate("/");
  const handleMobile = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const updateGroupName = () => setIsEdit(false);
  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const openAddMemberHandler = () => console.log("Add member");
  const deleteHandler = () => {
    console.log("Delete handler");
    closeConfirmDeleteHandler();
  };
  const removeMemberHandler = (id) => console.log("Remove member", id);

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <IconButton
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          top: "1rem",
          right: "1rem",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
        onClick={handleMobile}
      >
        <MenuIcon />
      </IconButton>

      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceOutlined />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      py={4}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ 
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: theme.palette.background.paper,
              }
            }}
          />
          <IconButton onClick={updateGroupName} color="primary">
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
            {groupName}
          </Typography>
          <IconButton onClick={() => setIsEdit(true)} color="primary">
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{ sm: "row", xs: "column-reverse" }}
      spacing={2}
      p={{ sm: 2, xs: 0, md: "2rem 4rem" }}
    >
      <Button
        size="large"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
        variant="outlined"
        color="error"
        sx={{ borderRadius: "20px", textTransform: "none" }}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
        sx={{ borderRadius: "20px", textTransform: "none" }}
      >
        Add Member
      </Button>
    </Stack>
  );

  return (
    <Grid container height="100vh">
      <Grid
        item
        sx={{
          display: { xs: "none", sm: "block" },
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
        sm={4}
      >
        <GroupsList myGroups={sampleChats} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 2rem",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}

            <Typography
              margin="2rem 0 1rem"
              alignSelf="flex-start"
              variant="h6"
              fontWeight="bold"
              color={theme.palette.text.secondary}
            >
              Members
            </Typography>

            <Stack
              maxWidth="45rem"
              width="100%"
              boxSizing="border-box"
              padding={{ sm: 2, xs: 0, md: "1rem 2rem" }}
              spacing={2}
              height="50vh"
              overflow="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: "4px",
                },
              }}
            >
              {sampleUsers.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  isAdded
                  styling={{
                    boxShadow: theme.shadows[2],
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                    backgroundColor: theme.palette.background.paper,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-2px)",
                    },
                  }}
                  handler={removeMemberHandler}
                />
              ))}
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "240px",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList w="100%" myGroups={sampleChats} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  const theme = useTheme();
  return (
    <Stack width={w} bgcolor={theme.palette.background.paper} height="100%">
      <Typography variant="h6" fontWeight="bold" p={2} color={theme.palette.primary.main}>
        My Groups
      </Typography>
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign="center" padding="1rem" color={theme.palette.text.secondary}>
          No Groups
        </Typography>
      )}
    </Stack>
  );
};

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const theme = useTheme();

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
      style={{ textDecoration: "none" }}
    >
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center" 
        p={2}
        sx={{
          backgroundColor: chatId === _id ? theme.palette.action.selected : "transparent",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          transition: "background-color 0.3s ease",
        }}
      >
        <AvatarCard avatar={avatar} />
        <Typography color={theme.palette.text.primary}>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Groups;