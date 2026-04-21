import { useUpload } from "@/contexts/UploadContext";
import Index from "./Index";
import WelcomeHome from "./WelcomeHome";

const HomePage = () => {
  const { hasUploaded } = useUpload();
  return hasUploaded ? <WelcomeHome /> : <Index />;
};

export default HomePage;
