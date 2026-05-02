const BASE_URL = 'http://localhost:8080/api'; // La URL de tu Spring Boot

export const API_ENDPOINTS = {
  actividades: `${BASE_URL}/actividades`,
  procesos: `${BASE_URL}/procesos`,
  usuarios: `${BASE_URL}/usuarios`,
  roles: `${BASE_URL}/roles`,
  arco: `${BASE_URL}/arcos`,
  empresas: `${BASE_URL}/empresas`,
  gateways: `${BASE_URL}/gateways`
  // Agrega los demás endpoints que necesites aquí
};