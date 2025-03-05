import { useMemo, useState, useEffect, Suspense } from 'react'
import { Button, Tag } from 'antd';
import Link from 'next/link';
import styles from '../styles/pages/poemDisplay.module.css';
import { BackTop } from 'antd';
import FavButton from './FavButton.prod';
import ContributorView from './ContributorView.prod'
import DiscussionArea from './DiscussionArea.prod'
import { useRouter } from 'next/navigation';

// skeleton loader
const PoemSkeleton = () => (
  <div className={styles.skeletonContainer}>
    <div className={styles.skeletonTitle}></div>
    <div className={styles.skeletonPoem}>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
    </div>
    <div className={styles.skeletonInfo}>
      <div className={styles.skeletonCard}></div>
      <div className={styles.skeletonCard}></div>
      <div className={styles.skeletonCard}></div>
    </div>
  </div>
);

// translation section
const TranslationSection = ({ translations }) => (
  <section id="translations" className={styles.section}>
    <h2 className={styles.sectionTitle}>Translations</h2>
    <div className={styles.translations}>
      {Object.entries(translations).map(([translator, translation]) => (
        <div key={translator} className={styles.translation}>
          <h3 className={styles.translatorName}>{translator}</h3>
          {renderTranslation(translator, translation)}
        </div>
      ))}
    </div>
  </section>
);

// render translation
const renderTranslation = (translator, translation) => {
  if (Array.isArray(translation)) {
    return (
      <>
        {typeof translation[0] === 'string' ? 
          translation[0].split('\n').map((line, index) => (
            <p key={`line-${index}`} className={styles.romajiLine}>{line}</p>
          ))
        : <p>{translation[0]}</p>
        }
        {translator === 'Waley' && translation[1] !== '-1' && (
          <p className={styles.pageNumber}>Page: {translation[1]}</p>
        )}
      </>
    );
  } 
  else if (typeof translation === 'string') {
    return translation.split('\n').map((line, index) => (
      <p key={`line-${index}`} className={styles.romajiLine}>{line}</p>
    ));
  }
  else if (translation && typeof translation === 'object') {
    return Object.entries(translation).map(([key, value]) => (
      <div key={key}>
        <strong>{key}: </strong>
        {typeof value === 'string' ? 
          value.split('\n').map((line, index) => (
            <p key={`${key}-line-${index}`} className={styles.romajiLine}>{line}</p>
          ))
        : <p>{value}</p>
        }
      </div>
    ));
  }
  return <p>No translation available</p>;
};


