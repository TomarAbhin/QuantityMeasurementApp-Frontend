import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiClock, FiFilter, FiAlertTriangle, FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import QuantityService from '../api/quantityService';

const History = () => {
  const [activeTab, setActiveTab] = useState('operation');
  const [selectedFilter, setSelectedFilter] = useState('compare');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  const operationFilters = ['compare', 'convert', 'add', 'subtract', 'divide'];
  const typeFilters = ['LengthUnit', 'WeightUnit', 'VolumeUnit', 'TemperatureUnit'];

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      let data;
      if (activeTab === 'operation') {
        data = await QuantityService.getOperationHistory(selectedFilter);
      } else if (activeTab === 'type') {
        data = await QuantityService.getMeasurementsByType(selectedFilter);
      } else {
        data = await QuantityService.getErrorHistory();
      }
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load history');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab, selectedFilter]);

  useEffect(() => {
    if (activeTab === 'operation') {
      setSelectedFilter('compare');
    } else if (activeTab === 'type') {
      setSelectedFilter('LengthUnit');
    }
  }, [activeTab]);

  const getOperationSymbol = (op) => {
    const symbols = {
      compare: '⚖️',
      convert: '🔄',
      add: '➕',
      subtract: '➖',
      divide: '➗',
    };
    return symbols[op] || '📊';
  };

  const getTypeLabel = (type) => {
    const labels = {
      LengthUnit: '📏 Length',
      WeightUnit: '⚖️ Weight',
      VolumeUnit: '🧪 Volume',
      TemperatureUnit: '🌡️ Temperature',
    };
    return labels[type] || type;
  };

  return (
    <div className="history-page">
      <motion.div
        className="history-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="history-title">
          <FiClock className="title-icon" />
          <h1>Measurement History</h1>
        </div>
        <motion.button
          className="refresh-btn"
          onClick={fetchHistory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiRefreshCw className={isLoading ? 'spinning' : ''} />
          <span>Refresh</span>
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="history-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className={`tab-btn ${activeTab === 'operation' ? 'active' : ''}`}
          onClick={() => setActiveTab('operation')}
        >
          <FiFilter />
          <span>By Operation</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'type' ? 'active' : ''}`}
          onClick={() => setActiveTab('type')}
        >
          <FiFilter />
          <span>By Type</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'errors' ? 'active' : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          <FiAlertTriangle />
          <span>Errors</span>
        </button>
      </motion.div>

      {/* Filters */}
      {activeTab !== 'errors' && (
        <motion.div
          className="filter-chips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {(activeTab === 'operation' ? operationFilters : typeFilters).map((filter) => (
            <motion.button
              key={filter}
              className={`filter-chip ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === 'operation' ? getOperationSymbol(filter) : ''}{' '}
              {activeTab === 'operation'
                ? filter.charAt(0).toUpperCase() + filter.slice(1)
                : getTypeLabel(filter)}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* History List */}
      <div className="history-list">
        {isLoading ? (
          <div className="history-loading">
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <motion.div
            className="history-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">📭</div>
            <h3>No records found</h3>
            <p>Perform some measurements to see them here</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={index}
                className={`history-item ${item.error ? 'error-item' : ''} ${expandedItem === index ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setExpandedItem(expandedItem === index ? null : index)}
              >
                <div className="history-item-header">
                  <div className="item-operation">
                    <span className="op-symbol">{getOperationSymbol(item.operation)}</span>
                    <span className="op-name">{item.operation}</span>
                  </div>
                  <div className="item-summary">
                    <span className="item-values">
                      {item.thisValue} {item.thisUnit}
                      {item.operation !== 'convert' && (
                        <>
                          {' '}
                          → {item.thatValue} {item.thatUnit}
                        </>
                      )}
                    </span>
                  </div>
                  <FiChevronDown className={`expand-icon ${expandedItem === index ? 'rotated' : ''}`} />
                </div>

                <AnimatePresence>
                  {expandedItem === index && (
                    <motion.div
                      className="history-item-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="detail-grid">
                        <div className="detail-section">
                          <h4>Input</h4>
                          <p>
                            Quantity 1: {item.thisValue} {item.thisUnit} ({item.thisMeasurementType})
                          </p>
                          <p>
                            Quantity 2: {item.thatValue} {item.thatUnit} ({item.thatMeasurementType})
                          </p>
                        </div>
                        <div className="detail-section">
                          <h4>Result</h4>
                          {item.error ? (
                            <p className="error-text">⚠️ {item.errorMessage}</p>
                          ) : (
                            <>
                              {item.resultString && <p>Comparison: {item.resultString}</p>}
                              {item.resultValue !== undefined && item.resultValue !== 0 && (
                                <p>
                                  Value: {item.resultValue} {item.resultUnit || ''}
                                </p>
                              )}
                              {item.resultMeasurementType && (
                                <p>Type: {item.resultMeasurementType}</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default History;
