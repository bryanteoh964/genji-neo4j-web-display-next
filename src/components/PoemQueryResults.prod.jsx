'use client'
import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/poemDisplay.module.css';
import FavButton from '../components/FavButton.prod';
import ContributorView from '../components/ContributorView.prod';
import DiscussionArea from '../components/DiscussionArea.prod';
import FormatContent from './FormatText.prod'
import TransSubmit from '../components/TranslationSubmit.prod';
import TransDisplay from '../components/TranslationDisplay.prod'
import PoemNavigation from './PoemNavigation.prod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const EvidenceDropdown = ({ content, evidence }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!evidence) {
        return (
            <div className={styles.evidenceContent}>
                {typeof content === 'string' ? (
                    <FormatContent content={content} />
                ) : (
                    content
                )}
            </div>
        );
    }

    return (
        <div className={styles.evidenceDropdown}>
            <div 
                className={styles.evidenceContent}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {typeof content === 'string' ? (
                    <FormatContent content={content} />
                ) : (
                    content
                )}
                <span className={`${styles.evidenceToggle} ${isExpanded ? styles.expanded : ''}`}>
                    ▼
                </span>
            </div>
            <div className={`${styles.evidencePanel} ${isExpanded ? styles.expanded : ''}`}>
                <FormatContent content={evidence} />
            </div>
        </div>
    );
};

