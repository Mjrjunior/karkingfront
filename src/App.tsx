import { useState } from "react";
import Button from "./components/Button";
import Container from "./components/Container";
import Input from "./components/Input";
import Title from "./components/Title";
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();

  const [placa, setPlaca] = useState("");

  const consulte = async () => {
    try {
      const response = await fetch(
        `https://karking-api.zaqbit.com/vehicles/${placa}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro na requisição");
      }
      console.log("response", response);
      const data = await response.json();
      navigate("/payment", { state: { placaInfo: data, nPlaca: placa} });
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      alert("Placa não encontrada");
    }
  };

  return (
    <Container>
      <Title />
      <Input
        content="Placa"
        value={placa}
        onChange={(e) => setPlaca(e.target.value)}
      />
      <Button content="Consultar" onClick={consulte} />
    </Container>
  );
}

export default App;
