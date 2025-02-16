import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/searchDropDown.module.css';

const CharactersDropDown = ({l}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`${styles.searchDropdown} ${isOpen ? styles.open : ''}`}>
            <button onClick={handleMenuClick} className={styles.searchButton}>
                Characters 
            </button>

            {isOpen && <SearchOptions setIsOpen={setIsOpen} l={l} />}
        </div>
    );
};

const SearchOptions = ({ setIsOpen, l }) => {
    function myFunction(query) {
		// Declare variables 
		var filter = query.toUpperCase()
		var li = document.getElementsByTagName("li")
	  
		// Loop through all list items, and hide those who don't match the search query
		for (var i = 0; i < li.length; i++) {
		  var a = li[i];
		  if (a.innerHTML.toUpperCase().replace("Ō", "O").replace("Ū", "U").indexOf(filter) > -1) {
			li[i].style.display = ""; 
		  } else {
			li[i].style.display = "none";
		  }
		}
	}

    return (
        <div className={styles.searchOptions} style={{maxHeight: "500px", overflowY: 'scroll', marginTop: "10px"}}>
            <Link href="/characters" className={styles.searchLink} onClick={() => setIsOpen(false)} style={{fontWeight: "bold"}}>
                Diagram
            </Link>
            <Link href="/characters/timeline" className={styles.searchLink} onClick={() => setIsOpen(false)}  style={{fontWeight: "bold"}}>
                Timeline 
            </Link>
            <Link href="/characters/map" className={styles.searchLink} onClick={() => setIsOpen(false)}  style={{fontWeight: "bold"}}>
                Map 
            </Link>
            <input type="text" id="mySearch" onClick={(e) => {if (e.target.value == "") {myFunction("")}}} placeholder="Search Character" onKeyUp={(e) => myFunction(e.target.value)} 
            style={{width: "175px", fontSize: "13px", padding: "11px", paddingLeft:"6px", paddingTop: "8px", paddingBottom: "8px", border: "3px solid gray", 
            marginTop: "3px",  marginBottom: "3px", marginLeft: '15px', borderRadius: "10px",
            '::placeholder': {
                color: 'gray'
            }}}/>
            {
                l.map(
                    function(c_name) {
                        return (
                            <li style={{listStyle: "none"}}>
                                <a href={"/characters/"+c_name} className={styles.searchLink}  onClick={() => setIsOpen(false)}>
                                    {c_name} 
                                </a>
                            </li> 
                        )
                    }
                )
            }
        </div>
    );
};

export default CharactersDropDown;