import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';
import styles from '../styles/pages/filterSearch.module.css';
import { BackTop, Checkbox} from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// funtion to remove leading zero of chapternum and poemnum, ensure the correctness of link
const removeLeadingZero = (num) => {
  return num.replace(/^0+/, '');
};

const getChapterName = (String) => {
  const chapterNames = {
    '01': 'Kiritsubo 桐壺', '02': 'Hahakigi 帚木', '03': 'Utsusemi 空蝉', '04': 'Yūgao 夕顔', '05': 'Wakamurasaki 若紫', '06': 'Suetsumuhana 末摘花', '07': 'Momiji no Ga 紅葉賀', '08': 'Hana no En 花宴', '09': 'Aoi 葵', 
    '10': 'Sakaki 榊', '11': 'Hana Chiru Sato 花散里', '12': 'Suma 須磨', '13': 'Akashi 明石', '14': 'Miotsukushi 澪標', '15': 'Yomogiu 蓬生', '16': 'Sekiya 関屋', '17': 'E Awase 絵合', '18': 'Matsukaze 松風', 
    '19': 'Usugumo 薄雲', '20': 'Asagao 朝顔', '21': 'Otome 乙女', '22': 'Tamakazura 玉鬘', '23': 'Hatsune 初音', '24': 'Kochō 胡蝶', '25': 'Hotaru 螢', '26': 'Tokonatsu 常夏', '27': 'Kagaribi 篝火', 
    '28': 'Nowaki 野分', '29': 'Miyuki 行幸', '30': 'Fujibakama 藤袴', '31': 'Makibashira 真木柱', '32': 'Umegae 梅枝', '33': 'Fuji no Uraba 藤裏葉', '34': 'Wakana: Jō 若菜上', '35': 'Wakana: Ge 若菜下', 
    '36': 'Kashiwagi 柏木', '37': 'Yokobue 横笛', '38': 'Suzumushi 鈴虫', '39': 'Yūgiri 夕霧', '40': 'Minori 御法', '41': 'Maboroshi 幻', '42': 'Niou Miya 匂宮', '43': 'Kōbai 紅梅', '44': 'Takekawa 竹河', 
    '45': 'Hashihime 橋姫', '46': 'Shii ga Moto 椎本', '47': 'Agemaki 総角', '48': 'Sawarabi 早蕨', '49': 'Yadorigi 宿木', '50': 'Azumaya 東屋', '51': 'Ukifune 浮舟', '52': 'Kagerō 蜻蛉', '53': 'Tenarai 手習', 
    '54': 'Yume no Ukihashi 夢浮橋'
  };
  // Ensure chapterKey is a string and zero-padded (e.g., '1' -> '01')
  const formattedKey = String.toString().padStart(2, '0');

  return chapterNames[formattedKey] || "Unknown Chapter"; // Return default if not found
};

const getChapterNamKanji = (String) => {
  const chapterNames = {
    '01': '桐壺', '02': '帚木', '03': '空蝉', '04': '夕顔', '05': '若紫', '06': '末摘花', '07': '紅葉賀', '08': '花宴', '09': '葵', 
    '10': '榊', '11': '花散里', '12': '須磨', '13': '明石', '14': '澪標', '15': '蓬生', '16': '関屋', '17': '絵合', '18': '松風', 
    '19': '薄雲', '20': '朝顔', '21': '乙女', '22': '玉鬘', '23': '初音', '24': '胡蝶', '25': '螢', '26': '常夏', '27': '篝火', 
    '28': '野分', '29': '行幸', '30': '藤袴', '31': '真木柱', '32': '梅枝', '33': '藤裏葉', '34': '若菜上', '35': '若菜下', 
    '36': '柏木', '37': '横笛', '38': '鈴虫', '39': '夕霧', '40': '御法', '41': '幻', '42': '匂宮', '43': '紅梅', '44': '竹河', 
    '45': '橋姫', '46': '椎本', '47': '総角', '48': '早蕨', '49': '宿木', '50': '東屋', '51': '浮舟', '52': '蜻蛉', '53': '手習', 
    '54': '夢浮橋'
  };  
  return chapterNames[String];
}

