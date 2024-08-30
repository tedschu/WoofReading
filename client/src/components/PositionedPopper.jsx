import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function PositionedPopper() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  return (
    <Box>
      <Popper
        // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography
                sx={{
                  p: 2,
                  fontFamily: "Patrick Hand",
                  color: "rgb(64, 64, 64)",
                  fontSize: "18px",
                  width: "200px",
                }}
              >
                Woof Reading uses AI to generate stories. Learn more{" "}
                <MuiLink component={RouterLink} to="/about">
                  here
                </MuiLink>
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Button
        onClick={handleClick("bottom-start")}
        sx={{
          color: "#7dc2e0",
        }}
      >
        <AutoAwesomeIcon />
      </Button>
    </Box>
  );
}
