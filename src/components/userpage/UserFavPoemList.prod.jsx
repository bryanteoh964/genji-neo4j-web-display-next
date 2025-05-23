'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/favPoemList.module.css';
import FavButton from '../FavButton.prod';
import { useSession } from "next-auth/react";

export default function FavPoemList() {
  const { data: session } = useSession();
  const [favList, setFav] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState('');

  // get user
  const fetchUser = async () => {
      try {
          if (session) {
              const response = await fetch(`/api/user/me`);
              const data = await response.json();
              setUser(data._id);
              return data._id;
          }
          return null;
      } catch (error) {
          console.error('Error fetching user:', error);
          return null;
      }
  };

const getChapterName = (String) => {
  const chapterNames = {'1':'Kiritsubo 桐壺','2':'Hahakigi 帚木','3':'Utsusemi 空蝉','4':'Yūgao 夕顔','5':'Wakamurasaki 若紫','6':'Suetsumuhana 末摘花','7':'Momiji no Ga 紅葉賀','8':'Hana no En 花宴','9':'Aoi 葵','10':'Sakaki 榊','11':'Hana Chiru Sato 花散里','12':'Suma 須磨','13':'Akashi 明石','14':'Miotsukushi 澪標','15':'Yomogiu 蓬生','16':'Sekiya 関屋','17':'E Awase 絵合','18':'Matsukaze 松風','19':'Usugumo 薄雲','20':'Asagao 朝顔','21':'Otome 乙女','22':'Tamakazura 玉鬘','23':'Hatsune 初音','24':'Kochō 胡蝶','25':'Hotaru 螢','26':'Tokonatsu 常夏','27':'Kagaribi 篝火','28':'Nowaki 野分','29':'Miyuki 行幸','30':'Fujibakama 藤袴','31':'Makibashira 真木柱','32':'Umegae 梅枝','33':'Fuji no Uraba 藤裏葉','34':'Wakana: Jō 若菜上','35':'Wakana: Ge 若菜下','36':'Kashiwagi 柏木','37':'Yokobue 横笛','38':'Suzumushi 鈴虫','39':'Yūgiri 夕霧','40':'Minori 御法','41':'Maboroshi 幻','42':'Niou Miya 匂宮','43':'Kōbai 紅梅','44':'Takekawa 竹河','45':'Hashihime 橋姫','46':'Shii ga Moto 椎本','47':'Agemaki 総角','48':'Sawarabi 早蕨','49':'Yadorigi 宿木','50':'Azumaya 東屋','51':'Ukifune 浮舟','52':'Kagerō 蜻蛉','53':'Tenarai 手習','54':'Yume no Ukihashi 夢浮橋'};
  return chapterNames[String];
}

const getChapterNum = (String) => {
  const sub = String.substring(0, 2);
  return sub.replace(/^0+/, '');
}

const getPoemNum = (String) => {
  const sub = String.substring(4, 6);
  return sub.replace(/^0+/, '');
}

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = await fetchUser();
                    
        if (userId) {
          const response = await fetch(`/api/favPoem/getUserFavList?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch favorites');
          }
          const data = await response.json();

          const processedResults = data.fav.map((res) => ({
            poemId: res.poemId,
            chapterNum: getChapterNum(res.poemId),
            poemNum: getPoemNum(res.poemId),
            japanese: res.jprm
          }))

          setFav(processedResults);

          console.log('Fav', processedResults);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [session])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className={styles.favContainer}>
      {favList.length === 0 ? (
        <p className={styles.emptyMessage}>No favorite poems yet</p>
      ) : (
        <ul className={styles.poemList}>
          {favList.map((fav) => (
            <li key={fav.poemId} className={styles.poemCard}>

              {!loading && <FavButton poemId={fav.poemId} JPRM={fav.japanese} />}
              <Link href={`/poems/${fav.chapterNum}/${fav.poemNum}`} className={styles.poemLink}>
                <div className={styles.poemHeader}>

                  <p className={styles.chapterInfo}>
                    {fav.chapterNum} {getChapterName(fav.chapterNum)} {fav.poemNum}
                  </p>
                </div>
              
                <div className={styles.japaneseText}>
                  {fav.japanese.split('\n').map((line, index) => (
                    <p key={`jp-${fav.poemId}-${index}`}>{line}</p>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
