import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    // Determine initial currency from localStorage or default to INR
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('app_currency');
        return saved || 'INR';
    });

    // Exchange rates relative to USD (assuming base JSON prices are originally in USD)
    const exchangeRates = {
        USD: 1,
        INR: 83.5, // 1 USD = ~83.5 INR
        EUR: 0.92,
        GBP: 0.79,
    };

    const currencySymbols = {
        USD: '$',
        INR: '₹',
        EUR: '€',
        GBP: '£'
    };

    useEffect(() => {
        localStorage.setItem('app_currency', currency);
    }, [currency]);

    // Format price function taking amount.
    // If isLocal is true, it treats the number as already being in the current currency (no conversion).
    const formatPrice = (amount, isLocal = false) => {
        const rate = isLocal ? 1 : (exchangeRates[currency] || 1);
        const converted = amount * rate;
        const symbol = currencySymbols[currency] || '$';
        
        // Use local format for INR specifically and general for others
        if (currency === 'INR') {
            return `${symbol}${converted.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        }
        return `${symbol}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    };
    
    // Parse value backward for ranges (e.g. Budget Slider in INR)
    const convertToUsd = (localAmount) => {
        const rate = exchangeRates[currency] || 1;
        return localAmount / rate;
    };
    
    // Get local value strictly for sliders
    const getLocalAmount = (baseUsdAmount) => {
        const rate = exchangeRates[currency] || 1;
        return baseUsdAmount * rate;
    };

    const handleCurrencyChange = (newCurrency) => {
        if (exchangeRates[newCurrency]) {
            setCurrency(newCurrency);
        }
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency: handleCurrencyChange,
            formatPrice,
            convertToUsd,
            getLocalAmount,
            currencies: Object.keys(exchangeRates)
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};
