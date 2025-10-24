import { BACKEND_BASE_URL } from '../constants';

export const fetchAddressSuggestions = async (query) => {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/places-autocomplete?input=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      console.error('Failed to fetch address suggestions from backend.');
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling address suggestions API:', error);
    return [];
  }
};
