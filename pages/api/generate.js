import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import JSZip from "jszip";


export default async function handler(req, res) {
  const { entries } = req.body;

  const template1 = fs.readFileSync(
    path.join(process.cwd(), "public/document.docx"),
    "binary"
  );

  const template2 = fs.readFileSync(
    path.join(process.cwd(), "public/note.docx"),
    "binary"
  );

  const zip = new JSZip();

  entries.forEach((data, i) => {
    [template1, template2].forEach((template, index) => {
      const zipContent = new PizZip(template);
      const doc = new Docxtemplater(zipContent);

      try {
        doc.render(data);
      } catch (err) {
        console.error(err);
      }

      const buffer = doc.getZip().generate({ type: "nodebuffer" });

      const safeName = `${data.anr}_${data.anr_year}_${i + 1}`;

      const fileName =
        index === 0
          ? `Cover Letter ${safeName}.docx`
          : `Note ${safeName}.docx`;

      zip.file(fileName, buffer);
    });
  });

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=documents.zip");

  res.send(zipBuffer);
}