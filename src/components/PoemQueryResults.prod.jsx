'use client'
import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/poemDisplay.module.css';
import FavButton from '../components/FavButton.prod';
import ContributorView from '../components/ContributorView.prod';
import DiscussionArea from '../components/DiscussionArea.prod';
import FormatContent from '../components/FormatText.prod'
import TransSubmit from '../components/TranslationSubmit.prod';
import TransDisplay from '../components/TranslationDisplay.prod'

const PoemDisplay = ({ poemData }) => {
    // set default tab to "meaning"
    const [activeTab, setActiveTab] = useState('meaning');
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
        rel: [],
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
        kigo: { jp: "", en: "" },
        pt: "",
        pw: { name: "", kanji_hiragana: "", english_equiv: "", gloss: "" },
        messenger: "",
        age: ""
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

    // check cache
    useEffect(() => {
        const fetchPoemData = async () => {
            try {
                setPoemState(prev => ({...prev, isLoading: true}));
                
                const cacheKey = `poem_${chapter}_${number}`;
                const cachedPoem = localStorage.getItem(cacheKey);
                
                if (cachedPoem) {
                    const poemData = JSON.parse(cachedPoem);
                    setPoemState(prev => ({...prev, ...poemData, isLoading: false}));
                    return;
                }
                
                const response = await fetch(`/api/poems?chapter=${chapter}&&number=${numStr}`);
                if (response.status !== 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const responseData = await response.json();
                const exchange = responseData[0];
                const transTemp = responseData[1];
                const sources = responseData[2];
                const related = responseData[3];
                const tags = responseData[4];
                const pls = responseData[6];
                
                // special case
                let addressee;
                if (chapter === "13" && numStr === "02") {
                    addressee = "Genji";
                } else {
                    addressee = exchange.map(e => e.end.properties.name);
                }
                
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
                    speaker: [exchange[0]?.start?.properties?.name],
                    addressee: addressee,
                    JPRM: [
                        exchange[0]?.segments[0]?.end?.properties?.Japanese,
                        exchange[0]?.segments[0]?.end?.properties?.Romaji
                    ],
                    trans: translations,
                    source: src_obj,
                    rel: related,
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
                    pt: responseData[14],
                    pw: responseData[15],
                    proxy: responseData[16],
                    messenger: responseData[17],
                    age: responseData[18]
                };
                
                setPoemState(prev => ({...prev, ...newPoemState}));
                
                localStorage.setItem(cacheKey, JSON.stringify(newPoemState));
                setTimeout(() => localStorage.removeItem(cacheKey), 3600000);
                
            } catch (error) {
                console.error('Error fetching poem data:', error);
                setPoemState(prev => ({...prev, isLoading: false}));
            }
        };
        
        fetchPoemData();
    }, [chapter, number, numStr]);

    if (poemState.isLoading) {
        return <div className={styles.loadingContainer}>Loading poem...</div>;
    }

    return (
        <div className={styles.poemPageContainer}>
            {/* upper area info */}
            <div className={styles.headerInfoSection}>
                <div className={styles.logoSection}>
                    <div className={styles.logo}>GENJI LOGO</div>
                </div>
                
                <div className={styles.speakerSection}>
                    <h3>SPEAKER</h3>
                    {poemState.speaker.map((speaker, index) => (
                        <a key={index} href={`/characters/${encodeURIComponent(speaker)}`} className={styles.characterLink}>
                            {speaker || "N/A"}
                        </a>
                    ))}
                    {poemState.proxy && (
                        <div className={styles.proxyInfo}>
                            <span>PROXY POET</span>
                            <a href={`/characters/${encodeURIComponent(poemState.proxy)}`}>
                                {poemState.proxy}
                            </a>
                        </div>
                    )}
                </div>
                
                <div className={styles.chapterInfo}>
                    <h3>CHAPTER</h3>
                    <span>{chapter}: {chapter_name}</span>
                </div>
                
                <div className={styles.poemTypeInfo}>
                    <h3>POEM TYPE</h3>
                    <span>{poemState.tag[0] || "-"}</span>
                </div>
                
                <div className={styles.poemCodeInfo}>
                    <h3>POEM CODE</h3>
                    <span>{poemState.poemId}</span>
                </div>
                
                <div className={styles.ageInfo}>
                    <h3>AGE OF GENJI</h3>
                    <span>{poemState.age || '-'}</span>
                </div>
                
                <div className={styles.chapterTitleSource}>
                    <h3>CHAPTER TITLE SOURCE</h3>
                    <span>{"-"}</span>
                </div>

                <div className={styles.characterNameInfo}>
                    <h3>CHARACTER NAME</h3>
                    <span>{"-"}</span>
                </div>
                

                <div className={styles.seasonInfo}>
                    <h3>SEASON</h3>
                    <span>{poemState.season || "-"}</span>
                </div>

                
                <div className={styles.addresseeSection}>
                    <h3>ADDRESSEE</h3>
                    {Array.isArray(poemState.addressee) ? (
                        poemState.addressee.map((addressee, index) => (
                            <a key={index} href={`/characters/${encodeURIComponent(addressee)}`} className={styles.characterLink}>
                                {addressee || "N/A"}
                            </a>
                        ))
                    ) : (
                        <a href={`/characters/${encodeURIComponent(poemState.addressee)}`} className={styles.characterLink}>
                            {poemState.addressee || "N/A"}
                        </a>
                    )}
                </div>
            </div>
            
            {/* main area */}
            <div className={styles.mainContentSection}>
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
                    
                    <div className={styles.romajiText}>
                        {poemState.JPRM[1]?.split('\n').map((line, index) => (
                            <p key={`rm-${index}`} className={styles.romajiLine}>{line}</p>
                        ))}
                    </div>
                    
                    {/* add fav button */}
                    <div className={styles.favButtonContainer}>
                        <FavButton poemId={poemState.poemId} JPRM={poemState.JPRM[0]} />
                    </div>
                </div>
                
                {/* mid translation part */}
                <div className={styles.translationsSection}>
                    {/* Waley */}
                    <div className={styles.translation}>
                        <h3>Waley</h3>
                        <div className={styles.translationContent}>
                            {Array.isArray(poemState.trans.Waley) ? (
                                <>
                                    {typeof poemState.trans.Waley[0] === 'string' && 
                                     poemState.trans.Waley[0] !== 'N/A' && 
                                     poemState.trans.Waley[0].split('\n').map((line, index) => (
                                        <p key={`waley-${index}`}>{line}</p>
                                    ))}
                                    {poemState.trans.Waley[1] !== '-1' && (
                                        <p className={styles.pageReference}>Page: {poemState.trans.Waley[1]}</p>
                                    )}
                                </>
                            ) : (
                                <p>{poemState.trans.Waley}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Seidensticker */}
                    <div className={styles.translation}>
                        <h3>Seidensticker</h3>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Seidensticker === 'string' && 
                             poemState.trans.Seidensticker !== 'N/A' && 
                             poemState.trans.Seidensticker.split('\n').map((line, index) => (
                                <p key={`seidensticker-${index}`}>{line}</p>
                            ))}
                        </div>
                    </div>
                    
                    {/* Tyler */}
                    <div className={styles.translation}>
                        <h3>Tyler</h3>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Tyler === 'string' && 
                             poemState.trans.Tyler !== 'N/A' && 
                             poemState.trans.Tyler.split('\n').map((line, index) => (
                                <p key={`tyler-${index}`}>{line}</p>
                            ))}
                        </div>
                    </div>
                    
                    {/* Washburn */}
                    <div className={styles.translation}>
                        <h3>Washburn</h3>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Washburn === 'string' && 
                             poemState.trans.Washburn !== 'N/A' && 
                             poemState.trans.Washburn.split('\n').map((line, index) => (
                                <p key={`washburn-${index}`}>{line}</p>
                            ))}
                        </div>
                    </div>
                    
                    {/* Cranston */}
                    <div className={styles.translation}>
                        <h3>Cranston</h3>
                        <div className={styles.translationContent}>
                            {typeof poemState.trans.Cranston === 'string' && 
                             poemState.trans.Cranston !== 'N/A' && 
                             poemState.trans.Cranston.split('\n').map((line, index) => (
                                <p key={`cranston-${index}`}>{line}</p>
                            ))}
                        </div>
                    </div>
                    
                    {/* user translation input */}
                    <TransSubmit pageType="poem" identifier={`${chapter}-${number}`} />
                    
                    {/* show user translations */}
                    <TransDisplay pageType="poem" identifier={`${chapter}-${number}`} />

                </div>
                
                {/* right tab area */}
                <div className={styles.tabsSection}>
                    {/* tab switch logic */}
                    <div className={styles.tabsHeader}>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'meaning' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('meaning')}
                        >
                            MEANING
                        </button>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'commentary' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('commentary')}
                        >
                            COMMENTARY
                        </button>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'moreDetails' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('moreDetails')}
                        >
                            MORE DETAILS
                        </button>
                    </div>
                    
                    {/* tab content */}
                    <div className={styles.tabContent}>
                        {/* meaning tab */}
                        {activeTab === 'meaning' && (
                            <div className={styles.meaningTabContent}>
                                {poemState.narrativeContext && (
                                    <div className={styles.narrativeContext}>
                                        <h3>NARRATIVE CONTEXT</h3>
                                        <p>{poemState.narrativeContext}</p>
                                    </div>
                                )}
                                
                                {poemState.paraphrase && (
                                    <div className={styles.paraphrase}>
                                        <h3>PARAPHRASE</h3>
                                        <p>{poemState.paraphrase}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* commentary tab */}
                        {activeTab === 'commentary' && (
                            <div className={styles.commentaryTabContent}>
                                {poemState.notes && (
                                    <div className={styles.notes}>
                                        {/* <h3>COMMENTARY</h3> */}
                                        <FormatContent content={poemState.notes} />
                                    </div>
                                )}

                                {/* user commentary */}
                                <DiscussionArea 
                                    pageType="poem"
                                    identifier={`${chapter}-${number}`}
                                />
                            </div>
                        )}
                        
                        {/* more detail tab */}
                        {activeTab === 'moreDetails' && (
                            <div className={styles.moreDetailsTabContent}>
                                {poemState.paperMediumType && (
                                    <div className={styles.detailItem}>
                                        <h3>PAPER/MEDIUM</h3>
                                        <p>{poemState.paperMediumType}</p>
                                    </div>
                                )}
                                
                                {poemState.deliveryStyle && (
                                    <div className={styles.detailItem}>
                                        <h3>DELIVERY STYLE</h3>
                                        <p>{poemState.deliveryStyle}</p>
                                    </div>
                                )}
                                
                                {poemState.source.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>ALLUSIONS</h3>
                                        {poemState.source.map((source, idx) => (
                                            <div key={idx} className={styles.allusionItem}>
                                                <p><strong>Poet:</strong> {source.poet}</p>
                                                <p><strong>Source:</strong> {source.source + (source.order ? ` ${source.order}` : '')}</p>
                                                <p><strong>Original:</strong> {source.honka}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {poemState.season && (
                                    <div className={styles.detailItem}>
                                        <h3>SEASON IN NARRATIVE</h3>
                                        <p>{poemState.season}</p>
                                    </div>
                                )}
                                
                                {poemState.kigo && poemState.kigo.jp && (
                                    <div className={styles.detailItem}>
                                        <h3>SEASONAL WORD</h3>
                                        <p>{poemState.kigo.jp} - {poemState.kigo.en}</p>
                                    </div>
                                )}
                                
                                {poemState.pt && (
                                    <div className={styles.detailItem}>
                                        <h3>POETIC TECHNIQUE</h3>
                                        <p>{poemState.pt}</p>
                                    </div>
                                )}
                                
                                {poemState.rel.length > 0 && (
                                    <div className={styles.detailItem}>
                                        <h3>RELATED POEMS</h3>
                                        <div className={styles.relatedPoemsContainer}>
                                            {poemState.rel.map((rel, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={`/poems/${rel[0].substring(0, 2)}/${rel[0].substring(4, 6)}`}
                                                    className={styles.relatedPoemLink}
                                                >
                                                    {rel[0]}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className={styles.furtherReadingSection}>
                                    <h3>FURTHER READING</h3>
                                    {/* no conetent now */}
                                </div>
                                
                                <div className={styles.contributorsSection}>
                                    <h3>CONTRIBUTORS</h3>
                                    {/* contributor list */}
                                    <ContributorView
                                        pageType="poem"
                                        identifier={`${chapter}-${number}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoemDisplay;