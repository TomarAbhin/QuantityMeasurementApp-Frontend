import api from './axios';

const QuantityService = {
  compare: async (thisQuantity, thatQuantity) => {
    const response = await api.post('/api/v1/quantities/compare', {
      thisQuantityDTO: thisQuantity,
      thatQuantityDTO: thatQuantity,
    });
    return response.data;
  },

  convert: async (thisQuantity, thatQuantity) => {
    const response = await api.post('/api/v1/quantities/convert', {
      thisQuantityDTO: thisQuantity,
      thatQuantityDTO: thatQuantity,
    });
    return response.data;
  },

  add: async (thisQuantity, thatQuantity) => {
    const response = await api.post('/api/v1/quantities/add', {
      thisQuantityDTO: thisQuantity,
      thatQuantityDTO: thatQuantity,
    });
    return response.data;
  },

  subtract: async (thisQuantity, thatQuantity) => {
    const response = await api.post('/api/v1/quantities/subtract', {
      thisQuantityDTO: thisQuantity,
      thatQuantityDTO: thatQuantity,
    });
    return response.data;
  },

  divide: async (thisQuantity, thatQuantity) => {
    const response = await api.post('/api/v1/quantities/divide', {
      thisQuantityDTO: thisQuantity,
      thatQuantityDTO: thatQuantity,
    });
    return response.data;
  },

  getOperationHistory: async (operation) => {
    const response = await api.get(`/api/v1/quantities/history/operation/${operation}`);
    return response.data;
  },

  getMeasurementsByType: async (type) => {
    const response = await api.get(`/api/v1/quantities/history/type/${type}`);
    return response.data;
  },

  getOperationCount: async (operation) => {
    const response = await api.get(`/api/v1/quantities/count/${operation}`);
    return response.data;
  },

  getErrorHistory: async () => {
    const response = await api.get('/api/v1/quantities/history/errored');
    return response.data;
  },
};

export default QuantityService;
