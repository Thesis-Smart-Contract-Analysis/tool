import { axiosApiInstance } from "../axios";

export const uploadFile = async (file: File) => {
  const formData = new FormData();

  formData.append("filename", file);

  return await axiosApiInstance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUploadFile = async (fileName: string) => {
  return await axiosApiInstance.get(`/upload/${fileName}`);
};
