import express from "express";
const router = express.Router();

const createZpl = (record) => {
  return `^XA
^PW812
^LL609

^FO50,30^A0N,60,60^FDContainer ID^FS
^FO50,100^A0N,80,80^${record.slip.loadId}-${record.slip.shipmentId}^FS

^FO50,200^BY3^BCN,150,Y,N,N^FD${record.slip.loadId}-${record.slip.shipmentId}^FS

^FO50,380^A0N,40,40^FDTracking Number:^FS
^FO400,380^A0N,40,40^${record.trackingNumber}^FS

^FO50,440^A0N,40,40^FDDock Date:^FS
^FO400,440^A0N,40,40^${new Date(
    record.slip.shipmentDate
  ).toLocaleDateString()}^FS

^FO50,500^A0N,40,40^FDPrint Date:^FS
^FO400,500^A0N,40,40^${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}^FS
  ^FO50,440^A0N,40,40^FDDock Date:^FS
^FO400,440^A0N,40,40^FD${new Date(
    record.slip.shipmentDate
  ).toLocaleDateString()}^FS

^FO50,500^A0N,40,40^FDPrint Date:^FS
^FO400,500^A0N,40,40^FD${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}^FS

^FO50,560^A0N,40,40^FDCustomer ID:^FS
^FO400,560^A0N,40,40^FD${record.slip.accountId}^FS

^FO50,620^A0N,40,40^FDReference Number:^FS
^FO400,620^A0N,40,40^FD${record.slip.returnReference}^FS

^FO50,680^A0N,40,40^FDMDSi Order Number:^FS
^FO400,680^A0N,40,40^FD${record.slip.mdsiOrderNumber}^FS

^FO50,740^BY3^BCN,150,Y,N,N^FD${record.slip.mdsiOrderNumber}^FS
^XZ`;
};

import Controller from "../controllers/controller.js";

router.get("/", async (req, res) => {
  return res.send("Welcome");
});

router.post("/sendPrintJob", async (req, res) => {
  const { ipAddress, port, printDetails } = req.body;

  const zpl = createZpl(printDetails[0]);

  const sendZplToPrinter = await Controller.sendZplToPrinter(
    zpl,
    ipAddress,
    port
  );

  return res.status(sendZplToPrinter.status).send(sendZplToPrinter.message);
});

router.get("/printers", async (req, res) => {
  try {
    const printers = await Controller.getAllNetworkPrinters();
    res.status(200).json({ printers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
