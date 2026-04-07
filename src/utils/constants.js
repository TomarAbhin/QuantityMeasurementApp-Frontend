// Measurement types and their units for the Quantity Measurement App
export const MEASUREMENT_TYPES = {
  LengthUnit: {
    label: 'Length',
    icon: '📏',
    color: '#6C63FF',
    units: [
      { value: 'FEET', label: 'Feet' },
      { value: 'INCH', label: 'Inch' },
      { value: 'YARDS', label: 'Yards' },
      { value: 'CENTIMETERS', label: 'Centimeters' },
    ],
    baseUnit: 'Feet',
  },
  WeightUnit: {
    label: 'Weight',
    icon: '⚖️',
    color: '#FF6584',
    units: [
      { value: 'KILOGRAM', label: 'Kilogram' },
      { value: 'GRAM', label: 'Gram' },
      { value: 'POUND', label: 'Pound' },
    ],
    baseUnit: 'Kilogram',
  },
  VolumeUnit: {
    label: 'Volume',
    icon: '🧪',
    color: '#43E97B',
    units: [
      { value: 'LITRE', label: 'Litre' },
      { value: 'MILLILITRE', label: 'Millilitre' },
      { value: 'GALLON', label: 'Gallon' },
    ],
    baseUnit: 'Litre',
  },
  TemperatureUnit: {
    label: 'Temperature',
    icon: '🌡️',
    color: '#F7971E',
    units: [
      { value: 'CELSIUS', label: 'Celsius' },
      { value: 'FAHRENHEIT', label: 'Fahrenheit' },
      { value: 'KELVIN', label: 'Kelvin' },
    ],
    baseUnit: 'Celsius',
    noArithmetic: true,
  },
};

export const OPERATIONS = [
  { value: 'compare', label: 'Compare', icon: '⚖️', description: 'Check if two quantities are equal' },
  { value: 'convert', label: 'Convert', icon: '🔄', description: 'Convert between units' },
  { value: 'add', label: 'Add', icon: '➕', description: 'Add two quantities together' },
  { value: 'subtract', label: 'Subtract', icon: '➖', description: 'Subtract one from another' },
  { value: 'divide', label: 'Divide', icon: '➗', description: 'Divide one quantity by another' },
];
