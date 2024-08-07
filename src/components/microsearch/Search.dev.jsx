
import React, { useState, useContext, useEffect } from 'react';
import { AutoComplete, Input, Tag, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ThingsContext } from './context.dev.js';
import 'antd/dist/antd.min.css';

const SearchComponent = () => {
  const [searches, setSearches] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [tagIdCounter, setTagIdCounter] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const [query, setQuery] = useState("winter");
  const { value1, updateValue1 } = useContext(ThingsContext);

  useEffect(() => {
    updateValue1(query)
  }, [query])

  const handleSearch = () => {
    if (currentInput.trim() !== '' && totalCount < 5) {
      setSearches([...searches, { id: tagIdCounter, value: currentInput.trim() }]);
      setCurrentInput('');
      
      setTotalCount(totalCount + 1);
      setTagIdCounter(tagIdCounter + 1);

      setQuery(currentInput)
    } else if (totalCount >= 5) {
      setErrorMessage('You need to delete a word before continuing to search.');
    }
  };

  const handleTagClose = (tagId) => {
    const updatedSearches = searches.filter((tag) => tag.id !== tagId);
    setSearches(updatedSearches);
    setTotalCount(totalCount - 1);
    setErrorMessage('')
  };

  return (
    <div>
      <AutoComplete
        style={{ width: '100%' }}
        value={currentInput}
        onChange={(value) => setCurrentInput(value)}
        onSelect={handleSearch}
      >
        <Input placeholder="Search..."
          suffix={
            <Button type="primary" onClick={handleSearch}>
              Search<SearchOutlined/>
            </Button>
          }
        />
      </AutoComplete>
      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column' }}>
        {searches.map((tag) => (
          <Tag key={tag.id} closable onClose={() => handleTagClose(tag.id)}>
            {tag.value}
          </Tag>
        ))}
      </div>
      <div style={{ marginTop: '8px', color: 'red' }}>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SearchComponent;