const PoemDisplay = ({ poemData }) => {
  const router = useRouter();
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
    source: [], // allusions
    rel: [], // related poems
    pnum: [],
    tag: [], // tags
    notes: "",
    isLoading: true,
    poemId: "",
    narrativeContext: "",
    paraphrase: "",
    handwritingDescription: "",
    paperMediumType: "",
    deliveryStyle: "",
    season: "",
    kigo: { jp: "", en: "" },
    pt: "",
    pw: { name: "", kanji_hiragana: "", english_equiv: "", gloss: "" },
    proxy: "",
    messenger: ""
  });
  
  const chapter = poemData.chapterNum;
  const number = poemData.poemNum.toString().padStart(2, '0');
  
  const chapterNames = useMemo(() => ({
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
  }), []);
  
  const chapter_name = chapterNames[chapter];

  // read local storage to validate chapter and poem number
  useEffect(() => {
    const validateParams = async () => {
      try {

        const cachedChapterInfo = localStorage.getItem('chapterInfo');
        let chapterInfo;
        
        if (cachedChapterInfo) {
          chapterInfo = JSON.parse(cachedChapterInfo);
        } else {
          const response = await fetch(`/api/poems/poem_query`);
          if (!response.ok) {
            throw new Error('Failed to fetch chapter information');
          }
          chapterInfo = await response.json();
          localStorage.setItem('chapterInfo', JSON.stringify(chapterInfo));
        }

        const chapterNum = parseInt(chapter);
        const poem = parseInt(number);
        
        if (Number.isInteger(chapterNum) === false || Number.isInteger(poem) === false) {
          throw new Error("Chapter or poem is not an integer");
        }
        
        if (chapterNum < 1 || chapterNum > 54) {
          throw new Error("Chapter is out of range");
        }
        
        const validPoemCount = chapterInfo[chapterNum - 1]?.count;
        if (validPoemCount === undefined || validPoemCount < 1 || !Number.isInteger(validPoemCount)) {
          throw new Error("Chapter does not have a valid poem count");
        }
        
        if (poem < 1 || poem > validPoemCount) {
          throw new Error("Poem is out of range");
        }
        
      } catch (error) {
        console.error('Error validating parameters:', error);
        alert("Invalid URL: " + error.message);
        router.push('/poems');
      }
    };

    validateParams();
  }, [chapter, number, router]);

  // get poem data
  useEffect(() => {
    const fetchPoemData = async () => {
      try {
        
        const cacheKey = `poem_${chapter}_${number}`;
        const cachedPoem = localStorage.getItem(cacheKey);
        
        if (cachedPoem) {
          const poemData = JSON.parse(cachedPoem);
          setPoemState(prev => ({...prev, ...poemData, isLoading: false}));
          return;
        }
        
        // if no cached data, fetch from server
        const response = await fetch(`/api/poems?chapter=${chapter}&&number=${number}`);
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
        if (chapter === "13" && number === "02") {
          addressee = "Genji";
        } else {
          addressee = exchange.map(e => e.end.properties.name);
        }
        
        
        let translations = {
          Waley: 'N/A',
          Seidensticker: 'N/A',
          Tyler: 'N/A',
          Washburn: 'N/A',
          Cranston: 'N/A'
        };
        
        transTemp.forEach(e => {
          translations[e[0]] = e[0] !== 'Waley' ? e[1] : [e[1], e[2]];
        });
        
        
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
          messenger: responseData[17]
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
  }, [chapter, number]);

  // render addressee
  const renderAddressee = useMemo(() => {
    if (chapter === "13" && number === "02") {
      // special case
      return (
        <a href={`/characters/${encodeURIComponent(poemState.addressee)}`} className={styles.characterTag}>
          <p key={poemState.addressee}>{poemState.addressee || "N/A"}</p>
        </a>
      );
    } else {
      // normal case
      return (
        <>
          {Array.isArray(poemState.addressee) && poemState.addressee.map(e => (
            <a key={e} href={`/characters/${encodeURIComponent(e)}`} className={styles.characterTag}>
              <p>{e || "N/A"}</p>
            </a>
          ))}
        </>
      );
    }
  }, [chapter, number, poemState.addressee]);

  
  const renderMainContent = () => {
    if (poemState.isLoading) {
      return <PoemSkeleton />;
    }

    return (
      <>
        <h1 className={styles.title}>
          <span className={styles.chapterTitle}>Chapter {chapter}: {chapter_name}</span>
          <span className={styles.poemTitle}> Poem {poemData.poemNum}</span>
          
          <FavButton poemId={poemState.poemId} JPRM={poemState.JPRM[0]} />

          <div className={styles.poemContainer}>
            <div className={styles.prominentPoemText}>
              {poemState.JPRM[0] && (
                <>
                  {poemState.JPRM[0].split('\n').map((line, index) => (
                    <div key={`jp-${index}`} className={styles.poemLine}>
                      {line.split('').map((char, charIndex) => (
                        <span key={`char-${charIndex}`} className={styles.character}>
                          {char}
                        </span>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </h1>

        <div className={styles.contentWrapper}>
          <nav className={styles.tableOfContents}>
            <h2>Contents</h2>
            <ul>
              <li><a href="#poem-info">Poem Information</a></li>
              <li><a href="#translations">Translations</a></li>
              {poemState.source.length > 0 && <li><a href="#allusions">Allusions</a></li>}
              {poemState.rel.length > 0 && <li><a href="#related-poems">Related Poems</a></li>}
              {poemState.tag.length > 0 && <li><a href="#tags">Tags</a></li>}
              {poemState.notes && <li><a href="#notes">Notes</a></li>}
            </ul>
          </nav>
          
          <div className={styles.mainContent}>
        
            <section id="poem-info" className={styles.section}>
              <h2 className={styles.sectionTitle}>Poem Information</h2>
              <div className={styles.poemInfo}>
                <div className={styles.infoCard}>
                  <h3>Speaker</h3>
                  {poemState.speaker.length !== 0 && poemState.speaker.map(e =>
                    <a key={e} href={`/characters/${encodeURIComponent(e)}`} className={styles.characterTag}>
                      <p>{e || "N/A"}</p>
                    </a>
                  )}
                </div>

                {poemState.proxy && (
                  <div className={styles.infoCard}>
                    <h3>Proxy</h3>
                    <a href={`/characters/${encodeURIComponent(poemState.proxy)}`} className={styles.characterTag}>
                      <p>{poemState.proxy}</p>
                    </a>
                  </div>
                )}

                {poemState.messenger && (
                  <div className={styles.infoCard}>
                    <h3>Messenger</h3>
                    <a href={`/characters/${encodeURIComponent(poemState.messenger)}`} className={styles.characterTag}>
                      <p>{poemState.messenger}</p>
                    </a>
                  </div>
                )}
              
                <div className={styles.prominentPoemInInfo}>
                  {poemState.JPRM[0] && poemState.JPRM[1] && (
                    <>
                      <div className={styles.poemLines}>
                        {poemState.JPRM[0].split('\n').map((line, index) => (
                          <p key={`jp-${index}`} className={styles.japaneseLine}>{line}</p>
                        ))}
                      </div>

                      <div className={styles.poemLines}>
                        {poemState.JPRM[1].split('\n').map((line, index) => (
                          <p key={`rm-${index}`} className={styles.romajiLine}>{line}</p>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              
                <div className={styles.infoCard}>
                  <h3>Addressee</h3>
                  {renderAddressee}
                </div>
              </div>

              <div className={styles.contextInfo}>
                {poemState.narrativeContext && (
                  <div className={`${styles.infoCard} ${styles.narrativeContextCard}`}>
                    <h3>Narrative Context</h3>
                    <p>{poemState.narrativeContext}</p>
                  </div>
                )}

                
                <Suspense fallback={<div>Loading details...</div>}>
                  <PoemDetailsSection poemState={poemState} />
                </Suspense>
              </div>
            </section>

            <Suspense fallback={<div>Loading translations...</div>}>
              <TranslationSection translations={poemState.trans} />
            </Suspense>

            {poemState.source.length > 0 && (
              <Suspense fallback={<div>Loading allusions...</div>}>
                <AllusionsSection sources={poemState.source} />
              </Suspense>
            )}
            
            {poemState.rel.length > 0 && (
              <Suspense fallback={<div>Loading related poems...</div>}>
                <RelatedPoemsSection relatedPoems={poemState.rel} />
              </Suspense>
            )}

            {poemState.tag.length > 0 && (
              <Suspense fallback={<div>Loading tags...</div>}>
                <TagsSection tags={poemState.tag} />
              </Suspense>
            )}

            {poemState.notes && (
              <section id="notes" className={styles.section}>
                <h2 className={styles.sectionTitle}>Commentary</h2>
                <p>{poemState.notes}</p>
              </section>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <ContributorView
        pageType="poem"
        identifier={`${chapter}-${number.replace(/^0+/, '')}`}
      />

      {renderMainContent()}
      
      <DiscussionArea 
        pageType="poem"
        identifier={`${chapter}-${number.replace(/^0+/, '')}`}
      />

      <BackTop className={styles.backTop}>
        <div>Back to top</div>
      </BackTop>
    </div>
  );
};

const PoemDetailsSection = ({ poemState }) => {
  return (
    <>
      {poemState.paraphrase && (
        <div className={styles.infoCard}>
          <h3>Paraphrase</h3>
          <p>{poemState.paraphrase}</p>
        </div>
      )}

      {poemState.deliveryStyle && (
        <div className={styles.infoCard}>
          <h3>Delivery Style</h3>
          <p>{poemState.deliveryStyle}</p>
        </div>
      )}

      {poemState.paperMediumType && (
        <div className={styles.infoCard}>
          <h3>Paper or Other Medium Type</h3>
          <p className={styles.characterTag}>{poemState.paperMediumType}</p>
        </div>
      )}

      {poemState.handwritingDescription && (
        <div className={styles.infoCard}>
          <h3>Handwriting Description</h3>
          <p className={styles.characterTag}>{poemState.handwritingDescription}</p>
        </div>
      )}

      {poemState.season && (
        <div className={styles.infoCard}>
          <h3>Season</h3>
          <p className={styles.characterTag}>{poemState.season}</p>
        </div>
      )}      

      {poemState.kigo && poemState.kigo.en && poemState.kigo.jp && (
        <div className={styles.infoCard}>
          <h3>Seasonal Word</h3>
          <p>{poemState.kigo.jp}</p>
          <p>{poemState.kigo.en}</p>
        </div>
      )} 

      {poemState.pt && (
        <div className={styles.infoCard}>
          <h3>Poetic Technique</h3>
          <p className={styles.characterTag}>{poemState.pt}</p>
        </div>
      )}

      {poemState.pw && poemState.pw.name && (
        <div className={styles.infoCard}>
          <h3>Poetic Word</h3>
          <p>{poemState.pw.name}</p>
          <p>{poemState.pw.kanji_hiragana}</p>
          <p>{poemState.pw.english_equiv}</p>
        </div>
      )}
    </>
  );
};


const AllusionsSection = ({ sources }) => {
  return (
    <section id="allusions" className={styles.section}>
      <h2 className={styles.sectionTitle}>Allusions</h2>
      {sources.map(e => (
        <div key={e.id} className={styles.allusion}>
          <div className={styles.allusionInfo}>
            <p><strong>Poet:</strong> {e.poet}</p>
            <p><strong>Source:</strong> {e.order !== undefined ? `${e.source} ${e.order}` : e.source}</p>
            <p><strong>Honka:</strong> </p> 
            <div className={styles.allusionPoems}>
              {e.honka.split('\n').map((line, index) => (
                <p key={`jp-${index}`} className={styles.japaneseLine}>{line}</p>
              ))}
            </div>
            
            <p><strong>Romaji:</strong> </p>
            <div className={styles.allusionPoems}> 
              {e.romaji.split('\n').map((line, index) => (
                <p key={`rm-${index}`} className={styles.romajiLine}>{line}</p>
              ))}
            </div>
          
            <p><strong>Notes:</strong> {e.notes}</p>

            <div>
              <strong>Translation:</strong>
              {e.translation.map((el, index) => (
                <div key={index}>
                  <div className={styles.allusionPoems}>
                    <h4>{el[0] + ":"}</h4>
                    {el[1].split('\n').map((line, index) => (
                      <p key={`tr-${index}`} className={styles.romajiLine}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};


const RelatedPoemsSection = ({ relatedPoems }) => {
  return (
    <section id="related-poems" className={styles.section}>
      <h2 className={styles.sectionTitle}>Related Poems</h2>
      <div className={styles.relatedPoems}>
        {relatedPoems.map(e =>
          <Link 
            key={e[0]}
            href={`/poems/${e[0].substring(0, 2)}/${e[0].substring(4, 6)}`}
            target="_blank"
          >
            <Tag className={styles.relatedPoemTag}>
              {e[0]}
            </Tag>
          </Link>
        )}
      </div>
    </section>
  );
};


const TagsSection = ({ tags }) => {
  return (
    <section id="tags" className={styles.section}>
      <h2 className={styles.sectionTitle}>Tags</h2>
      <div className={styles.tags}>
        {tags.map(e =>
          <Tag 
            key={e[0]}
            className={styles.poemTag}
          >
            {e[0]}
          </Tag>
        )}
      </div>
    </section>
  );
};

export default PoemDisplay;