import { experimental_extendTheme as extendTheme } from "@mui/material";

const theme = extendTheme({
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: () => {
          return {
            fontSize: "1.6rem",
            color: "#042f4d",
          };
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: () => {
          return {
            color: "#00a4f4",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "inherit",
            },
            "&:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "inherit",
              },
            },
            "& fieldset": {
              borderWidth: "0.2rem",
              borderColor: "inherit!important",
            },
            "&:hover fieldset": {
              borderWidth: "0.2rem",
            },
            "&.Mui-focused fieldset": {
              borderWidth: "0.2rem",
            },
          };
        },
      },
    },
  },
});

export default theme;
