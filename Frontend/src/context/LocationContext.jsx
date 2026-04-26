import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const detectLocation = () => {
        console.log("Detecting location...");
        setLoading(true);
        setError(null);
        if (!navigator.geolocation) {
            console.error("Geolocation not supported");
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log("Location detected successfuly:", coords);
                setLocation(coords);
                setLoading(false);
            },
            (err) => {
                console.error("Geolocation error:", err.message, err.code);
                let userFriendlyError = "Failed to detect location.";
                if (err.code === 1) userFriendlyError = "Location access denied. Please enable it in browser settings.";
                else if (err.code === 2) userFriendlyError = "Location unavailable.";
                else if (err.code === 3) userFriendlyError = "Location request timed out.";
                
                setError(userFriendlyError);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const manualLocation = (lat, lng) => {
        setLocation({ latitude: lat, longitude: lng });
    };

    useEffect(() => {
        detectLocation();
    }, []);

    return (
        <LocationContext.Provider value={{ location, error, loading, detectLocation, manualLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
