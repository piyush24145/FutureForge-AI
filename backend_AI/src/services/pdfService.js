const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);

    const instance = new PDFParse({ data: dataBuffer });
    const data = await instance.getText();

    return data.text;
};

module.exports = {
    extractTextFromPDF,
};