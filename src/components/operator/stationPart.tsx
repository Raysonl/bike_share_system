import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Content from "components/operator/Contents/stationContent";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        O_Lab2_T6
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function AdminStation() {
  return (
    <>
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}>
        <Content />
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
        <Copyright />
      </Box>
    </>
  );
}
