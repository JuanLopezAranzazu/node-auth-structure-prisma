import fs from "fs";
import path from "path";

export const logEvents = (message: string): void => {
  const logFilePath = path.join(__dirname, "../logs.txt");
  const logMessage = `${new Date().toISOString()} - ${message}\n`;

  // escribe en el archivo de log
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Error al escribir en el log:", err);
  });
};
