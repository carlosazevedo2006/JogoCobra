import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipo de dados guardados nas definições
type SettingsType = {
  corTabuleiro: string;
  setCorTabuleiro: (c: string) => void;

  corCobra: string;
  setCorCobra: (c: string) => void;

  gridSize: number;
  setGridSize: (g: number) => void;

  tema: "claro" | "escuro";
  setTema: (t: "claro" | "escuro") => void;
};

// Criar o contexto
const SettingsContext = createContext<SettingsType | undefined>(undefined);

// Provider que envolve toda a aplicação
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [corTabuleiro, setCorTabuleiro] = useState("#1a1a1a");
  const [corCobra, setCorCobra] = useState("lime");
  const [gridSize, setGridSize] = useState(12);
  const [tema, setTema] = useState<"claro" | "escuro">("escuro");

  // ------------------------------
  // Carregar definições guardadas
  // ------------------------------
  useEffect(() => {
    async function carregar() {
      const s = await AsyncStorage.getItem("SETTINGS");
      if (s) {
        const obj = JSON.parse(s);
        if (obj.corTabuleiro) setCorTabuleiro(obj.corTabuleiro);
        if (obj.corCobra) setCorCobra(obj.corCobra);
        if (obj.gridSize) setGridSize(obj.gridSize);
        if (obj.tema) setTema(obj.tema);
      }
    }
    carregar();
  }, []);

  // ------------------------------
  // Guardar automaticamente quando muda
  // ------------------------------
  useEffect(() => {
    const save = async () => {
      await AsyncStorage.setItem(
        "SETTINGS",
        JSON.stringify({
          corTabuleiro,
          corCobra,
          gridSize,
          tema,
        })
      );
    };
    save();
  }, [corTabuleiro, corCobra, gridSize, tema]);

  return (
    <SettingsContext.Provider
      value={{
        corTabuleiro,
        setCorTabuleiro,

        corCobra,
        setCorCobra,

        gridSize,
        setGridSize,

        tema,
        setTema,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Hook para aceder ao contexto
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings deve ser usado dentro do SettingsProvider");
  return ctx;
}
