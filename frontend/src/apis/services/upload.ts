import { axiosApiInstance } from '../axios';

export const uploadFile = async (file: File) => {
  return await axiosApiInstance.post('/upload', file);
};

export const getUploadFile = async (fileName: string) => {
  return await axiosApiInstance.get(`/upload/${fileName}`);
};
