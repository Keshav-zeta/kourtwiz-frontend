import { useMutation, UseMutationResult } from '@tanstack/react-query';

interface Config {
  onCompleteCallback: (data: unknown) => void;
  onErrorCallback?: (error: Error) => void; // Optional error callback
}

type UploadProps = {
  image: string;
  clubName: string;
};

export const useSendImage = (
  config: Config
): UseMutationResult<unknown, Error, UploadProps> => {
  return useMutation({
    mutationFn: async ({ image, clubName }: UploadProps) => {
      const response = await fetch("http://52.91.80.111:8550/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, clubName }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      config.onCompleteCallback(data);
    },
    onError: (error) => {
      console.error("❌ Upload failed:", error);
      if (config.onErrorCallback) {
        config.onErrorCallback(error);
      }
    },
  });
};
