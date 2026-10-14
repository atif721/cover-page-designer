import { Font } from "@react-pdf/renderer";
import regular from "@/assets/fonts/Times New Roman.ttf";
import bold from "@/assets/fonts/Times New Roman Bold.ttf";
import italic from "@/assets/fonts/Times New Roman Italic.ttf";
import boldItalic from "@/assets/fonts/Times New Roman Bold Italic.ttf";

Font.register({
  family: "Times New Roman",
  fonts: [
    { src: regular, fontWeight: 400 },
    { src: bold, fontWeight: 700 },
    { src: italic, fontStyle: "italic" },
    { src: boldItalic, fontWeight: 700, fontStyle: "italic" },
  ],
});