const PoemDisplay = ({ poemData }) => {

    const [poemState, setPoemState] = useState({
        speaker: [],
        addressee: [],
        JPRM: [],
        trans: {
            Waley: 'N/A',
            Seidensticker: 'N/A',
            Tyler: 'N/A',
            Washburn: 'N/A',
            Cranston: 'N/A'
        },
        source: [],
        relWithEvidence: [],
        tag: [],
        notes: "",
        isLoading: true,
        poemId: "",
        proxy: "",
        narrativeContext: "",
        paraphrase: "",
        handwritingDescription: "",
        paperMediumType: "",
        deliveryStyle: "",
        season: "",
        kigo: [],
        pt: "",
        pw: { name: "", kanji_hiragana: "", english_equiv: "", gloss: "" },
        messenger: "",
        age: "",
        repCharacter: "",
        placeOfComp: "",
        placeOfReceipt: "",
        spoken: "",
        written: "",
        season_evidence: "",
        placeOfComp_evidence: "",
        placeOfReceipt_evidence: "",
        groupPoems: [],
        replyPoems: [],
        furtherReadings: [],
        spoken_or_written_evidence: ""
    });
    
    const chapter = poemData.chapterNum;
    const number = poemData.poemNum;
    const numStr = number.toString().padStart(2, '0');
    
    const chapterNames = {
        '1':'Kiritsubo 桐壺','2':'Hahakigi 帚木','3':'Utsusemi 空蝉','4':'Yūgao 夕顔',
        '5':'Wakamurasaki 若紫','6':'Suetsumuhana 末摘花','7':'Momiji no Ga 紅葉賀',
        '8':'Hana no En 花宴','9':'Aoi 葵','10':'Sakaki 榊','11':'Hana Chiru Sato 花散里',
        '12':'Suma 須磨','13':'Akashi 明石','14':'Miotsukushi 澪標','15':'Yomogiu 蓬生',
        '16':'Sekiya 関屋','17':'E Awase 絵合','18':'Matsukaze 松風','19':'Usugumo 薄雲',
        '20':'Asagao 朝顔','21':'Otome 乙女','22':'Tamakazura 玉鬘','23':'Hatsune 初音',
        '24':'Kochō 胡蝶','25':'Hotaru 螢','26':'Tokonatsu 常夏','27':'Kagaribi 篝火',
        '28':'Nowaki 野分','29':'Miyuki 行幸','30':'Fujibakama 藤袴','31':'Makibashira 真木柱',
        '32':'Umegae 梅枝','33':'Fuji no Uraba 藤裏葉','34':'Wakana: Jō 若菜上',
        '35':'Wakana: Ge 若菜下','36':'Kashiwagi 柏木','37':'Yokobue 横笛','38':'Suzumushi 鈴虫',
        '39':'Yūgiri 夕霧','40':'Minori 御法','41':'Maboroshi 幻','42':'Niou Miya 匂宮',
        '43':'Kōbai 紅梅','44':'Takekawa 竹河','45':'Hashihime 橋姫','46':'Shii ga Moto 椎本',
        '47':'Agemaki 総角','48':'Sawarabi 早蕨','49':'Yadorigi 宿木','50':'Azumaya 東屋',
        '51':'Ukifune 浮舟','52':'Kagerō 蜻蛉','53':'Tenarai 手習','54':'Yume no Ukihashi 夢浮橋'
    };
    
    const chapter_name = chapterNames[chapter];

    const [expandedPanels, setExpandedPanels] = useState({
        summary: false,
        context: false,
        commentary: false,
        details: false,
        discussion: false
      });
      
    const togglePanel = (panelName) => {
        setExpandedPanels(prev => ({
            ...prev,
            [panelName]: !prev[panelName]
        }));
    };

    const formatAuthorName = (fullName) => {
        if (!fullName) return '';
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        return `${lastName}, ${firstName}`;
      };

    // check cache
    useEffect(() => {
        const fetchPoemData = async () => {
            try {
                setPoemState(prev => ({...prev, isLoading: true}));
                
                const cacheKey = `poem_${chapter}_${number}`;
                const cacheTimeKey = `poem_${chapter}_${number}_time`;
                
                const cachedPoem = localStorage.getItem(cacheKey);
                const cachedTime = localStorage.getItem(cacheTimeKey);
                
                const now = Date.now();
                const expirationTime = 3600000;

                if (cachedPoem && cachedTime && (now - parseInt(cachedTime, 10)) < expirationTime) {
                    const poemData = JSON.parse(cachedPoem);
                    setPoemState(prev => ({...prev, ...poemData, isLoading: false}));
                    return;
                }

                // remove cache if expired
                if (cachedPoem && cachedTime && (now - parseInt(cachedTime, 10)) >= expirationTime) {
                    localStorage.removeItem(cacheKey);
                    localStorage.removeItem(cacheTimeKey);
                }

                
                const response = await fetch(`/api/poems?chapter=${chapter}&&number=${numStr}`);
                if (response.status !== 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const responseData = await response.json();
                const exchange = responseData[0];
                const transTemp = responseData[1];
                const sources = responseData[2];
                const relatedWithEvidence = responseData[3];
                const tags = responseData[4];
                const pls = responseData[6];
                
                // form speaker set
                let speaker = [...new Set(exchange.map(e => e.start.properties.name))];

                // form addressee set
                let addressee = [...new Set(exchange.map(e => e.end.properties.name))];

                // translation data
                let translations = {
                    Waley: 'N/A',
                    Seidensticker: 'N/A',
                    Tyler: 'N/A',
                    Washburn: 'N/A',
                    Cranston: 'N/A'
                };
                
                transTemp.forEach(e => {
                    translations[e[0]] = e[0] !== 'Waley' ? e[1] : [e[1], e[2]]; // Waley has extra data of page num
                });
                
                // allusion data
                let src_obj = [];
                let index = 0;
                let entered_honka = [];
                
                sources.forEach(e => {
                    if (entered_honka.includes(e[0])) {
                        src_obj[src_obj.findIndex(el => el.honka === e[0])].translation.push([e[5], e[6]]);
                    } else {
                        src_obj.push({
                            id: index,
                            honka: e[0],
                            source: e[1],
                            romaji: e[2],
                            poet: e[3],
                            order: e[4],
                            translation: [[e[5], e[6]]],
                            notes: e[7]
                        });
                        entered_honka.push(e[0]);
                        index++;
                    }
                });
                
                // set peom id
                let poemId = null;
                if (pls && pls[0]) {
                    poemId = Object.values(pls[0])[0] || null;
                }
                

                const newPoemState = {
                    speaker: speaker,
                    addressee: addressee,
                    JPRM: [
                        exchange[0]?.segments[0]?.end?.properties?.Japanese,
                        exchange[0]?.segments[0]?.end?.properties?.Romaji
                    ],
                    trans: translations,
                    source: src_obj,
                    relWithEvidence: relatedWithEvidence,
                    tag: tags,
                    notes: exchange[0]?.segments[0]?.end?.properties?.notes,
                    isLoading: false,
                    poemId: poemId,
                    narrativeContext: responseData[7],
                    paraphrase: responseData[8],
                    handwritingDescription: responseData[9],
                    paperMediumType: responseData[10],
                    deliveryStyle: responseData[11],
                    season: responseData[12],
                    kigo: responseData[13],
                    pt: Array.isArray(responseData[14]) ? responseData[14] : [],
                    pw: responseData[15],
                    proxy: responseData[16],
                    // unused messenger
                    messenger: responseData[17],
                    age: responseData[18],
                    repCharacter: responseData[19],
                    placeOfComp: responseData[20],
                    placeOfReceipt: responseData[21],
                    spoken: responseData[22],
                    written: responseData[23],
                    season_evidence: responseData[24],
                    placeOfComp_evidence: responseData[25],
                    placeOfReceipt_evidence: responseData[26],
                    groupPoems: responseData[27],
                    replyPoems: responseData[28],
                    furtherReadings: responseData[29],
                    spoken_or_written_evidence: responseData[30]
                };
                
                
                // console.log(responseData)

                setPoemState(prev => ({...prev, ...newPoemState}));
                
                try {
                    const now = Date.now();
                    localStorage.setItem(cacheKey, JSON.stringify(newPoemState));
                    localStorage.setItem(cacheTimeKey, now.toString());
                } catch (storageError) {
                    console.error('Cache storage failed:', storageError);
                }
                
            } catch (error) {
                console.error('Error fetching poem data:', error);
                setPoemState(prev => ({...prev, isLoading: false}));
            }
        };
        
        fetchPoemData();
    }, [chapter, number, numStr]);

    const SpeakerAddresseeInfo = ({ speaker, addressee, poemId }) => {

        const chapterName = chapterNames[chapter];
        
        return (
            <div className={styles.translatorInfo}>
                <div className={styles.speakerAddresseeContainer}>
                    <div className={styles.speakerLine}>
                        {Array.isArray(speaker) ? (
                            speaker.map((spk, index) => (
                                <a key={index} href={`/characters/${encodeURIComponent(spk)}`} className={styles.characterLink}>
                                    {spk || "N/A"}{index === 0 ? ">>" : ""}
                                </a>
                            ))
                        ) : (
                            <a href={`/characters/${encodeURIComponent(speaker)}`} className={styles.characterLink}>
                                {(speaker || "N/A")}{">>"}
                            </a>
                        )}
                    </div>
                    <div className={styles.addresseeLine}>
                        {Array.isArray(addressee) ? (
                            addressee.map((addr, index) => (
                                <a key={index} href={`/characters/${encodeURIComponent(addr)}`} className={styles.characterLink}>
                                    {index === 0 ? ">>" : ""}{addr || "N/A"}
                                </a>
                            ))
                        ) : (
                            <a href={`/characters/${encodeURIComponent(addressee)}`} className={styles.characterLink}>
                                {">>"}{(addressee || "N/A")}
                            </a>
                        )}
                    </div>
                </div>
                <div className={styles.poemCodeContainer}>
                    <div className={styles.poemCodeMain}>
                        {poemId?.substring(0, 4)}<br/>{poemId?.substring(4)}
                    </div>
                    <div className={styles.chapterName}>
                        {chapterName?.split(' ').slice(-1)[0] || ''}
                    </div>
                </div>
            </div>
        );
    };

    if (poemState.isLoading) {
        return <div className={styles.loadingContainer}>Loading poem...</div>;
    }

    return (
        <div className={styles.poemPageContainer}>
            <section className={styles.imageSection}>
                <img 
                    className={styles.fullBackgroundImage} 
                    src="/images/poem_background.jpg" 
                    alt="Poem background" 
                />

                {/* left part: poem itself */}
                <div className={styles.poemOriginalSection}>
                    <div className={styles.japaneseText}>
                        {poemState.JPRM[0]?.split('\n').map((line, index) => (
                            <div key={`jp-${index}`} className={styles.japaneseTextLine}>
                                {line.split('').map((char, cIndex) => (
                                    <span key={`char-${cIndex}`} className={styles.japaneseChar}>
                                        {char}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.favButtonContainer}>
                        <FavButton poemId={poemState.poemId} JPRM={poemState.JPRM[0]} />
                    </div>
                </div>

                <div className={styles.romajiText}>
                    {poemState.JPRM[1]?.split('\n').map((line, index) => (
                        <p key={`rm-${index}`} className={styles.romajiLine}>{line}</p>
                    ))}
                </div>

                {/* right part: info grid */}
                <div className={styles.poemInfoGrid}>
                    <div className={`${styles.gridBox} ${styles.speakerBox}`}>
                        <span className={styles.label}>
                            {Array.isArray(poemState.speaker) ? (
                                <>
                                    {poemState.speaker.map((speaker, index) => (
                                        <a key={index} href={`/characters/${encodeURIComponent(speaker)}`} className={styles.characterLink}>
                                            {speaker || "N/A"}
                                        </a>
                                    ))}
                                    <span className={styles.poemFromText}>
                                        POEM FROM
                                        <span className={styles.arrowFrom}>{">>"}</span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <a href={`/characters/${encodeURIComponent(poemState.speaker)}`} className={styles.characterLink}>
                                        {poemState.speaker || "N/A"}
                                    </a>
                                    <span className={styles.poemFromText}>
                                        POEM FROM
                                        <span className={styles.arrowFrom}>{">>"}</span>
                                    </span>
                                </>
                            )}
                        </span>
                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.addresseeBox}`}>
                        <span className={styles.label}>
                            {Array.isArray(poemState.addressee) ? (
                                <>
                                    {poemState.addressee.map((addr, index) => (
                                        <a key={index} href={`/characters/${encodeURIComponent(addr)}`} className={styles.characterLink}>
                                            {addr || "N/A"}
                                        </a>
                                    ))}
                                    <span className={styles.poemToText}>
                                        POEM TO
                                        <span className={styles.arrowTo}>{">>"}</span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <a href={`/characters/${encodeURIComponent(poemState.addressee)}`} className={styles.characterLink}>
                                        {(poemState.addressee || "N/A")}
                                    </a>
                                    <span className={styles.poemToText}>
                                        POEM TO
                                        <span className={styles.arrowTo}>{">>"}</span>
                                    </span>
                                </>
                            )}
                        </span>
                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.ageBox}`}>
                        <span className={styles.ageVal}>{(poemState.age < 10 ? `0${poemState.age}` : poemState.age) || '00'}</span>
                        <span className={styles.ageLabel}>GENJI&apos;S AGE</span>    
                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.messengerBox}`}>
                        <span className={styles.messengerValue}>
                            {poemState.messenger ? (
                                <a href={`/characters/${encodeURIComponent(poemState.messenger)}`} className={styles.characterLink}>
                                    {poemState.messenger}
                                </a>
                            ) : (
                                'NONE'
                            )}
                        </span>

                        <span className={styles.messengerLabel}>MESSENGER</span> 
                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.connectedBox}`}>
                        {/* <div className={styles.connectedArrows}>
                            <span>◀</span>
                            <span>▶</span>
                        </div> */}

                        {/* show nothing when no data is available */}
                        {poemState.proxy ? ( 
                            <>
                                <a href={`/characters/${encodeURIComponent(poemState.proxy)}`} className={styles.characterLink}>
                                    {poemState.proxy}
                                </a>
                                <span className={styles.connectedLabel}>PROXY POET</span>
                            </>
                        ) : (
                            <>
                                <span className={styles.connectedValue}>NONE</span>
                                <span className={styles.connectedLabel}>PROXY POET</span>
                            </>
                        )}

                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.poemTypeBox}`}>
                        <div className={styles.poemTypeContainer}>
                            <span className={styles.poemTypeLabel}>
                                <span>TYPE</span>
                                <span>POEM</span>
                            </span>
                            <div className={styles.checkboxGroup}>
                                <span>PROFFERED {poemState.tag?.some(item => item[0] === 'Proffered Poem' && item[1]) ? '☑' : '☐'}</span>
                                <span>REPLY {poemState.tag?.some(item => item[0]?.includes('Reply Poem') && item[1]) ? '☑' : '☐'}</span>
                                <span>SOLILOQUY {poemState.tag?.some(item => item[0]?.includes('Soliloquy') && item[1]) ? '☑' : '☐'}</span>
                                <span>GROUP {poemState.tag?.some(item => item[0]?.includes('Group Poem') && item[1]) ? '☑' : '☐'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.poemTechBox}`}>
                        <div className={styles.techList}>
                            <span>{poemState.pt?.some(item => item[0] === 'kakekotoba' && item[1]) ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faCircle} />} KAKEKOTOBA</span>
                            <span>{poemState.pt?.some(item => item[0] === 'engo' && item[1]) ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faCircle} />} ENGO</span>
                            <span>{poemState.pt?.some(item => item[0] === 'utamakura' && item[1]) ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faCircle} />} UTAMAKURA</span>
                            <span>{poemState.pt?.some(item => item[0] === 'makurakotoba' && item[1]) ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faCircle} />} MAKURAKOTOBA</span>
                        </div>
                        <span className={styles.poemTechLabel}>
                                <span>TECHNIQUE</span>
                                <span>POETIC</span>
                        </span>
                    </div>

                    <div className={`${styles.gridBox} ${styles.emptyBox}`}> </div>
                    
                    <div className={`${styles.gridBox} ${styles.spokenBox}`}>
                        <div className={styles.spokenContainer}>
                            {/* no data shown if no data is available */}
                            {poemState.spoken && (
                                <>
                                    {poemState.spoken === 'false' ? (
                                        <span className={styles.crossedOut}>spoken</span> 
                                    ) : (
                                        <span>spoken</span>
                                    )}
                                </>
                            )}

                            {(poemState.spoken || poemState.written) && <br/>}

                            {poemState.written && (
                                <>
                                    {poemState.written === 'false' ? (
                                        <span className={styles.crossedOut}>written</span> 
                                    ) : (
                                        <span>written</span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.chapterBox}`}>
                        <div className={styles.chapterPoemLabel}>
                            <span>CHAPTER</span>
                            <span>POEM</span>
                        </div>
                        <div className={styles.mainContent}>
                            <div className={styles.chapterKanjiContainer}>
                                <div className={styles.numberContainer}>
                                    <span>{(chapter < 10 ? `0${chapter}` : chapter)}</span>
                                    <span>{(number < 10 ? `0${number}` : number)}</span>
                                </div>

                                <div className={styles.chapterEnglish}>
                                    {chapter_name?.split(' ').slice(0, -1).join(' ')}
                                </div>
                            </div>
                            <div className={styles.chapterKanjiContainer}>
                                <span className={styles.chapterKanji}>
                                    {chapter_name?.split(' ').slice(-1)[0]}
                                </span>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className={`${styles.gridBox} ${styles.seasonBox}`}>
                        <span className={styles.seasonLabel}>{poemState.season ? poemState.season : 'SEASON'}</span>
                        <span className={styles.seasonIcon}>
                            {poemState.season?.toLowerCase() === ('spring') && '❀'}
                            {poemState.season?.toLowerCase() === ('summer') && '☼'}
                            {poemState.season?.toLowerCase() === ('autumn') && '✾'}
                            {poemState.season?.toLowerCase() === ('winter') && '❋'}
                            {!poemState.season && '-'}
                        </span>
                    </div>
                </div>

                <PoemNavigation />
            </section>

            <section className={styles.analysisSection}>
                <div className={styles.analysisContainer}>
                    {/* Left Side - Analysis Panels with Toggles */}
                    <div className={styles.analysisLeft}>
                        <h2 className={styles.translationsHeader}>ANALYSIS</h2>
                            
                            {/* Narrative Context Panel */}
                            <div className={styles.analysisPanel}>
                                <div className={styles.panelHeader} onClick={() => togglePanel('context')}>
                                    <h2>WHERE WE ARE IN THE TALE</h2>
                                    <div className={`${styles.toggleArrow} ${expandedPanels.context ? styles.arrowExpanded : styles.arrowCollapsed}`}>
                                        ▼
                                    </div>
                                </div>
                                <div className={`${styles.panelContent} ${expandedPanels.context ? styles.expanded : styles.collapsed}`}>
                                    {poemState.narrativeContext && <FormatContent content={poemState.narrativeContext} />}  
                                </div>
                            </div>

                            {/* Poem Summary Panel */}
                            <div className={styles.analysisPanel}>
                                <div className={styles.panelHeader} onClick={() => togglePanel('summary')}>
                                    <h2>WHAT THE POEM IS SAYING</h2>
                                    <div className={`${styles.toggleArrow} ${expandedPanels.summary ? styles.arrowExpanded : styles.arrowCollapsed}`}>
                                        ▼
                                    </div>
                                </div>
                                <div className={`${styles.panelContent} ${expandedPanels.summary ? styles.expanded : styles.collapsed}`}>
                                    {poemState.paraphrase && <FormatContent content={poemState.paraphrase} />}
                                </div>
                            </div>

                            {/* Commentary Panel */}
                            <div className={styles.analysisPanel}>
                                <div className={styles.panelHeader} onClick={() => togglePanel('commentary')}>
                                    <h2>COMMENTARY</h2>
                                    <div className={`${styles.toggleArrow} ${expandedPanels.commentary ? styles.arrowExpanded : styles.arrowCollapsed}`}>
                                        ▼
                                    </div>
                                </div>
                                <div className={`${styles.panelContent} ${expandedPanels.commentary ? styles.expanded : styles.collapsed}`}>
                                    {poemState.notes && <FormatContent content={poemState.notes} />}
                                </div>
                            </div>

                            {/* More Details Panel */}
                            <div className={styles.analysisPanel}>
                                <div className={styles.panelHeader} onClick={() => togglePanel('details')}>
                                    <h2>MORE DETAILS</h2>
                                    <div className={`${styles.toggleArrow} ${expandedPanels.details ? styles.arrowExpanded : styles.arrowCollapsed}`}>
                                        ▼
                                    </div>
                                </div>
                                <div className={`${styles.panelContent} ${expandedPanels.details ? styles.expanded : styles.collapsed}`}>
                                {poemState.paperMediumType && (
                                    <div className={styles.detailItem}>
                                        <h3>PAPER/MEDIUM</h3>
                                        {poemState.paperMediumType && <FormatContent content={poemState.paperMediumType} />}
                                    </div>
                                )}
                                
                                {poemState.deliveryStyle && (
                                    <div className={styles.detailItem}>
                                        <h3>DELIVERY STYLE</h3>
                                        {poemState.deliveryStyle && <FormatContent content={poemState.deliveryStyle} />}
                                    </div>
                                )}
                                
                                {poemState.season && (
                                    <div className={styles.detailItem}>
                                        <h3>SEASON IN NARRATIVE</h3>
                                        <div className={styles.withEvidence}>
                                            <EvidenceDropdown 
                                                content={poemState.season}
                                                evidence={poemState.season_evidence}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {poemState.kigo && poemState.kigo.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>SEASONAL WORD</h3>
                                        {poemState.kigo.map((kigoItem, index) => {
                                            return (
                                                <div key={index} className={styles.seasonalWordItem}>
                                                    <div className={styles.withEvidence}>
                                                        <EvidenceDropdown 
                                                            content={(() => {
                                                                if (kigoItem.japanese && kigoItem.english) {
                                                                    return `${kigoItem.japanese} — ${kigoItem.english}`;
                                                                } else if (kigoItem.japanese && !kigoItem.english) {
                                                                    return kigoItem.japanese;
                                                                } else if (!kigoItem.japanese && kigoItem.english) {
                                                                    return kigoItem.english;
                                                                }
                                                                return '';
                                                            })()}
                                                            evidence={kigoItem.evidence}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                
                                {poemState.pt && poemState.pt.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>POETIC TECHNIQUES EMPLOYED</h3>
                                        {poemState.pt.map((item, idx) => (
                                            <FormatContent key={idx} content={item[0]} />
                                        ))}
                                    </div>
                                )}

                                {poemState.pw && poemState.pw.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>POETIC WORD</h3>
                                        {poemState.pw.map((word, index) => (
                                            <div key={index} className={styles.poeticWordItem}>
                                                <FormatContent content={`${word.kanji_hiragana} - ${word.name}`} />
                                                {word.english_equiv && (
                                                    <div className={styles.poeticWordDetails}>
                                                        <FormatContent content={word.english_equiv} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {poemState.placeOfComp && (
                                    <div className={styles.detailItem}>
                                        <h3>COMPOSED AT</h3>
                                        <div className={styles.withEvidence}>
                                            <EvidenceDropdown 
                                                content={poemState.placeOfComp}
                                                evidence={poemState.placeOfComp_evidence}
                                            />
                                        </div>
                                    </div>
                                )}

                                {poemState.placeOfReceipt && (
                                    <div className={styles.detailItem}>
                                        <h3>RECEIVED AT</h3>
                                        <div className={styles.withEvidence}>
                                            <EvidenceDropdown 
                                                content={poemState.placeOfReceipt}
                                                evidence={poemState.placeOfReceipt_evidence}
                                            />
                                        </div>
                                    </div>
                                )}

                                {(poemState.spoken === 'true' || poemState.written === 'true') && (
                                    <div className={styles.detailItem}>
                                        <h3>SPOKEN OR WRITTEN</h3>
                                        <div className={styles.withEvidence}>
                                            <EvidenceDropdown 
                                                content={
                                                    <>
                                                        {poemState.spoken === 'true'  && <FormatContent content={ 'Is spoken' } />}
                                                        {poemState.written === 'true'  && <FormatContent content={ 'Is written' } />}
                                                    </>
                                                }
                                                evidence={poemState.spoken_or_written_evidence}
                                            />
                                        </div>
                                    </div>
                                )}
                            
                                {poemState.tag 
                                    && (
                                           poemState.tag.some(item => item[0] === 'Character Name Poem' && item[1])
                                        || poemState.tag.some(item => item[0] === 'Chapter Title Poem' && item[1])
                                        || poemState.tag.some(item => item[0] === 'Morning After Poem' && item[1])
                                        || poemState.tag.some(item => item[0] === 'Proxy Poem' && item[1])
                                    )
                                    && (
                                        <div className={styles.detailItem}>
                                            <h3>TAGS</h3>
                                            {poemState.tag.map((tag, idx) => {
                                                if (tag[0] === 'Chapter Title Poem' && tag[1]) {
                                                    return <p key={idx}>Chapter Title Poem</p>;
                                                }
                                                if (tag[0] === 'Character Name Poem' && tag[1]) {
                                                    return <p key={idx}>Character Name Poem</p>;
                                                }
                                                if (tag[0] === 'Morning After Poem' && tag[1]) {
                                                    return <p key={idx}>Morning After Poem</p>;
                                                }
                                                if (tag[0] === 'Proxy Poem' && tag[1]) {
                                                    return <p key={idx}>Proxy Poem</p>;
                                                }
                                                return null;
                                            }).filter(Boolean)}
                                        </div>
                                )}

                                {/* {poemState.tag && poemState.tag.some(item => item[0] === 'Character Name Poem' && item[1]) && (
                                    <div className={styles.detailItem}>
                                        <h3>REPRESENTATIVE CHARACTER</h3>
                                        <FormatContent content={poemState.repCharacter} />
                                    </div>
                                )} */}
                                
                                {poemState.replyPoems && poemState.replyPoems.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>REPLY TO</h3>
                                        <div className={styles.relatedPoemsContainer}>
                                            {poemState.replyPoems.map((reply, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={`/poems/${parseInt(reply[0].substring(0, 2), 10)}/${parseInt(reply[0].substring(4, 6), 10)}`}
                                                    className={styles.relatedPoemLink}
                                                >
                                                    {reply}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {poemState.relWithEvidence && poemState.relWithEvidence.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>INTERNAL ALLUSION</h3>
                                        <div className={styles.allusionContainer}>
                                            {poemState.relWithEvidence.map((rel, idx) => (
                                                <div key={idx} className={styles.allusionItem}>
                                                    <EvidenceDropdown 
                                                        content={
                                                            <a 
                                                                href={`/poems/${parseInt(rel[0].substring(0, 2), 10)}/${parseInt(rel[0].substring(4, 6), 10)}`}
                                                                className={styles.relatedPoemLink}
                                                            >
                                                                {rel[0]}
                                                            </a>
                                                        }
                                                        evidence={rel[1]}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {poemState.groupPoems && poemState.groupPoems.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>GROUPED WITH</h3>
                                        <div className={styles.relatedPoemsContainer}>
                                            {poemState.groupPoems.map((group, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={`/poems/${parseInt(group[0].substring(0, 2), 10)}/${parseInt(group[0].substring(4, 6), 10)}`}
                                                    className={styles.relatedPoemLink}
                                                >
                                                    {group}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}           

                                {poemState.source && poemState.source.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>ALLUSION(S)</h3>
                                        {poemState.source.map((source, idx) => (
                                            <div key={idx} className={styles.allusionItem}>
                                                <p><strong>Poet:</strong> {source.poet && <FormatContent content={source.poet} />}</p>
                                                <p><strong>Source:</strong> {source.source && <FormatContent content={source.source + (source.order ? ` ${source.order}` : '')} />}</p>
                                                <p><strong>Original:</strong> {source.honka && <FormatContent content={source.honka} />}</p>
                                                <div className={styles.allusionTranslations}>
                                                    <p><strong>Translations:</strong></p>
                                                    {source.translation.map((trans, tIdx) => (
                                                        <div key={tIdx} className={styles.translationItem}>
                                                            <p className={styles.source_translatorName}>{trans[0] + ': '}</p>
                                                            <p className={styles.translationText}>{<FormatContent content={trans[1]} />}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                    ))}
                                    </div>
                                )}            

                                {poemState.furtherReadings && poemState.furtherReadings.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>FURTHER READING</h3>
                                        {poemState.furtherReadings.map((furtherReading, idx) => (
                                            <p key={idx}>{<FormatContent content={`${furtherReading.title}`}/>}</p>
                                        ))}
                                    </div>
                                )}
            
                                    <div className={styles.contributorsSection}>
                                        <h3>CONTRIBUTORS</h3>
                                        <ContributorView
                                        pageType="poem"
                                        identifier={`${chapter}-${number}`}
                                        />
                                    </div>
                                </div>
                            </div>



                            {/* Discussion Panel */}
                            <div className={styles.analysisPanel}>
                                <div className={styles.panelHeader} onClick={() => togglePanel('discussion')}>
                                    <h2>DISCUSSION</h2>
                                    <div className={`${styles.toggleArrow} ${expandedPanels.discussion ? styles.arrowExpanded : styles.arrowCollapsed}`}>
                                        ▼
                                    </div>
                                </div>
                                <div className={`${styles.panelContent} ${expandedPanels.discussion ? styles.expanded : styles.collapsed}`}>
                                <DiscussionArea 
                                    pageType="poem"
                                    identifier={`${chapter}-${number}`}
                                />
                                </div>
                            </div>
                        </div>

                    {/* Right Side - Translations */}
                    <div className={styles.translationsRight}>
                    <h2 className={styles.translationsHeader}>TRANSLATIONS</h2>
                    
                    {/* Waley Translation */}
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            {Array.isArray(poemState.trans.Waley) ? (
                                <>
                                {typeof poemState.trans.Waley[0] === 'string' && 
                                poemState.trans.Waley[0] !== 'N/A' && (
                                    <FormatContent content={poemState.trans.Waley[0]} />
                                )}
                                </>
                            ) : (
                                <FormatContent content={poemState.trans.Waley} />
                            )}
                        </div>
                        <div className={styles.translationMeta}>
                            <SpeakerAddresseeInfo 
                                speaker={poemState.speaker}
                                addressee={poemState.addressee}
                                poemId={poemState.poemId}
                            />
                            <a href="/translators/Arthur Waley" className={styles.translatorName}>WALEY</a>
                        </div>
                    </div>
                    
                    {/* Seidensticker Translation */}
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Seidensticker === 'string' && 
                            poemState.trans.Seidensticker !== 'N/A' && (
                                <FormatContent content={poemState.trans.Seidensticker} />
                            )}
                        </div>
                        <div className={styles.translationMeta}>
                            <SpeakerAddresseeInfo 
                                speaker={poemState.speaker}
                                addressee={poemState.addressee}
                                poemId={poemState.poemId}
                            />
                            <a href="/translators/Edward Seidensticker" className={styles.translatorName}>SEIDENSTICKER</a>
                        </div>
                    </div>
                    
                    {/* Tyler Translation */}
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Tyler === 'string' && 
                            poemState.trans.Tyler !== 'N/A' && (
                                <FormatContent content={poemState.trans.Tyler} />
                            )}
                        </div>
                        <div className={styles.translationMeta}>
                            <SpeakerAddresseeInfo 
                                speaker={poemState.speaker}
                                addressee={poemState.addressee}
                                poemId={poemState.poemId}
                            />
                            <a href="/translators/Royall Tyler" className={styles.translatorName}>TYLER</a>
                        </div>
                    </div>
                    
                    {/* Washburn Translation */}
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Washburn === 'string' && 
                            poemState.trans.Washburn !== 'N/A' && (
                                <FormatContent content={poemState.trans.Washburn} />
                            )}
                        </div>
                        <div className={styles.translationMeta}>
                            <SpeakerAddresseeInfo 
                                speaker={poemState.speaker}
                                addressee={poemState.addressee}
                                poemId={poemState.poemId}
                            />
                            <a href="/translators/Dennis Washburn" className={styles.translatorName}>WASHBURN</a>
                        </div>
                    </div>
                    
                    {/* Cranston Translation */}
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Cranston === 'string' && 
                            poemState.trans.Cranston !== 'N/A' && (
                                <FormatContent content={poemState.trans.Cranston} />
                            )}
                        </div>
                        <div className={styles.translationMeta}>
                            <SpeakerAddresseeInfo 
                                speaker={poemState.speaker}
                                addressee={poemState.addressee}
                                poemId={poemState.poemId}
                            />
                            <a href="/translators/Edwin Cranston" className={styles.translatorName}>CRANSTON</a>
                        </div>
                    </div>
                    
                    {/* Original Text */}
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            <p className={styles.originalJapanese}>{poemState.JPRM[0]}</p>
 
                            <p className={styles.originalRomaji}>{poemState.JPRM[1]}</p>
                        </div>
                        <div className={styles.translationMeta}>
                            <SpeakerAddresseeInfo 
                                speaker={poemState.speaker}
                                addressee={poemState.addressee}
                                poemId={poemState.poemId}
                            />
                            <div className={styles.translatorName}>ORIGINAL</div>
                        </div>
                    </div>
                    
                    {/* User Translation Input */}
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            <TransSubmit pageType="poem" identifier={`${chapter}-${number}`} />
                            <TransDisplay pageType="poem" identifier={`${chapter}-${number}`} />
                        </div>
                        <div className={styles.translationMeta}>
                            <SpeakerAddresseeInfo 
                                speaker={poemState.speaker}
                                addressee={poemState.addressee}
                                poemId={poemState.poemId}
                            />
                            <div className={styles.translatorName}>YOURS</div>
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </div>
    );
};

export default PoemDisplay;