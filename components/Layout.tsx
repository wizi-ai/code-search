import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { FaRegSun, FaSearch } from "react-icons/fa";

import Text from "components/Text";

const drawerWidth = 80;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface LayoutProps {
  children: React.ReactNode;
  displayNavList?: boolean;
}

export default function Layout(props: LayoutProps) {
  const router = useRouter();
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        overflow: "auto",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          open={true}
          style={{ height: "100vh", position: "static" }}
        >
          <Link href="/workspaces" as={`/workspaces`} passHref>
            <Toolbar
              style={{
                position: "relative",
                left: "50%",
                cursor: "pointer",
                padding: "0",
                margin: "0 0 0 -13px",
                width: "26px",
              }}
            >
              <Image
                src="/wizi-icon.png"
                alt="wizi icon"
                width={26}
                height={26}
              />
            </Toolbar>
          </Link>
          <Divider />
          <List
            style={{ marginTop: "0px", fontSize: "1.2rem" }}
            component="nav"
          >
            <Link href={`/`} as={`/`} passHref>
              <ListItemButton
                sx={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 0",
                }}
              >
                <ListItemIcon style={{ display: "block" }}>
                  <FaSearch />
                </ListItemIcon>
                <ListItemText style={{ marginTop: "-6px" }}>
                  <Text type="text" variant="subtitle2">
                    Search
                  </Text>
                </ListItemText>
              </ListItemButton>
            </Link>
            <Link href={`/settings`} as={`/settings`} passHref>
              <ListItemButton
                sx={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 0",
                }}
              >
                <ListItemIcon style={{ display: "block" }}>
                  <FaRegSun />
                </ListItemIcon>
                <ListItemText style={{ marginTop: "-6px" }}>
                  <Text type="text" variant="subtitle2">
                    Settings
                  </Text>
                </ListItemText>
              </ListItemButton>
            </Link>
          </List>
        </Drawer>
        <div style={{ width: "100%", minHeight: "100vh" }}>
          {props.children}
        </div>
      </Box>
    </Box>
  );
}
