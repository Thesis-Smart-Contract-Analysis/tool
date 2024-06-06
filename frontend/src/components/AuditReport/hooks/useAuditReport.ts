import { Font, StyleSheet } from '@react-pdf/renderer';
import { primary_blue_500 } from '@/utils/constant';

/**
 * Custom font in @react-pdf/renderer
 * Refs: https://stackoverflow.com/questions/70126411/how-to-add-custom-font-in-react-pdf-pdf
 */
Font.register({
  family: 'Roboto',
  src: '/src/fonts/Roboto-Regular.ttf',
  fonts: [
    {
      src: '/src/fonts/Roboto-Thin.ttf',
      fontWeight: 'thin',
    },
    {
      src: '/src/fonts/Roboto-Light.ttf',
      fontWeight: 'light',
    },
    {
      src: '/src/fonts/Roboto-Medium.ttf',
      fontWeight: 'medium',
    },
    {
      src: '/src/fonts/Roboto-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/src/fonts/Roboto-Black.ttf',
      fontWeight: 'heavy',
    },
  ],
});

const useAuditReport = () => {
  const frontPageStyles = StyleSheet.create({
    root: {
      backgroundColor: '#b6e6ff',
      padding: 30,
      fontFamily: 'Roboto',
    },
    // root container
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
    },
    // Header section
    header: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    header__logo: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
    },
    logoImage: {
      width: 24,
      height: 24,
    },
    logoText: {
      fontSize: 18,
      fontFamily: 'Roboto',
      fontWeight: 'medium',
    },
    header__text: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.5)',
    },
    // Body section
    body: {
      gap: 32,
    },
    body__title: {
      fontSize: 24,
      fontWeight: 'medium',
    },
    body__description: {
      gap: 12,
    },
    contractName: {
      fontSize: 32,
      fontWeight: 'black',
    },
    date: {
      fontSize: 24,
    },
    body__smallText: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.5)',
    },
    // Footer section
    footer: {
      flexDirection: 'row-reverse',
    },
    footer__smallText: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.5)',
    },
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 30,
      paddingBottom: 60,
      paddingHorizontal: 30,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Roboto',
    },
    author: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: 'Roboto',
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman',
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      fontFamily: 'Roboto',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    header__logo: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
    },
    logoImage: {
      width: 24,
      height: 24,
    },
    logoText: {
      fontSize: 12,
      fontFamily: 'Roboto',
      fontWeight: 'medium',
    },
    header__text: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.5)',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Roboto',
      color: 'rgba(0,0,0,0.5)',
      fontSize: 12,
    },
    pageNumber: {},
    footerText: {},
  });

  const severityStyles = StyleSheet.create({
    container: {
      fontFamily: 'Roboto',
    },
    section: {
      flexDirection: 'row',
      gap: 12,
      color: primary_blue_500,
    },
    section__number: {
      fontWeight: 'bold',
    },
    section__text: {
      fontWeight: 'medium',
    },
    body: {
      marginTop: 12,
      gap: 12,
    },
    description: {
      fontSize: 14,
    },
    severityList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    severityItem: {
      gap: 4,
    },
    severityType: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    severityColor: {
      width: 8,
      height: 8,
      borderRadius: '50%',
    },
    type: {
      fontSize: 14,
      fontWeight: 'medium',
    },
    severityDescription: {
      fontSize: 14,
    },
  });

  const summaryResultStyles = StyleSheet.create({
    container: {
      fontFamily: 'Roboto',
    },
    section: {
      flexDirection: 'row',
      gap: 12,
      color: primary_blue_500,
    },
    section__number: {
      fontWeight: 'bold',
    },
    section__text: {
      fontWeight: 'medium',
    },
    body: {
      marginTop: 16,
      gap: 12,
    },
    table: {
      display: 'flex',
      width: '100%',
      fontSize: 12,
    },
    tableHeader: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0.1)',
      fontWeight: 'medium',
    },
    tableColumn: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '8px 0',
      gap: 4,
      border: '1px solid gray',
    },
    tableRows: {
      display: 'flex',
      width: '100%',
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
    },
  });

  const detailResultStyles = StyleSheet.create({
    container: {
      fontFamily: 'Roboto',
    },
    section: {
      flexDirection: 'row',
      gap: 12,
      color: primary_blue_500,
    },
    section__number: {
      fontWeight: 'bold',
    },
    section__text: {
      fontWeight: 'medium',
    },
    body: {
      gap: 12,
      marginTop: 12,
    },
    description: {
      fontSize: 14,
      padding: 8,
      borderRadius: 8,
      marginLeft: 24,
      border: '1px solid gray',
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    vulnLocation: {
      color: 'red',
      fontWeight: 'bold',
      border: '1px solid red',
      borderRadius: 6,
      fontSize: 12,
      margin: 0,
      padding: '2px 5px 2px 7px',
    },
    vulnMatched: {
      fontSize: 14,
      padding: 8,
      borderRadius: 8,
      border: '1px solid gray',
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
  });

  return {
    styles,
    frontPageStyles,
    severityStyles,
    summaryResultStyles,
    detailResultStyles,
  };
};

export default useAuditReport;
