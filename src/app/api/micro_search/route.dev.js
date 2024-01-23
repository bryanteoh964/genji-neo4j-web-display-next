import waley from './waley_indexes.json'
let washburn = {}
let seidensticker = {}
let tyler = {}


async function getData(words, translation) {
    let result = {};
    let wordsArray = words.split(' ');
    const translations = {
        waley: waley,
        washburn: washburn,
        seidensticker: seidensticker,
        tyler: tyler
    };
    // Checking if the provided translation is valid
    if (!(translation in translations)) {
        return new Response('Translation not found. Please enter a valid translation.', { status: 400 });
    }
    // Limit number of words to 5
    if (wordsArray.length > 5) {
        return new Response('Too many words. Please enter 5 or less words.', { status: 400 });
    }
	// Calculate results
    for (let word of wordsArray) {
        if (word in translations[translation]) {
            result[word] = translations[translation][word];
        } else {
            return new Response(`Word '${word}' not found in '${translation}' translation.`, { status: 400 });
        }
    }
    return result;
}

export const GET = async (request) => {
	try{
		const {searchParams} = new URL(request.url);
		const words = searchParams.get('words')
		const translation = searchParams.get('translation')
		const data = await getData(words, translation);
        
		return new Response(JSON.stringify(data), {status: 200})
	} catch(error){
		return new Response(error,{status:500})
  	}
}