const getChapterName_noJP = (String) => {
  const chapterNames = {'1':'Kiritsubo','2':'Hahakigi','3':'Utsusemi','4':'Yūgao','5':'Wakamurasaki','6':'Suetsumuhana','7':'Momiji no Ga','8':'Hana no En','9':'Aoi','10':'Sakaki','11':'Hana Chiru Sato','12':'Suma','13':'Akashi','14':'Miotsukushi','15':'Yomogiu','16':'Sekiya','17':'E Awase','18':'Matsukaze','19':'Usugumo','20':'Asagao','21':'Otome','22':'Tamakazura','23':'Hatsune','24':'Kochō','25':'Hotaru','26':'Tokonatsu','27':'Kagaribi','28':'Nowaki','29':'Miyuki','30':'Fujibakama','31':'Makibashira','32':'Umegae','33':'Fuji no Uraba','34':'Wakana: Jō','35':'Wakana: Ge','36':'Kashiwagi','37':'Yokobue','38':'Suzumushi','39':'Yūgiri','40':'Minori','41':'Maboroshi','42':'Niou Miya','43':'Kōbai','44':'Takekawa','45':'Hashihime','46':'Shii ga Moto','47':'Agemaki','48':'Sawarabi','49':'Yadorigi','50':'Azumaya','51':'Ukifune','52':'Kagerō','53':'Tenarai','54':'Yume no Ukihashi'};
  return chapterNames[String];
}

