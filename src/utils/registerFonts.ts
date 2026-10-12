import { Font } from "@react-pdf/renderer";
import regular from "@/assets/fonts/LiberationSerif-Regular.ttf";
import bold from "@/assets/fonts/LiberationSerif-Bold.ttf";
import italic from "@/assets/fonts/LiberationSerif-Italic.ttf";
import boldItalic from "@/assets/fonts/LiberationSerif-BoldItalic.ttf";

Font.register({
  family: "Times New Roman",
  fonts: [
    { src: regular, fontWeight: 400 },
    { src: bold, fontWeight: 700 },
    { src: italic, fontStyle: "italic" },
    { src: boldItalic, fontWeight: 700, fontStyle: "italic" },
  ],
});
