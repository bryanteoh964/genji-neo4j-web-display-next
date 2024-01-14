import React from 'react'
const ThingsContext = React.createContext();
const ThingsProvider = (props) => {
    /*
        value1 is search query
        value2 is sentence index
    */
    const [value1, setValue1] = React.useState("");
    const [value2, setValue2] = React.useState([]);
    const updateValue1 = (newValue) => {
        setValue1(newValue);
    }
    const updateValue2 = (newValue) => {
        setValue2(newValue);
    }
    return (
        <ThingsContext.Provider value={{ value1, updateValue1, value2, updateValue2 }}>
            {props.children}
        </ThingsContext.Provider>
    );
}
export { ThingsProvider, ThingsContext };