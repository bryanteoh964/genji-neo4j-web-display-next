import React from 'react'
const ThingsContext = React.createContext();
const ThingsProvider = (props) => {
    const [value, setValue] = React.useState(1);
    const updateValue = (newValue) => {
        setValue(newValue);
    }
    return (
        <ThingsContext.Provider value={{ value, updateValue }}>
            {props.children}
        </ThingsContext.Provider>
    );
}
export { ThingsProvider, ThingsContext };