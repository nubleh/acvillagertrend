(() => {
  const oneDay = 362387865600000;
  const oneDayMs = 86400000;
  const mar20 = 690212988518400000;
  const mar20Date = new Date('2020/03/20');
  /*

  2020/03/30
  Request URL: https://discord.com/api/v6/guilds/494376688256548865/messages/search?channel_id=669696796024504341&max_id=693836867174400000

  693836867174400000

  03/29
  693474479308800000

  03/28
  693112091443200000

  03/20
  690212988518400000

  */

  const options = {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US",
      "authorization": "OTAzMDE1ODgyNzg2MjgzNTI.CM6j9g.5kbtcWM9hwSH6onwJqSlkMmT_ho",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-fingerprint": "498555632052338688.ZB3nOLZ-L4zAzD-MYle6QMqmVss"
    },
    "referrer": "https://discord.com/channels/494376688256548865/494378610132516865",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  };
  // fetch("https://discord.com/api/v6/guilds/494376688256548865/messages/search?channel_id=669696796024504341&content=pietro", options);

  const now = new Date();
  const dateToday = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);

  runForDay(dateToday);

  function runForDay(day){
    if (day <= mar20Date || day <= (new Date('2020/05/08'))) {
      console.log('reached march20');
      return;
    }
    const results = {};
    const diff = day - mar20Date;
    const diffDay = diff/oneDayMs;
    const maxId = mar20 + (diffDay * oneDay);
    console.log(`searching for ${day.toLocaleString()}`);
    let index = 0;

    const run = () => {
      const namesGot = names();
      const nextName = namesGot[index];
      if (!nextName){
        console.log('finished going through names');
        callhome({
          date: day.toLocaleString(),
          dateString: `${day.getFullYear()}_${day.getMonth()+1}_${day.getDate()}`,
          results,
          type: 'results'
        }).then(() => {
          console.log('called home');
          runForDay((new Date(day.getTime() - oneDayMs)));
        });
        return;
      }
  
      fetch(`https://discord.com/api/v6/guilds/494376688256548865/messages/search?channel_id=669696796024504341&max_id=${maxId}&content=${nextName}`, options).then(r => r.json()).then(j => {
        results[nextName] = j.total_results;
        console.log(`${index + 1}/${namesGot.length} - ${nextName} ${j.total_results}`);
        index += 1;
        setTimeout(run, 1000);
      });
    };
  
    run();
  }

  function callhome(data){
    return fetch('http://localhost:3002/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
  }

  function names() {
    return ['raymond', 'judy', 'marshal'];
    return ["admiral","angus","apollo","avery","boris","boyd","bruce","butch","buzz","camofrog","cesar","chief","chow","croque","curt","cyd","cyrano","del","dobie","elvis","fang","frank","gaston","gonzo","grizzly","groucho","gruff","hamphrey","harry","hopper","ike","kabuki","knox","limberg","lobo","monty","murphy","octavian","peewee","rasher","ricky","rizzo","rocco","rolf","rooney","roscoe","spike","static","t-bone","tom","vic","vladimir","walt","wart jr.","wolfgang","antonio","axel","bam","biff","bill","billy","boone","boots","buck","bud","coach","cobb","cousteau","curly","dom","drift","flip","frobert","genji","goose","hamlet","iggly","jay","jitters","kevin","kid cat","kody","leonardo","louie","lyman","mac","moose","mott","peck","pierce","poncho","ribbot","roald","rod","rory","rowan","rudy","samson","scoot","sheldon","sly","snake","sparro","sprocket","sterling","stinky","tad","tank","teddy","tybalt","al","alfonso","anchovy","barold","beau","benedict","benjamin","big top","biskit","bob","bones","boomer","broccolo","chester","claude","clay","clyde","cole","cranston","cube","deli","derwin","dizzy","doc","drago","drake","egbert","elmer","erik","filbert","hopkins","hornsby","hugh","jacob","jeremiah","joey","lucky","marcel","moe","nate","ozzie","paolo","papi","prince","puck","pudge","punchy","raddle","rex","rodeo","sherb","simon","spork","stitches","stu","tucker","wade","walker","weber","zucker","alice","annalisa","aurora","ava","bea","bertha","bettina","cally","caroline","carrie","celia","chevre","coco","daisy","deena","dora","ellie","eunice","fauna","flurry","gala","gayle","gladys","goldie","jambette","june","kiki","kitt","lily","lolly","lucy","maggie","maple","marcie","margie","marina","megan","melba","merengue","midge","mitzi","molly","nan","nana","norma","olive","peaches","pekoe","poppy","rhonda","sally","sandy","savannah","skye","stella","sydney","sylvana","tia","vesta","agent s","anabelle","anicotti","apple","audie","bangle","bella","bianca","bluebear","bonbon","bubbles","bunnie","candi","carmen","cheri","chrissy","cookie","dotty","felicity","flora","freckles","gabi","ketchup","maddie","merry","nibbles","pango","pate","patty","peanut","peggy","penelope","pinky","piper","pippy","pompom","puddles","rosie","ruby","sprinkle","tabby","tammi","tangy","truffles","tutu","twiggy","victoria","wendy","winnie","beardo","chadder","chops","colton","curlos","ed","eugene","graham","hans","henry","hippeux","huck","jacques","julian","keaton","ken","kidd","klaus","kyle","leopold","lionel","lopez","lucha","marshal","o'hare","olaf","phil","pietro","quillson","raymond","rodney","shep","tex","zell","alli","amelia","ankha","annalise","astrid","baabara","becky","bitty","blaire","blanche","bree","broffina","cashmere","claudia","cleo","diana","elise","eloise","francine","freya","friga","gigi","gloria","greta","gwen","judy","julia","kitty","maelle","mallary","mathilda","mint","miranda","monique","naomi","olivia","opal","pancetti","pecan","portia","purrl","queenie","robin","snooty","soleil","tasha","tiffany","timbra","tipper","velma","violet","vivian","whitney","willow","yuka","agnes","canberra","charlise","cherry","deirdre","diva","flo","frita","fuchsia","hazel","katt","mira","muffy","pashmina","paula","phoebe","plucky","reneigh","renée","rocket","shari","sylvia","tammy","ursala"];
  };

})();