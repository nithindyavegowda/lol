import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC =
  "C:/Users/dyavegow/.cursor/projects/c-P-SCOOLZ/assets";

const items = [
  {
    n: "star-sling-bag",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-0f2048ef-7a19-4bf6-b4c3-fb38da895196.png",
  },
  {
    n: "octopus-stack",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-1e9fa8a3-b8a9-45a1-a3e8-6d2c1b19d5bc.png",
  },
  {
    n: "mint-frog",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-b0b507bc-e8d9-4e19-8c9d-a9031b2726a8.png",
  },
  {
    n: "honey-bee",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-b55b3efb-0936-4501-95b4-e1c4e77433bf.png",
  },
  {
    n: "pocket-dolls",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-f49edc26-b60a-4272-97be-32d6d9f1df2f.png",
  },
  {
    n: "jellyfish-trio",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-1c01e581-632b-492f-8c14-4b4902e6530a.png",
  },
  {
    n: "rainbow-throw",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-bf242baf-a5cc-42c8-aff2-74c08629d412.png",
  },
  {
    n: "petal-motif",
    f: "c__Users_dyavegow_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-deb8b11f-6358-4482-9e8d-81232ab29e93.png",
  },
];

fs.mkdirSync("public/assets/products", { recursive: true });
fs.mkdirSync("assets/products", { recursive: true });

for (const it of items) {
  const inP = path.join(SRC, it.f);
  if (!fs.existsSync(inP)) {
    console.error("missing", inP);
    continue;
  }
  const out = path.join("public/assets/products", `${it.n}.webp`);
  await sharp(inP).resize(1200, 1200, { fit: "cover" }).webp({ quality: 78 }).toFile(out);
  fs.copyFileSync(out, path.join("assets/products", `${it.n}.webp`));
  console.log(it.n, fs.statSync(out).size);
}
