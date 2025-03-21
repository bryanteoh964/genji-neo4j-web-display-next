import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get one user's all fav poems
export async function GET(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        const db = await client.db('user');

        const favs = await db.collection('favPoem')
            .find({ 
                userIds: userId
            })
            .sort({ updatedAt: -1 })
            .toArray();

        // console.log('fav:', favs, 'userId:', userId);


        const processedFavs = favs.map(fav => {
            
            const chapterNum = fav.poemId.substring(0, 2).replace(/^0+/, '');
            const poemNum = fav.poemId.substring(4, 6).replace(/^0+/, '');
            const getChapterName = (String) => {
                const chapterNames = {'1':'Kiritsubo 桐壺','2':'Hahakigi 帚木','3':'Utsusemi 空蝉','4':'Yūgao 夕顔','5':'Wakamurasaki 若紫','6':'Suetsumuhana 末摘花','7':'Momiji no Ga 紅葉賀','8':'Hana no En 花宴','9':'Aoi 葵','10':'Sakaki 榊','11':'Hana Chiru Sato 花散里','12':'Suma 須磨','13':'Akashi 明石','14':'Miotsukushi 澪標','15':'Yomogiu 蓬生','16':'Sekiya 関屋','17':'E Awase 絵合','18':'Matsukaze 松風','19':'Usugumo 薄雲','20':'Asagao 朝顔','21':'Otome 乙女','22':'Tamakazura 玉鬘','23':'Hatsune 初音','24':'Kochō 胡蝶','25':'Hotaru 螢','26':'Tokonatsu 常夏','27':'Kagaribi 篝火','28':'Nowaki 野分','29':'Miyuki 行幸','30':'Fujibakama 藤袴','31':'Makibashira 真木柱','32':'Umegae 梅枝','33':'Fuji no Uraba 藤裏葉','34':'Wakana: Jō 若菜上','35':'Wakana: Ge 若菜下','36':'Kashiwagi 柏木','37':'Yokobue 横笛','38':'Suzumushi 鈴虫','39':'Yūgiri 夕霧','40':'Minori 御法','41':'Maboroshi 幻','42':'Niou Miya 匂宮','43':'Kōbai 紅梅','44':'Takekawa 竹河','45':'Hashihime 橋姫','46':'Shii ga Moto 椎本','47':'Agemaki 総角','48':'Sawarabi 早蕨','49':'Yadorigi 宿木','50':'Azumaya 東屋','51':'Ukifune 浮舟','52':'Kagerō 蜻蛉','53':'Tenarai 手習','54':'Yume no Ukihashi 夢浮橋'};
                return chapterNames[String];
              }
            
            return {
                _id: fav._id,
                poemId: fav.poemId,
                japanese: fav.jprm,
                chapterNum,
                chapterName: getChapterName(chapterNum),
                poemNum,
                createdAt: fav.createdAt,
                updatedAt: fav.updatedAt
            };
        });

        return NextResponse.json({ favs: processedFavs }, { status: 200 });

    } catch (error) {
        console.error('Error finding fav poems:', error);
        return NextResponse.json(
            { error: 'Failed to find user fav poems' }, 
            { status: 500 }
        );
    }
}