/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// Crear el contexto
const FormContext = createContext();

// Proveedor del contexto
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});

  const updateFormData = (step, data) => {
    setFormData((prev) => ({ ...prev, [step]: data }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook para usar el contexto
export const useFormContext = () => useContext(FormContext);

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
