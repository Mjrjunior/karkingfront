import Title from "@/components/Title";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    document.title = "Admin | Embarc Parking";

    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          `https://karking-api.zaqbit.com/vehicles/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": import.meta.env.VITE_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const totalAmount = vehicles.reduce(
    (total, vehicle) => total + vehicle.paidAmount,
    0
  );

  return (
    <div>
      <Title />
      <Table className="w-[700px] rounded-[10px] max-h-96 bg-[#3d3d3d]">
        <TableCaption className="text-white">Painel Geral</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] rounded-tl-[10px] text-white font-medium">
              Placa
            </TableHead>
            <TableHead className="text-white font-medium">Status</TableHead>
            <TableHead className="text-white font-medium">Tempo</TableHead>
            <TableHead className="rounded-tr-[10px] text-white font-medium">
              Quantia
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.plate}>
              <TableCell>{vehicle.plate}</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell></TableCell>
              <TableCell>{vehicle.paidAmount}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-white font-medium">
              Total
            </TableCell>
            <TableCell className="text-white font-medium">
              {totalAmount}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
