import { ExpertResponse, RequestData } from '../types';
import { mockExpertResponses } from '../data/mockData';

export const submitRequest = async (requestData: Partial<RequestData>): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};

export const fetchExpertResponses = async (requestId: string): Promise<ExpertResponse[]> => {
  return new Promise((resolve) => {
    // Simulate fetching responses
    setTimeout(() => {
      resolve(mockExpertResponses);
    }, 1000);
  });
};

export const fetchExpertResponseDetail = async (expertId: string): Promise<ExpertResponse | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockExpertResponses.find((expert: any) => expert.id === expertId));
    }, 500);
  });
};
