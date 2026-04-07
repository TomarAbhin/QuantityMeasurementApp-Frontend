import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlay, FiRefreshCw } from 'react-icons/fi';
import { MEASUREMENT_TYPES, OPERATIONS } from '../utils/constants';
import QuantityService from '../api/quantityService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Operation selection
  const [selectedOperation, setSelectedOperation] = useState('convert');

  // Measurement type
  const [measurementType, setMeasurementType] = useState('LengthUnit');

  // Quantity 1
  const [value1, setValue1] = useState('');
  const [unit1, setUnit1] = useState('');

  // Quantity 2
  const [value2, setValue2] = useState('');
  const [unit2, setUnit2] = useState('');

  // Result
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({});

  const currentType = MEASUREMENT_TYPES[measurementType];
  const availableUnits = currentType?.units || [];

  // Filter operations for temperature (no arithmetic)
  const availableOperations = currentType?.noArithmetic
    ? OPERATIONS.filter((op) => ['compare', 'convert'].includes(op.value))
    : OPERATIONS;

  useEffect(() => {
    if (availableUnits.length > 0) {
      setUnit1(availableUnits[0].value);
      setUnit2(availableUnits.length > 1 ? availableUnits[1].value : availableUnits[0].value);
    }
    setResult(null);
  }, [measurementType]);

  useEffect(() => {
    if (currentType?.noArithmetic && !['compare', 'convert'].includes(selectedOperation)) {
      setSelectedOperation('convert');
    }
  }, [measurementType, selectedOperation, currentType]);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const ops = ['compare', 'convert', 'add', 'subtract', 'divide'];
        const counts = {};
        for (const op of ops) {
          try {
            counts[op] = await QuantityService.getOperationCount(op);
          } catch {
            counts[op] = 0;
          }
        }
        setStats(counts);
      } catch {
        // Silently fail stats loading
      }
    };
    loadStats();
  }, [result]);

  const handleCalculate = async () => {
    if (!value1 || (selectedOperation !== 'convert' && !value2)) {
      toast.error('Please enter all required values');
      return;
    }

    const thisQuantity = {
      value: parseFloat(value1),
      unit: unit1,
      measurementType,
    };

    const thatQuantity = {
      value: selectedOperation === 'convert' ? 0 : parseFloat(value2),
      unit: unit2,
      measurementType,
    };

    setIsLoading(true);
    try {
      let response;
      switch (selectedOperation) {
        case 'compare':
          response = await QuantityService.compare(thisQuantity, thatQuantity);
          break;
        case 'convert':
          response = await QuantityService.convert(thisQuantity, thatQuantity);
          break;
        case 'add':
          response = await QuantityService.add(thisQuantity, thatQuantity);
          break;
        case 'subtract':
          response = await QuantityService.subtract(thisQuantity, thatQuantity);
          break;
        case 'divide':
          response = await QuantityService.divide(thisQuantity, thatQuantity);
          break;
        default:
          break;
      }
      setResult(response);
      toast.success('Calculation complete! ✨');
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.errorMessage || 'Operation failed';
      toast.error(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const getResultDisplay = () => {
    if (!result) return null;

    if (selectedOperation === 'compare') {
      const isEqual = result.resultString === 'true';
      return (
        <div className={`result-compare ${isEqual ? 'equal' : 'not-equal'}`}>
          <div className="result-icon">{isEqual ? '✅' : '❌'}</div>
          <div className="result-text">
            {isEqual
              ? 'Quantities are EQUAL!'
              : 'Quantities are NOT equal'}
          </div>
          <div className="result-detail">
            {result.thisValue} {result.thisUnit} {isEqual ? '=' : '≠'}{' '}
            {result.thatValue} {result.thatUnit}
          </div>
        </div>
      );
    }

    if (selectedOperation === 'convert') {
      return (
        <div className="result-convert">
          <div className="result-icon">🔄</div>
          <div className="result-value">{result.resultValue}</div>
          <div className="result-detail">
            {result.thisValue} {result.thisUnit} = {result.resultValue} {result.thatUnit}
          </div>
        </div>
      );
    }

    // Arithmetic operations
    const opSymbol = { add: '+', subtract: '−', divide: '÷' }[selectedOperation];
    return (
      <div className="result-arithmetic">
        <div className="result-icon">🧮</div>
        <div className="result-value">
          {result.resultValue}
          {result.resultUnit && <span className="result-unit"> {result.resultUnit}</span>}
        </div>
        <div className="result-detail">
          {result.thisValue} {result.thisUnit} {opSymbol} {result.thatValue}{' '}
          {result.thatUnit} = {result.resultValue} {result.resultUnit || ''}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <motion.div
        className="welcome-banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-content">
          <h1>Hello, {user?.username}! 👋</h1>
          <p>Perform precise quantity measurements and conversions</p>
        </div>
        <div className="quick-stats">
          {Object.entries(stats).map(([op, count]) => (
            <div key={op} className="stat-chip">
              <span className="stat-label">{op}</span>
              <span className="stat-count">{count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="dashboard-grid">
        {/* Operation Selection */}
        <motion.div
          className="card operations-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="card-title">Operation</h2>
          <div className="operations-grid">
            {availableOperations.map((op) => (
              <motion.button
                key={op.value}
                className={`operation-btn ${selectedOperation === op.value ? 'active' : ''}`}
                onClick={() => {
                  setSelectedOperation(op.value);
                  setResult(null);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="op-icon">{op.icon}</span>
                <span className="op-label">{op.label}</span>
                <span className="op-desc">{op.description}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Measurement Calculator */}
        <motion.div
          className="card calculator-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="card-title">
            {OPERATIONS.find((o) => o.value === selectedOperation)?.icon}{' '}
            {OPERATIONS.find((o) => o.value === selectedOperation)?.label} Quantities
          </h2>

          {/* Measurement Type Selector */}
          <div className="type-selector">
            {Object.entries(MEASUREMENT_TYPES).map(([key, type]) => (
              <motion.button
                key={key}
                className={`type-btn ${measurementType === key ? 'active' : ''}`}
                style={{
                  '--type-color': type.color,
                }}
                onClick={() => setMeasurementType(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="type-icon">{type.icon}</span>
                <span>{type.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Input Fields */}
          <div className="calculator-inputs">
            <div className="quantity-input-group">
              <label>Quantity 1</label>
              <div className="quantity-row">
                <input
                  id="quantity-value-1"
                  type="number"
                  placeholder="Enter value"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  step="any"
                />
                <select
                  id="quantity-unit-1"
                  value={unit1}
                  onChange={(e) => setUnit1(e.target.value)}
                >
                  {availableUnits.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedOperation === 'convert' ? (
              <div className="convert-arrow">
                <div className="arrow-line"></div>
                <span>Convert to</span>
                <div className="arrow-line"></div>
              </div>
            ) : (
              <div className="operation-divider">
                <span className="divider-symbol">
                  {
                    { compare: '⚖️', add: '+', subtract: '−', divide: '÷' }[
                      selectedOperation
                    ]
                  }
                </span>
              </div>
            )}

            <div className="quantity-input-group">
              <label>{selectedOperation === 'convert' ? 'Target Unit' : 'Quantity 2'}</label>
              <div className="quantity-row">
                {selectedOperation !== 'convert' && (
                  <input
                    id="quantity-value-2"
                    type="number"
                    placeholder="Enter value"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    step="any"
                  />
                )}
                <select
                  id="quantity-unit-2"
                  value={unit2}
                  onChange={(e) => setUnit2(e.target.value)}
                  className={selectedOperation === 'convert' ? 'full-width' : ''}
                >
                  {availableUnits.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="calculator-actions">
            <motion.button
              className="calc-btn primary"
              onClick={handleCalculate}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="btn-spinner"></div>
              ) : (
                <>
                  <FiPlay />
                  <span>Calculate</span>
                </>
              )}
            </motion.button>
            <motion.button
              className="calc-btn secondary"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiRefreshCw />
              <span>Reset</span>
            </motion.button>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="result-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                {getResultDisplay()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
