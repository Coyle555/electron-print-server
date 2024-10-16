import net from "net";

const Controller = {
  getAllNetworkPrinters: async (request) => {
    const networkPrefix = "192.168.1";

    try {
      const printers = await scanForPrinters(networkPrefix);
      console.log("Printers found:", printers);
      return printers;
    } catch (error) {
      console.log("Error discovering printers:", error);
      return `Error discovering printers: ${error.message}`;
    }
  },
  sendZplToPrinter: async (zpl, ipAddress, port = 9100) => {
    try {
      return await new Promise((resolve, reject) => {
        const client = new net.Socket();

        client.connect(port, ipAddress, () => {
          console.log(`Connected to printer at ${ipAddress}:${port}`);
          client.write(zpl, () => {
            console.log("ZPL data sent to printer");
            client.end();
            resolve({ message: "Success!", status: 200 });
          });
        });

        client.on("error", (err) => {
          console.log("Error:", err);
          reject(new Error(`Error: ${err.message}`));
        });

        client.on("close", () => {
          console.log("Connection closed");
        });
      });
    } catch (err) {
      console.error("Failed to send ZPL to printer:", err);
      return { message: err.message, status: 500 };
    }
  },
};

async function scanForPrinters(networkPrefix, port = 9100) {
  const printers = [];
  const timeout = 3000; // 2 seconds timeout
  const maxHosts = 255; // Adjust based on your subnet

  const scanPromises = [];

  for (let i = 1; i <= maxHosts; i++) {
    const ipAddress = `${networkPrefix}.${i}`;

    const promise = new Promise((resolve) => {
      const socket = new net.Socket();
      let isPrinter = false;

      socket.setTimeout(timeout);

      socket.connect(port, ipAddress, () => {
        isPrinter = true;
        socket.destroy();
      });

      socket.on("timeout", () => {
        socket.destroy();
      });

      socket.on("error", () => {
        // Ignore errors
      });

      socket.on("close", () => {
        if (isPrinter) {
          printers.push(ipAddress);
        }
        resolve();
      });
    });

    scanPromises.push(promise);
  }

  await Promise.all(scanPromises);
  console.log("Printers discovered:", printers);
  return printers;
}

export default Controller;
