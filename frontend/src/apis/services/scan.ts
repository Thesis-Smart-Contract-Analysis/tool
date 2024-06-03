import { SCANNING_TOOL } from "@/enums";
import { axiosApiInstance } from "../axios";

export const scanFile = async (fileName: string, tool: SCANNING_TOOL) => {
  return await axiosApiInstance.get(`/scan?tool=${tool}&filename=${fileName}`);
};

export const scanSourceCode = async (
  sourceCode: string,
  tool: SCANNING_TOOL
) => {
  return await axiosApiInstance.get(
    `/scan?tool=${tool}&string=${encodeURIComponent(sourceCode)}`
  );
};
