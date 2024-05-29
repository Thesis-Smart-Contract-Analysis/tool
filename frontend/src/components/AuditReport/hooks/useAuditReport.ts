import { Font, StyleSheet } from "@react-pdf/renderer";

/**
 * Custom font in @react-pdf/renderer
 * Refs: https://stackoverflow.com/questions/70126411/how-to-add-custom-font-in-react-pdf-pdf
 */
Font.register({
  family: "Roboto",
  src: "/src/fonts/Roboto-Regular.ttf",
  fonts: [
    {
      src: "/src/fonts/Roboto-Thin.ttf",
      fontWeight: "thin",
    },
    {
      src: "/src/fonts/Roboto-Light.ttf",
      fontWeight: "light",
    },
    {
      src: "/src/fonts/Roboto-Medium.ttf",
      fontWeight: "medium",
    },
    {
      src: "/src/fonts/Roboto-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/src/fonts/Roboto-Black.ttf",
      fontWeight: "heavy",
    },
  ],
});

const useAuditReport = () => {
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontFamily: "Roboto",
    },
    author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: "Roboto",
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: "center",
      color: "grey",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });

  const frontPageStyles = StyleSheet.create({
    root: {
      backgroundColor: "#b6e6ff",
      padding: "24px",
      fontFamily: "Roboto",
    },
    container: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
    },
    header: {
      flexDirection: "row",
      gap: "4px",
      alignItems: "center",
      justifyContent: "space-between",
    },
    header__logo: {
      flexDirection: "row",
      gap: "4px",
      alignItems: "center",
    },
    logoImage: {
      width: "24px",
      height: "24px",
    },
    logoText: {
      fontSize: "18px",
      fontFamily: "Roboto",
      fontWeight: "medium",
    },
    header__text: {
      fontSize: "16px",
      color: "rgba(0,0,0,0.5)",
    },
    footer: {
      flexDirection: "row-reverse",
    },
    body: {
      gap: "32px",
    },
    body__title: {
      fontSize: "24px",
      fontWeight: "medium",
    },
    body__description: {
      gap: "12px",
    },
    contractName: {
      fontSize: "32px",
      fontWeight: "black",
    },
    date: {
      fontSize: "24px",
    },
    body__smallText: {
      fontSize: "16px",
      color: "rgba(0,0,0,0.5)",
    },
    footer__smallText: {
      fontSize: "16px",
      color: "rgba(0,0,0,0.5)",
    },
    title: {
      margin: "auto",
    },
  });

  return { styles, frontPageStyles };
};

export default useAuditReport;
