import "@/styles/global.css";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import "@mantine/core/styles.css";
import { useWindowScroll } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

type props = {
  children: React.ReactNode;
};

const theme: MantineThemeOverride = {
  fontFamily: "Poppins, sans-serif",
  headings: {
    fontFamily: "Poppins, sans-serif",
  },
  colors: {
    primary: [
      "#eff2ff",
      "#dde0f6",
      "#b8bee5",
      "#929bd2",
      "#717cc4",
      "#5c69bb",
      "#515fb8",
      "#4250a2",
      "#384792",
      "#2d3c82",
    ],
  },
  primaryColor: "primary",
  components: {
    Button: {
      classNames: {
        label: "font-normal",
      },
    },
    Modal: {
      styles: {
        title: {
          fontWeight: "bold",
          fontSize: "20px",
        },
      },
    },
  },
};
export const StyleProvider: React.FC<props> = ({ children }) => {
  const [_, scrollTo] = useWindowScroll();
  const { pathname } = useLocation();

  useEffect(() => {
    scrollTo({ y: 0 });
  }, [pathname]);

  return (
    <MantineProvider theme={theme}>
      <ModalsProvider labels={{ confirm: "Konfirmasi", cancel: "Batal" }}>
        {children}
      </ModalsProvider>
      <Notifications position="top-center" autoClose={2000} />
    </MantineProvider>
  );
};
