const paddingNumber = (number: number, digits = 2) => {
  return number.toString().padStart(digits, '0');
};

export const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const result = `Ngày ${paddingNumber(day)}/${paddingNumber(month + 1)}/${year}`;

  return result;
};

export const formatSmartContractName = (fileName: string) => {
  if (fileName) {
    const segments = fileName.split('.');

    const nameSegments = segments[0].split(/[^a-zA-Z | ^0-9]/gm);

    const result = nameSegments
      .map((segment) => `${segment[0].toUpperCase()}${segment.slice(1)}`)
      .join(' ');

    return result;
  }

  return fileName;
};