const PoemSearch = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const searchInputRef = useRef(null);

  // State to manage search input for both speaker, addressee, and chapter
  const [searchSpeaker, setSearchSpeaker] = useState("");
  const [searchAddressee, setSearchAddressee] = useState("");
  const [searchChapter, setSearchChapter] = useState("");

  const [filters, setFilters] = useState({
    chapterNum: {
      label: "Chapters",
      options: {},
    },
    speaker_name: {
      label: "Speaker Name",
      options: {},
    },
    speaker_gender: {
      label: "Speaker Gender",
      options: {
        male: { checked: true },
        female: { checked: true },
        nonhuman: { checked: true },
      },
    },
    addressee_name: {
      label: "Addressee Name",
      options: {},
    },
    addressee_gender: {
      label: "Addressee Gender",
      options: {
        male: { checked: true },
        female: { checked: true },
        nonhuman: { checked: true },
      },
    },
    //   season: {
    //       label: 'Season',
    //       options: {
    //           'Spring': { checked: false },
    //           'Summer': { checked: false },
    //           'Autumn': { checked: false },
    //           'Winter': { checked: false }
    //       }
    //   },
    //   poetic_tech: {
    //       label: 'Poetic Techniques Used',
    //       options: {
    //           'Kakekotoba': { checked: false },
    //           'Engo': { checked: false },
    //           'Makurakotoba': { checked: false },
    //           'Utamamakura': { checked: false }
    //       }
    //   },
    //   misc: {
    //     label: 'Misc',
    //     options: {
    //         'Special Poems': { checked: false },
    //         'Chapter Title Poems': { checked: false },
    //         'Character Name': { checked: false },
    //         'Has Commentary': { checked: false }
    //     }
    // }
  });

  // highlight matching keywords
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    if (!results.length) return;

    const chapters = new Set();
    const addressees = new Set();
    const speakers = new Set();
    const speakerGenders = new Map();
    const addresseeGenders = new Map();

    results.forEach((result) => {
      if (result.chapterNum) chapters.add(result.chapterNum);
      if (result.addressee_name) {
        addressees.add(result.addressee_name);
        addresseeGenders.set(result.addressee_name, result.addressee_gender); // Store gender info
      }
      if (result.speaker_name) {
        speakers.add(result.speaker_name);
        speakerGenders.set(result.speaker_name, result.speaker_gender); // Store gender info
      }
    });

    setFilters((prev) => ({
      ...prev,
      chapterNum: {
        ...prev.chapterNum,
        options: Array.from(chapters).reduce(
          (acc, chapter) => ({
            ...acc,
            [chapter]: { checked: false },
          }),
          {}
        ),
      },
      addressee_name: {
        ...prev.addressee_name,
        options: Array.from(addressees).reduce(
          (acc, name) => ({
            ...acc,
            [name]: { checked: false, gender: addresseeGenders.get(name) }, // Store gender inside
          }),
          {}
        ),
      },
      speaker_name: {
        ...prev.speaker_name,
        options: Array.from(speakers).reduce(
          (acc, name) => ({
            ...acc,
            [name]: { checked: false, gender: speakerGenders.get(name) }, // Store gender inside
          }),
          {}
        ),
      },
    }));
  }, [results]);

  // keyword search
  // Modified handleSearch function to handle combined addressees
  const handleSearch = useCallback(
    debounce(async (searchQuery) => {
      setIsLoading(true);
      setError(null);

      // Check if query is empty and set default search to fetch all poems
      const queryToUse = searchQuery.trim() ? searchQuery : "=#=";

      try {
        console.log("Fetching from API with query:", queryToUse);

        // Construct query parameters
        const params = new URLSearchParams();
        params.append("q", queryToUse);

        // Add selected gender filters to the query parameters
        const selectedGenders = Object.entries(filters.speaker_gender.options)
          .filter(([_, { checked }]) => checked)
          .map(([gender]) => gender);

        if (selectedGenders.length > 0) {
          params.append("gender", selectedGenders.join(","));
        }

        const response = await fetch(
          `/api/poems/poem_search?q=${encodeURIComponent(queryToUse)}`
        );

        if (!response.ok) {
          throw new Error("Not found.");
        }

        const data = await response.json();
        console.log("API Response:", data);


        if (Array.isArray(data.searchResults)) {
          const processedResults = data.searchResults.map((result) => ({
            chapterNum: (
              Object.values(result.chapterNum).join("")
            ),
            // genji_age: Object.values(result.genji_age).join(""),
            poemNum: (Object.values(result.poemNum).join("")),
            chapterAbr: Object.values(result.chapterAbr).join(""),
            japanese: Object.values(result.japanese).join(""),
            romaji: Object.values(result.romaji).join(""),
            addressee_name: typeof result.addressee_name === "string" 
              ? result.addressee_name 
              : Object.values(result.addressee_name).join(""),
            addressee_gender: Object.values(result.addressee_gender).join(""),
            speaker_name: Object.values(result.speaker_name).join(""),
            speaker_gender: Object.values(result.speaker_gender).join(""),
            season: Object.values(result.season).join(""),
            peotic_tech: Object.values(result.peotic_tech).join(""),
            waley_translation: Object.values(result.waley_translation).join(""),
            seidensticker_translation: Object.values(
              result.seidensticker_translation
            ).join(""),
            tyler_translation: Object.values(result.tyler_translation).join(""),
            washburn_translation: Object.values(
              result.washburn_translation
            ).join(""),
            cranston_translation: Object.values(
              result.cranston_translation
            ).join(""),
          }));

          console.log("Setting results:", processedResults);
          setResults(processedResults);
          setShowResults(true);
        } else {
          throw new Error("Received unexpected data structure from server");
        }
      } catch (error) {
        console.error("Search error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [setResults, setShowResults]
  );

  useEffect(() => {
    if (!query) {
      handleSearch(""); // Fetch all poems when no query is provided
    } else {
      handleSearch(query);
    }
  }, [query, handleSearch]);

  // filter gets checked
  const handleFilterChange = (category, optionKey) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        options: {
          ...prev[category].options,
          [optionKey]: {
            ...prev[category].options[optionKey],
            checked: !prev[category].options[optionKey].checked,
          },
        },
      },
    }));
  };

  // filter logic
  const filteredResults = useMemo(() => {
    const activeFilters = Object.entries(filters).reduce(
      (acc, [category, { options }]) => {
        const activeOptions = Object.entries(options)
          .filter(([_, { checked }]) => checked)
          .map(([key]) => key);
        if (activeOptions.length) acc[category] = activeOptions;
        return acc;
      },
      {}
    );

    if (Object.keys(activeFilters).length === 0) return results;

    return results.filter((result) => {
      return Object.entries(activeFilters).every(
        ([category, activeOptions]) => {
          switch (category) {
            case "chapterNum":
              return activeOptions.includes(result.chapterNum);
            case "addressee_name":
              return activeOptions.includes(result.addressee_name);
            case "speaker_name":
              return activeOptions.includes(result.speaker_name);
            case "speaker_gender":
              return activeOptions.includes(result.speaker_gender);
            case "addressee_gender":
              return activeOptions.includes(result.addressee_gender);
            case "season":
              return activeOptions.includes(result.season);
            case "poetic_tech":
              return activeOptions.includes(result.poetic_tech);
            default:
              return true;
          }
        }
      );
    });
  }, [filters, results]);

  const defaultChapterCounts = [
    9, 14, 2, 19, 25, 14, 17, 8, 24, 33, 4, 48, 30, 17, 6, 3, 9, 16, 10, 13, 16, 14, 6, 14, 8, 4, 2, 4, 9, 8, 21, 11, 20, 24, 18, 11, 8, 6, 26, 12, 26, 1, 4, 24, 13, 21, 31, 15, 24, 11, 22, 11, 28, 1,
  ].reduce((acc, count, index) => {
    const chapterNum = (index + 1).toString().padStart(2, '0'); // '01', '02', ..., '54'
    acc[chapterNum] = count;
    return acc;
  }, {});

  // const chapterData = useMemo(() => {
  //   // Start with the default counts for all chapters
  //   const originalCounts = { ...defaultChapterCounts };
  
  //   // Calculate the filtered counts
  //   const filteredCounts = Object.keys(defaultChapterCounts).reduce((acc, chapterNum) => {
  //     acc[chapterNum] = 0; // Initialize all chapters to 0
  //     return acc;
  //   }, {});
  
  //   filteredResults.forEach((poem) => {
  //     filteredCounts[poem.chapterNum] = (filteredCounts[poem.chapterNum] || 0) + 1;
  //   });
  
  //   const labels = Object.keys(defaultChapterCounts).sort((a, b) => a - b);
  
  //   return {
  //     labels,
  //     datasets: [
  //       {
  //         label: 'Original Poems per Chapter',
  //         data: labels.map((label) => originalCounts[label] || 0),
  //         backgroundColor: 'rgba(192, 192, 192, 0.6)', // Gray for default data
  //       },
  //       {
  //         label: 'Filtered Poems per Chapter',
  //         data: labels.map((label) => filteredCounts[label] || 0),
  //         backgroundColor: labels.map((label) =>
  //           filteredCounts[label] > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(0, 0, 0, 0)' // Highlight filtered chapters
  //         ),
  //       },
  //     ],
  //   };
  // }, [filteredResults]);

  //   const chartOptions = {
  //   maintainAspectRatio: false,
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //     },
  //   },
  //   plugins: {
  //     tooltip: {
  //       callbacks: {
  //         label: function (context) {
  //           const chapterNum = context.label; // Get the chapter number from the label
  //           const chapterName = getChapterName(chapterNum); // Get the chapter name
  //           const poemsCount = context.raw; // Get the number of poems
  //           return `${poemsCount} poems found in ${chapterName}`;
  //         },
  //       },
  //     },
  //   },
  // };
  // - - -- - - - - -- -- - -

  // const chapterData = useMemo(() => {
  //   // Initialize filtered counts for ages 1-75, starting with 0 poems for each age
  //   const filteredCounts = {};
  //   for (let age = 1; age <= 75; age++) {
  //     filteredCounts[age] = 0;
  //   }
  
  //   // Calculate filtered counts based on Genji's age for each poem
  //   filteredResults.forEach((poem) => {
  //     const poemAge = poem.genji_age; // Assuming genji_age is available in each poem
  //     if (poemAge >= 1 && poemAge <= 75) {
  //       filteredCounts[poemAge] += 1;
  //     }
  //   });
  
  //   // Create the X-axis labels (ages 1 to 75)
  //   const labels = Array.from({ length: 75 }, (_, index) => index + 1); // Ages 1 to 75
  
  //   // Prepare the chart data
  //   return {
  //     labels,
  //     datasets: [
  //       {
  //         label: 'Filtered Poems per Age',
  //         data: labels.map((label) => filteredCounts[label] || 0), // Get poem count for each age, default to 0
  //         backgroundColor: labels.map((label) =>
  //           filteredCounts[label] > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(0, 0, 0, 0)' // Highlight ages with poems
  //         ),
  //       },
  //     ],
  //   };
  // }, [filteredResults]);
  
  // const chartOptions = {
  //   maintainAspectRatio: false,
  //   scales: {
  //     x: {
  //       // Keep all ages (1 to 75) on the X-axis
  //       beginAtZero: true,
  //       ticks: {
  //         stepSize: 1, // Ensure every age (1-75) is shown on the X-axis
  //       },
  //     },
  //     y: {
  //       beginAtZero: true, // Ensure the Y-axis starts at 0
  //     },
  //   },
  //   plugins: {
  //     tooltip: {
  //       callbacks: {
  //         label: function (context) {
  //           const age = context.label; // Get the age from the label
  //           const poemsCount = context.raw; // Get the number of poems
  //           return `${poemsCount} poems found at age ${age}`;
  //         },
  //       },
  //     },
  //   },
  // };  

  // -- - - -- - - -- --


  const chapterData = useMemo(() => {
    // Start with the default counts for all chapters
    const originalCounts = { ...defaultChapterCounts };
  
    // Calculate the filtered counts
    const filteredCounts = Object.keys(defaultChapterCounts).reduce((acc, chapterNum) => {
      acc[chapterNum] = 0; // Initialize all chapters to 0
      return acc;
    }, {});
  
    filteredResults.forEach((poem) => {
      filteredCounts[poem.chapterNum] = (filteredCounts[poem.chapterNum] || 0) + 1;
    });
  
    const labels = Object.keys(defaultChapterCounts).sort((a, b) => a - b);
  
    return {
      labels,
      datasets: [
        {
          label: 'Original Poems per Chapter',
          data: labels.map((label) => originalCounts[label] || 0),
          backgroundColor: 'rgba(192, 192, 192, 0.6)', // Gray for original data
          barPercentage: 0.9, // Make the gray bars slightly narrower
          categoryPercentage: 0.9, // Adjust spacing between bars
          order: 1, // Render this dataset first
        },
        {
          label: 'Filtered Poems per Chapter',
          data: labels.map((label) => filteredCounts[label] || 0),
          backgroundColor: 'rgba(75, 192, 192, 1)', // Fully opaque blue for filtered data
          barPercentage: 1.0, // Make the blue bars slightly wider
          categoryPercentage: 1.0, // Ensure blue bars fully cover gray bars
          order: 2, // Render this dataset second (on top of gray bars)
        },
      ],
    };
  }, [filteredResults]);

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true, // Enable stacking for the x-axis
      },
      y: {
        beginAtZero: true,
        stacked: false, // Enable stacking for the y-axis
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const chapterNum = context.label; // Get the chapter number from the label
            const chapterName = getChapterName(chapterNum); // Get the chapter name
            const poemsCount = context.raw; // Get the number of poems
            return `${poemsCount} poems found in ${chapterName}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) setShowResults(false);
  };

  // toggle control
  const [openSections, setOpenSections] = useState(new Set(["chapterNum"]));

  const toggleSection = (category) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const renderFilters = () => {
    const selectedSpeakerGenders = Object.entries(
      filters.speaker_gender.options
    )
      .filter(([_, { checked }]) => checked)
      .map(([gender]) => gender);

    const selectedAddresseeGenders = Object.entries(
      filters.addressee_gender.options
    )
      .filter(([_, { checked }]) => checked)
      .map(([gender]) => gender);

    const filteredSpeakerOptions = Object.entries(
      filters.speaker_name.options
    ).filter(([name, { gender }]) => selectedSpeakerGenders.includes(gender));

    const filteredAddresseeOptions = Object.entries(
      filters.addressee_name.options
    ).filter(([name, { gender }]) => selectedAddresseeGenders.includes(gender));

    // Function to handle search input change for speaker names
    const handleSpeakerSearch = (e) => {
      setSearchSpeaker(e.target.value.toLowerCase());
    };

    // Function to handle search input change for addressee names
    const handleAddresseeSearch = (e) => {
      setSearchAddressee(e.target.value.toLowerCase());
    };

    // Function to filter names based on the search input
    const filterNames = (names, searchTerm) => {
      return names.filter((name) => name.toLowerCase().includes(searchTerm));
    };
    // Function to handle search input change for chapters
    const handleChapterSearch = (e) => {
      setSearchChapter(e.target.value.toLowerCase());
    };

    // Function to filter chapters based on the search input (by name or number)
    const filterChapters = (chapters, searchTerm) => {
      return chapters.filter((chapterKey) => {
        const chapterName = getChapterName(chapterKey).toLowerCase();
        return (
          chapterKey.includes(searchTerm) || chapterName.includes(searchTerm)
        );
      });
    };

    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterHeader}>
          <h2>Filters</h2>
        </div>
        <div className={styles.filterScroll}>
          {Object.entries(filters).map(
            ([category, { label, options }]) =>
              // Skip the speaker_gender and addressee_gender categories
              category !== "speaker_gender" &&
              category !== "addressee_gender" && (
                <div key={category} className={styles.filterSection}>
                  <div
                    className={styles.filterSectionHeader}
                    onClick={() => toggleSection(category)}
                  >
                    <span className={styles.filterLabel}>{label}</span>
                    <span
                      className={`${styles.arrow} ${
                        openSections.has(category) ? styles.arrowDown : ""
                      }`}
                    >
                      ▸
                    </span>
                  </div>
                  <div
                    className={`${styles.filterContent} ${
                      openSections.has(category) ? styles.expanded : ""
                    }`}
                  >
                    {category === "chapterNum" ? (
                      <>
                        <input
                          type="text"
                          placeholder="Search Chapter"
                          value={searchChapter}
                          onChange={handleChapterSearch}
                          className={styles.searchChapterFilterInput}
                        />
                        <div className={styles.chapterGrid}>
                          {filterChapters(
                            Object.keys(options),
                            searchChapter
                          ).sort((a, b) => removeLeadingZero(a) - removeLeadingZero(b)).map((key, index) => (
                            <Checkbox
                              key={key}
                              checked={options[key]?.checked}
                              onChange={() => handleFilterChange(category, key)}
                              className={styles.chapterOption}
                              style={{
                                marginLeft: index !== 0 ? "0px" : "0px",
                              }}
                            >
                              <div className={styles.chapterText}>
                                <span>{removeLeadingZero(key)}</span>
                                <span>{getChapterName(key)}</span>
                              </div>
                            </Checkbox>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className={styles.filterOptions}>
                        {category !== "season" &&
                          category !== "poetic_tech" &&
                          category !== "misc" && (
                            <>
                              {category === "speaker_name" && (
                                <>
                                  <div
                                    className={styles.speakerGenderFilters}
                                    style={{
                                      display: "flex",
                                      gap: "5px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {Object.entries(
                                      filters.speaker_gender.options
                                    ).map(([gender, { checked }]) => (
                                      <Checkbox
                                        key={gender}
                                        checked={checked}
                                        onChange={() =>
                                          handleFilterChange(
                                            "speaker_gender",
                                            gender
                                          )
                                        }
                                        className={styles.speakerGenderCheckbox}
                                      >
                                        {gender.charAt(0).toUpperCase() +
                                          gender.slice(1)}
                                      </Checkbox>
                                    ))}
                                  </div>
                                  <hr className={styles.divider} />
                                  {/* Search bar for speaker names */}
                                  <input
                                    type="text"
                                    placeholder="Search Speaker"
                                    value={searchSpeaker}
                                    onChange={handleSpeakerSearch}
                                    className={styles.searchFilterInput}
                                  />
                                  {/* Filtered speaker names */}
                                  <div
                                    className={styles.filterCheckboxContainer}
                                  >
                                    {filterNames(
                                      filteredSpeakerOptions.map(
                                        ([key]) => key
                                      ),
                                      searchSpeaker
                                    ).map((key) => (
                                      <Checkbox
                                        key={key}
                                        checked={
                                          filters.speaker_name.options[key]
                                            ?.checked
                                        }
                                        onChange={() =>
                                          handleFilterChange(
                                            "speaker_name",
                                            key
                                          )
                                        }
                                        className={`${styles.filterCheckbox} ${styles.alignLeft}`}
                                        style={{ marginLeft: "0px" }}
                                      >
                                        {key}
                                      </Checkbox>
                                    ))}
                                  </div>
                                </>
                              )}
                              {category === "addressee_name" && (
                                <>
                                  <div
                                    className={styles.addresseeGenderFilters}
                                    style={{
                                      display: "flex",
                                      gap: "5px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {Object.entries(
                                      filters.addressee_gender.options
                                    ).map(([gender, { checked }]) => (
                                      <Checkbox
                                        key={gender}
                                        checked={checked}
                                        onChange={() =>
                                          handleFilterChange(
                                            "addressee_gender",
                                            gender
                                          )
                                        }
                                        className={
                                          styles.addresseeGenderCheckbox
                                        }
                                      >
                                        {gender.charAt(0).toUpperCase() +
                                          gender.slice(1)}
                                      </Checkbox>
                                    ))}
                                  </div>
                                  <hr className={styles.divider} />
                                  {/* Search bar for addressee names */}
                                  <input
                                    type="text"
                                    placeholder="Search Addressee"
                                    value={searchAddressee}
                                    onChange={handleAddresseeSearch}
                                    className={styles.searchFilterInput}
                                  />
                                  {/* Filtered addressee names */}
                                  <div
                                    className={styles.filterCheckboxContainer}
                                  >
                                    {filterNames(
                                      filteredAddresseeOptions.map(
                                        ([key]) => key
                                      ),
                                      searchAddressee
                                    ).map((key) => (
                                      <Checkbox
                                        key={key}
                                        checked={
                                          filters.addressee_name.options[key]
                                            ?.checked
                                        }
                                        onChange={() =>
                                          handleFilterChange(
                                            "addressee_name",
                                            key
                                          )
                                        }
                                        className={`${styles.filterCheckbox} ${styles.alignLeft}`}
                                        style={{ marginLeft: "0px" }}
                                      >
                                        {key}
                                      </Checkbox>
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        {category !== "speaker_name" &&
                          category !== "addressee_name" &&
                          Object.entries(options).map(
                            ([key, { checked }], index) => (
                              <Checkbox
                                key={key}
                                checked={checked}
                                onChange={() =>
                                  handleFilterChange(category, key)
                                }
                                className={`${styles.filterCheckbox} ${styles.alignLeft}`}
                                style={{
                                  marginLeft: index !== 0 ? "0px" : "0px",
                                }}
                              >
                                {key}
                              </Checkbox>
                            )
                          )}
                      </div>
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    );
  };

  const renderTranslation = (translation, translator) => {
    if (!translation) return <p>No translation available</p>;

    return (
      <div className={styles.translation}>
        {translation.split("\n").map((line, index) => (
          <div
            key={`${translator}-line-${index}`}
            className={styles.translationLine}
          >
            {highlightMatch(line, query)}
          </div>
        ))}
      </div>
    );
  };

  const [hoveredItem, setHoveredItem] = useState(null);
  const handleMouseEnter = (index) => {
    setHoveredItem(index); // Just store the hovered index
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const renderResults = () => (
    <div className={styles.searchResults}>
      {filteredResults.map((result, index) => (
        <div
          key={index}
          className={styles.resultItem}
          onMouseEnter={(event) => handleMouseEnter(index, event)}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={`/poems/${removeLeadingZero(result.chapterNum)}/${removeLeadingZero(result.poemNum)}`}>
            <div className={styles.resultContent}>
              <h3 className={styles.resultTitle}>
                {result.chapterNum} {result.chapterAbr}{" "}
                {getChapterNamKanji(result.chapterNum)} {result.poemNum}
              </h3>
              <h3 className={styles.resultTitle}>{result.speaker_name}</h3>
              <div className={styles.japaneseText}>
                {highlightMatch(result.japanese.split("\n")[0], query)}
              </div>
              <div className={styles.romajiText}>
                {highlightMatch(result.romaji.split("\n")[0], query)}
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Hover Popup */}
      {hoveredItem !== null && (
        <div className={styles.hoverPopup}>
          <div className={styles.resultContent}>
            <h3 className={styles.resultTitle}>
              Chapter {filteredResults[hoveredItem].chapterNum} -{" "}
              {getChapterName(filteredResults[hoveredItem].chapterNum)} - Poem{" "}
              {filteredResults[hoveredItem].poemNum}
            </h3>
            <h3 className={styles.resultSubTitle}>
              {filteredResults[hoveredItem].speaker_name} →{" "}
              {filteredResults[hoveredItem].addressee_name}
            </h3>
            <div className={styles.japaneseText}>
              {highlightMatch(filteredResults[hoveredItem].japanese, query)}
            </div>
            <div className={styles.romajiText}>
              {highlightMatch(filteredResults[hoveredItem].romaji, query)}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Waley</h3>
              {renderTranslation(
                filteredResults[hoveredItem].waley_translation,
                "Waley"
              )}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Seidensticker</h3>
              {renderTranslation(
                filteredResults[hoveredItem].seidensticker_translation,
                "Seidensticker"
              )}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Tyler</h3>
              {renderTranslation(
                filteredResults[hoveredItem].tyler_translation,
                "Tyler"
              )}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Washburn</h3>
              {renderTranslation(
                filteredResults[hoveredItem].washburn_translation,
                "Washburn"
              )}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Cranston</h3>
              {renderTranslation(
                filteredResults[hoveredItem].cranston_translation,
                "Cranston"
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.poemSearch}>
      <div className={styles.chartContainer}>
        <Bar data={chapterData} options={chartOptions} />
      </div>
      <div className={styles.searchArea}>
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder="Enter Keyword..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.filterSidebar}>{renderFilters()}</aside>

        <main className={styles.resultsArea}>
          {isLoading && <div className={styles.loading}>Searching...</div>}
          {error && <div className={styles.error}>{error}</div>}

          {showResults && results.length > 0 && (
            <>
              <div className={styles.resultCount}>
                Found {filteredResults.length} poems
                {Object.values(filters).some(({ options }) =>
                  Object.values(options).some(({ checked }) => checked)
                )}
              </div>
              {renderResults()}
            </>
          )}

          {query && results.length === 0 && !isLoading && !error && (
            <div className={styles.noResults}>No results found</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(PoemSearch);