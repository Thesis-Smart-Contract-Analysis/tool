import { axiosApiInstance } from '../axios';

export const scanFile = async (fileName: string) => {
  return await axiosApiInstance.get(`/scan?filename=${fileName}`);
};

export const scanSourceCode = async (sourceCode: string) => {
  return await axiosApiInstance.get(`/scan?string=${sourceCode}`);
};
