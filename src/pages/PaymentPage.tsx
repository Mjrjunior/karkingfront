import Title from "../components/Title";
import Container from "../components/Container";
import brazilFlag from "../assets/emojione-v1_flag-for-brazil.svg";
import Button from "../components/Button";
import hourIcon from "../assets/clock-nine-svgrepo-com 1.svg";
import dollarIcon from "../assets/dollar-svgrepo-com 1.svg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  parse,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

interface Vehicle {
  entryAt: string;
  plate: string;
  payToken: string;
  amountToPay: number;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { placaInfo, nPlaca } = location.state || {};
  const [vehicle, setVehicle] = useState<Vehicle>({
    entryAt: "",
    plate: "",
    payToken: "",
    amountToPay: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setVehicle(placaInfo);
    document.title = "Pagamento | Embarc Parking";
  }, [placaInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!vehicle.entryAt) {
    return <div>Loading...</div>;
  }

  const entryAt = parse(vehicle.entryAt, "dd/MM/yyyy HH:mm:ss", new Date());
  const now = currentTime;

  const hoursDifference = differenceInHours(now, entryAt);
  const minutesDifference = differenceInMinutes(now, entryAt) % 60;
  const secondsDifference = differenceInSeconds(now, entryAt) % 60;

  const formattedTimeDifference = `${String(hoursDifference).padStart(
    2,
    "0"
  )}:${String(minutesDifference).padStart(2, "0")}:${String(
    secondsDifference
  ).padStart(2, "0")}`;

  const handlePayment = async () => {
    try {
      const response = await fetch(
        `https://karking-api.zaqbit.com/vehicles/${nPlaca}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({
            token: token,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const data = await response.json();
      console.log("Payment successful:", data);
      navigate("/paid");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Container>
      <Title />
      <div className="mb-[30px]">
        <label
          htmlFor="input"
          className="font-poppins text-white text-[1.25rem] mb-[5px]"
        >
          Placa
        </label>
        <div className="w-52 py-1 bg-[#08399C] relative rounded-t-[5px]">
          <h6 className="font-poppins text-white text-xs font-semibold text-center">
            BRASIL
          </h6>
          <img src={brazilFlag} alt="" className="absolute top-[2px] right-1" />
        </div>
        <input
          value={nPlaca}
          type="text"
          name="input"
          id="input"
          readOnly
          className="w-52 py-3 text-center outline-none font-pt-sans-narrow text-[1.25rem] uppercase rounded-b-[5px]"
        />
      </div>

      <div className="bg-[#3d3d3d] w-[270px] rounded-[10px] px-[15px] py-[20px] mb-[30px]">
        <div className="mb-[20px]">
          <h6 className="text-[1.25rem] text-white font-poppins mb-[5px]">
            Tempo
          </h6>
          <div className="flex gap-[10px] items-center">
            <img src={hourIcon} alt="" />
            <span className="text-[1.25rem] text-white font-poppins">
              {formattedTimeDifference}
            </span>
          </div>
        </div>
        <div>
          <h6 className="text-[1.25rem] text-white font-poppins mb-[5px]">
            Tarifa
          </h6>
          <div className="flex gap-[10px] items-center">
            <img src={dollarIcon} alt="" />
            <span className="text-[1.25rem] text-white font-poppins">
              R$ {vehicle.amountToPay}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col gap-3">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button content="efetuar pagamento" onClick={handlePayment} />
      </div>
    </Container>
  );
}
