import { Font } from "@react-pdf/renderer";
import RobotoCondensedRegular from "@/assets/fonts/RobotoCondensed-Regular.ttf";
import RobotoCondensedBold from "@/assets/fonts/RobotoCondensed-Bold.ttf";
import RobotoCondensedBoldItalic from "@/assets/fonts/RobotoCondensed-BoldItalic.ttf";
import RobotoCondensedMedium from "@/assets/fonts/RobotoCondensed-Medium.ttf";
import RobotoCondensedMediumItalic from "@/assets/fonts/RobotoCondensed-MediumItalic.ttf";
import RobotoCondensedSemiBold from "@/assets/fonts/RobotoCondensed-SemiBold.ttf";

Font.register({
  family: "Roboto Condensed",
  fonts: [
    { src: RobotoCondensedRegular, fontWeight: 400 },
    { src: RobotoCondensedMedium, fontWeight: 500 },
    { src: RobotoCondensedMediumItalic, fontWeight: 500, fontStyle: "italic" },
    { src: RobotoCondensedSemiBold, fontWeight: 600 },
    { src: RobotoCondensedBold, fontWeight: 700 },
    { src: RobotoCondensedBoldItalic, fontWeight: 700, fontStyle: "italic" },
  ],
});