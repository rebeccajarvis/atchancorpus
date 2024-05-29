//Bottom of this doc sets up page structure and references components created above
// import {Homepage} from './pages/Homepage.js'
// import "./pages/*.js"
// import {Homepage, HomepageFR, Orthography, Glosspage, StoryView, StoryViewFR} from './pages/index.js'

//Global variable for moro_click database
var global_id_to_morpheme_definition = [];
var global_id_to_row = {};
var global_whole_data;
var firstLoad = true;

//These are imports from ReactRouter o.13.x
//docs: https://github.com/rackt/react-router/blob/0.13.x/docs/guides/overview.md
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var State = ReactRouter.State;
// const Homepage = lazy(() => import('./pages/Homepage.js'));

// These are endpoints to load data from.
// Loaded from static files in the repository rather than from lingsync.

// Static file with sentences.
var sentence_url = '/story_compiler/sentences.json';
// var sentence_url = 'FHB/fhb_sentences.json'

// Static file with stories.
var story_url = '/story_compiler/story_index.json';
// var story_url = 'FHB/fhb_stories.json'

var global_show_french = true;

// Promise that is resolved once the sentence data is loaded
var raw_data_promise = new Promise(function(resolve, reject) {
  $.ajax({
      url: sentence_url,
      dataType: 'json',
      success: function(d) {
        resolve(d);
      },
      error: function(xhr, status, err) {
        console.error(sentence_url, status, err.toString());
          reject(err);}

    })
});

// Promise that is resolved once stories are loaded
var story_data_promise = new Promise(function(resolve, reject) {
  $.ajax({
      url: story_url,
      dataType: 'json',
      success: function(d) {
        resolve(d);
      },
      error: function(xhr, status, err) {
        console.error(sentence_url, status, err.toString());
          reject(err);}

    })
});

var sentence_data_promise = Promise.all([raw_data_promise,
                                          story_data_promise]).then(
  function(x) {
    var sentence_data = x[0];
    var story_data = x[1];
    var stories = _.reduce(story_data.rows, function(acc, x) {
      acc[x.key] = 1;
      return acc;
    }, {})
    return _.filter(sentence_data.rows, function(x) {return stories[x.key[0]] == 1;})
  }
);


var Homepage = React.createClass(
        
  {render: function() {
//=========================HOMEPAGE===============================
  return   <div className='ui text container'> 


    <h1 className='ui dividing header'>Atchan Song and Story Corpus</h1>
    <h2 >ÁCAN NANMƐ LÊ ÁLƐ́BHƆ́ </h2>

    <div className="ui segment">
    <img className="ui medium spaced rounded image" src="./images/Anono_street.jpg"></img>
    <img className="ui medium spaced rounded image" src="./images/Blockhauss_ceremony.JPG"></img>
    </div>
        
    <p>This website contains a collection of texts, songs, and stories in the Atchan language (also known as Ébrié). 
      Atchan is a language spoken by the Tchaman people (also called the Ébrié people), who live in approximately sixty villages located within and near the city of Abidjan, Côte d’Ivoire’s economic capital. 
      Following the classification of Williamson & Blench (2000:18), Atchan, along with its sister language Nghlwa (Mbatto), forms the Potou subgroup in the Kwa (and broader Niger-Congo) language family. 
      Through the resources on this page, you can learn more about the Tchaman people, their language, and their culture.</p> 
  
    <p>This website is a collaboration between Dr. Yao Maxime Dido, Professor of Linguistics at Université Alassane Ouattara de Bouaké (Côte d’Ivoire), and linguists at the University of California, Berkeley. Dr. Dido participated in the implementation of the Atchan orthography along with Prof. Rémy Bôle-Richard, a linguist specializing in West African languages and the designer of the orthography.</p>
    
    <p>This website is intended first and foremost as a resource for the Tchaman people, and in addition for researchers who are interested in learning more about the Atchan language.</p>
    
    <h1 className='ui dividing header'>Project members</h1>

    {/* <h2> (Visit the Storytellers page to learn more about the people who you see and hear in the texts.) </h2> */}

    <h3> Yao Maxime Dido </h3>
        <p> Prof. Dido is a native speaker of Atchan, originally from the village of Blockhauss. He published multiple articles about his mother tongue between 2018 and 2021, and he plans to publish more in the coming months. </p> 

    <h3> Becky Jarvis </h3>
        <p> <a href="https://sites.google.com/berkeley.edu/rebecca-jarvis/">Becky</a> is a Ph.D. candidate in linguistics at UC Berkeley. </p>

    <h3> Katie Russell </h3>
        <p> <a href="https://www.krrussell.com">Katie</a> is a Ph.D. candidate in linguistics at UC Berkeley. </p> 

    <h3> Siddharth Ganapathy </h3>
        <p> Siddharth is an undergraduate student in computer science and linguistics at UC Berkeley. </p> 

    <h3> Lindsay Hatch </h3>
        <p> Lindsay is an undergraduate student in linguistics at UC Berkeley. </p> 

    <h3> Marie-Anne Xu </h3>
        <p> Marie-Anne is an undergraduate student in EECS at UC Berkeley. </p> 

      </div>
      }
  }
)

var HomepageFR = React.createClass(
        
  {render: function() {
//=========================HOMEPAGE===============================
  return   <div className='ui text container'> 


      <h1 className='ui dividing header'>Recueil de contes et chants Atchan </h1>
      <h2 >ÁCAN NANMƐ LÊ ÁLƐ́BHƆ́ </h2>

      <div className="ui segment">
      <img className="ui medium spaced rounded image" src="./images/Anono_street.jpg"></img>
      <img className="ui medium spaced rounded image" src="./images/Blockhauss_ceremony.JPG"></img>
      </div>

    <p> Ce site web fait la collection de textes, chansons et contes en langue atchan plus connue sous le nom ébrié. 
      Cette langue est parlée par les Ébrié qui se nomment eux-mêmes Tchaman et qui vivent dans une soixantaine de villages tous situés à Abidjan (actuelle capitale de la Côte d'Ivoire) et ses alentours. 
      Selon la classification de Williamson & Blench (2000:18), l'atchan forme, avec le nghlwa (mbatto), le sous-groupe Potou, lui-même issu du groupe Kwa appartenant à la Famille Niger-Congo. 
      Les éléments collectés ici vous permettront d'apprendre davantage sur le peuple, sa langue et ses us et coutumes.   </p> 
  
    <p> Ce site est une collaboration entre Dr Yao Maxime Dido, Professeur de linguistique à l'Université Alassane Ouattara de Bouaké (Côte d'Ivoire) et des linguistes de l'Université de Berkeley en Californie aux USA. 
      Dr Dido a participé à la mise en place de l'orthographe de l'atchan avec le Prof. Rémy Bôle-Richard, un linguiste spécialiste des langues Ouest-Africaines, qui en est le concepteur.</p>
    
    <p> C'est un site qui sert de ressource d'abord aux Tchaman, ensuite aux chercheurs qui souhaitent en savoir plus sur la langue. </p>
    
    <h1 className='ui dividing header'>Membres du projet</h1>

    {/* <h2> (Visit the Storytellers page to learn more about the people who you see and hear in the texts.) </h2> */}

    <h3> Yao Maxime Dido </h3>
        <p> Dr Dido est locuteur natif de l'atchan, originaire du village de Blockhauss et auteur d'articles publiés sur sa langue maternelle de 2018 à 2021 et prévoit de publier d'autres dans les mois à venir. </p> 

    <h3> Becky Jarvis </h3>
        <p> <a href="http://sites.google.com/berkeley.edu/rebecca-jarvis/">Becky</a> est candidate au doctorat en linguistique à l’Université de Californie à Berkeley.  </p>

    <h3> Katie Russell </h3>
        <p> <a href="http://www.krrussell.com">Katie</a> est candidate au doctorat en linguistique à l’Université de Californie à Berkeley. </p> 

    <h3> Siddharth Ganapathy </h3>
        <p> Siddharth est étudiant en informatique et linguistique à l’Université de Californie à Berkeley. </p> 

    <h3> Lindsay Hatch </h3>
        <p> Lindsay est étudiante en linguistique à l’Université de Californie à Berkeley. </p> 

    <h3> Marie-Anne Xu </h3>
        <p> Marie-Anne est étudiante en génie électrique et informatique  à l'Université de Californie à Berkeley. </p> 

        </div>
        }
    }
)

var Orthography = React.createClass(
        
  {render: function() {
      return   <div className='ui text container'>
          <h1 className='ui dividing header'>Orthography</h1>
          <table className='ui unstackable celled table '>
          <thead>
            <tr><th>IPA</th>
            <th>Orthography</th>
            <th>Example (from Bôle-Richard & Dido book)</th>
          </tr></thead>

          <tbody>
          <tr>
            <td data-label="IPA">p</td>
            <td data-label="Orthography">p</td>
            <td data-label="Job">ápɛn ‘debt’</td>
          </tr>
          <tr>
            <td data-label="IPA">pʰ</td>
            <td data-label="Orthography"><b>ph</b></td>
            <td data-label="Example">áphɛ̂n ‘twenty’</td>
          </tr>
          <tr>
            <td data-label="IPA">b</td>
            <td data-label="Orthography">b</td>
            <td data-label="Example">ábɛ ‘paddle’</td>
          </tr>
          <tr>
              <td data-label="IPA">t</td>
              <td data-label="Orthography">t</td>
              <td data-label="Example">áta ‘insult’</td>
          </tr>
          <tr>
            <td data-label="IPA">tʰ</td>
            <td data-label="Orthography"><b>th</b></td>
            <td data-label="Example">átha ‘war’</td>
          </tr>
          <tr>
              <td data-label="IPA">d</td>
              <td data-label="Orthography">d</td>
              <td data-label="Example">du ‘snake’</td>
          </tr>
          <tr>
              <td data-label="IPA">c</td>
              <td data-label="Orthography">c</td>
              <td data-label="Example">ácɔn ‘fish’</td>
          </tr>
          <tr>
            <td data-label="IPA">cʰ</td>
            <td data-label="Orthography"><b>ch</b></td>
            <td data-label="Example">chɔn ‘hen’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɟ</td>
            <td data-label="Orthography"><b>j</b></td>
            <td data-label="Example">ájí ‘respect’</td>
          </tr>
          <tr>
              <td data-label="IPA">k</td>
              <td data-label="Orthography">k</td>
              <td data-label="Example">áko ‘hunger’</td>
          </tr>
          <tr>
            <td data-label="IPA">kʰ</td>
            <td data-label="Orthography"><b>kh</b></td>
            <td data-label="Example">ákhɔ́ ‘friendship’</td>
          </tr>
          <tr>
              <td data-label="IPA">g</td>
              <td data-label="Orthography">g</td>
              <td data-label="Example">gwe ‘sea’</td>
          </tr>
          <tr>
              <td data-label="IPA">kp</td>
              <td data-label="Orthography">kp</td>
              <td data-label="Example">kpakpâ ‘papaya’</td>
          </tr>
          <tr>
              <td data-label="IPA">gb</td>
              <td data-label="Orthography">gb</td>
              <td data-label="Example">gba ‘dog’</td>
          </tr>
          <tr>
              <td data-label="IPA">f</td>
              <td data-label="Orthography">f</td>
              <td data-label="Example">ńfɛ ‘eggplant’</td>
          </tr>
          <tr>
              <td data-label="IPA">v</td>
              <td data-label="Orthography">v</td>
              <td data-label="Example">nvrâ ‘appattam’</td>
          </tr>
          <tr>
              <td data-label="IPA">s</td>
              <td data-label="Orthography">s</td>
              <td data-label="Example">asa ‘gecko’</td>
          </tr>
          <tr>
              <td data-label="IPA">z</td>
              <td data-label="Orthography">z</td>
              <td data-label="Example">zúmwɛn ‘fish species’</td>
          </tr>
          <tr>
              <td data-label="IPA">h</td>
              <td data-label="Orthography">h</td>
              <td data-label="Example">áhɔn ‘ax’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɓ</td>
            <td data-label="Orthography"><b>bh</b></td>
            <td data-label="Example">ábhɛ́ ‘rope’</td>
          </tr>
          <tr>
              <td data-label="IPA">l</td>
              <td data-label="Orthography">l</td>
              <td data-label="Example">la ‘to pray’</td>
          </tr>
          <tr>
            <td data-label="IPA">j</td>
            <td data-label="Orthography"><b>y</b></td>
            <td data-label="Example">áyá ‘tree’</td>
          </tr>
          <tr>
              <td data-label="IPA">w</td>
              <td data-label="Orthography">w</td>
              <td data-label="Example">awɔ́ ‘cat’</td>
          </tr>
          <tr>
              <td data-label="IPA">m</td>
              <td data-label="Orthography">m</td>
              <td data-label="Example">ńmɔ́n ‘arm’</td>
          </tr>
          <tr>
              <td data-label="IPA">n</td>
              <td data-label="Orthography">n</td>
              <td data-label="Example">ánɛn ‘hoe’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɗ</td>
            <td data-label="Orthography"><b>l</b></td>
            <td data-label="Example">lyali ‘to forget’</td>
          </tr>
          <tr>
              <td data-label="IPA">r</td>
              <td data-label="Orthography">r</td>
              <td data-label="Example">bwri ‘rat’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɲ</td>
            <td data-label="Orthography"><b>y</b></td>
            <td data-label="Example">yɛn ‘to know’</td>
          </tr>
          <tr>
            <td data-label="IPA">ŋʷ</td>
            <td data-label="Orthography"><b>w</b></td>
            <td data-label="Example">wan ‘to crawl’</td>
          </tr>
          <tr>
              <td data-label="IPA">i</td>
              <td data-label="Orthography">i</td>
              <td data-label="Example">áyí ‘thing’</td>
          </tr>
          <tr>
              <td data-label="IPA">e</td>
              <td data-label="Orthography">e</td>
              <td data-label="Example">áde ‘antelope’</td>
          </tr>
          <tr>
              <td data-label="IPA">ɛ</td>
              <td data-label="Orthography">ɛ</td>
              <td data-label="Example">ádɛ ‘palm tree’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɛ̃</td>
            <td data-label="Orthography"><b>ɛn</b></td>
            <td data-label="Example">átɛn ‘fire’</td>
          </tr>
          <tr>
              <td data-label="IPA">a</td>
              <td data-label="Orthography">a</td>
              <td data-label="Example">áyá ‘tree’</td>
          </tr>
          <tr>
            <td data-label="IPA">ã</td>
            <td data-label="Orthography"><b>an</b></td>
            <td data-label="Example">bran ‘animal’</td>
          </tr>
          <tr>
              <td data-label="IPA">ɔ</td>
              <td data-label="Orthography">ɔ</td>
              <td data-label="Example">ákɔ ‘attic’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɔ̃</td>
            <td data-label="Orthography"><b>ɔn</b></td>
            <td data-label="Example">ńmɔ́n ‘arm’</td>
          </tr>
          <tr>
              <td data-label="IPA">o</td>
              <td data-label="Orthography">o</td>
              <td data-label="Example">agbo ‘door’</td>
          </tr>
          <tr>
              <td data-label="IPA">u</td>
              <td data-label="Orthography">u</td>
              <td data-label="Example">du ‘snake’</td>
          </tr>

        </tbody>

        </table>
      
      </div>
  }
}
)

var OrthographyFR = React.createClass(
        
  {render: function() {
      return   <div className='ui text container'>
          <h1 className='ui dividing header'>Orthography</h1>
          <table className='ui celled table '>
          <thead>
            <tr><th>IPA</th>
            <th>Orthographe</th>
            <th>Example (de le livre de Bôle-Richard et Dido)</th>
          </tr></thead>

          <tbody>
          <tr>
            <td data-label="IPA">p</td>
            <td data-label="Orthography">p</td>
            <td data-label="Job">ápɛn ‘dette’</td>
          </tr>
          <tr>
            <td data-label="IPA">pʰ</td>
            <td data-label="Orthography"><b>ph</b></td>
            <td data-label="Example">áphɛ̂n ‘vingt’</td>
          </tr>
          <tr>
            <td data-label="IPA">b</td>
            <td data-label="Orthography">b</td>
            <td data-label="Example">ábɛ ‘pagaie’</td>
          </tr>
          <tr>
              <td data-label="IPA">t</td>
              <td data-label="Orthography">t</td>
              <td data-label="Example">áta ‘insulte’</td>
          </tr>
          <tr>
            <td data-label="IPA">tʰ</td>
            <td data-label="Orthography"><b>th</b></td>
            <td data-label="Example">átha ‘guerre’</td>
          </tr>
          <tr>
              <td data-label="IPA">d</td>
              <td data-label="Orthography">d</td>
              <td data-label="Example">du ‘serpent’</td>
          </tr>
          <tr>
              <td data-label="IPA">c</td>
              <td data-label="Orthography">c</td>
              <td data-label="Example">ácɔn ‘poisson’</td>
          </tr>
          <tr>
            <td data-label="IPA">cʰ</td>
            <td data-label="Orthography"><b>ch</b></td>
            <td data-label="Example">chɔn ‘pou’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɟ</td>
            <td data-label="Orthography"><b>j</b></td>
            <td data-label="Example">ájí ‘respect’</td>
          </tr>
          <tr>
              <td data-label="IPA">k</td>
              <td data-label="Orthography">k</td>
              <td data-label="Example">áko ‘faim’</td>
          </tr>
          <tr>
            <td data-label="IPA">kʰ</td>
            <td data-label="Orthography"><b>kh</b></td>
            <td data-label="Example">ákhɔ́ ‘cameraderie’</td>
          </tr>
          <tr>
              <td data-label="IPA">g</td>
              <td data-label="Orthography">g</td>
              <td data-label="Example">gwe ‘mer’</td>
          </tr>
          <tr>
              <td data-label="IPA">kp</td>
              <td data-label="Orthography">kp</td>
              <td data-label="Example">kpakpâ ‘papaye’</td>
          </tr>
          <tr>
              <td data-label="IPA">gb</td>
              <td data-label="Orthography">gb</td>
              <td data-label="Example">gba ‘chien’</td>
          </tr>
          <tr>
              <td data-label="IPA">f</td>
              <td data-label="Orthography">f</td>
              <td data-label="Example">ńfɛ ‘aubergine’</td>
          </tr>
          <tr>
              <td data-label="IPA">v</td>
              <td data-label="Orthography">v</td>
              <td data-label="Example">nvrâ ‘appattam’</td>
          </tr>
          <tr>
              <td data-label="IPA">s</td>
              <td data-label="Orthography">s</td>
              <td data-label="Example">asa ‘margouillat’</td>
          </tr>
          <tr>
              <td data-label="IPA">z</td>
              <td data-label="Orthography">z</td>
              <td data-label="Example">zúmwɛn ‘espèce de poisson’</td>
          </tr>
          <tr>
              <td data-label="IPA">h</td>
              <td data-label="Orthography">h</td>
              <td data-label="Example">áhɔn ‘hache’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɓ</td>
            <td data-label="Orthography"><b>bh</b></td>
            <td data-label="Example">ábhɛ́ ‘corde’</td>
          </tr>
          <tr>
              <td data-label="IPA">l</td>
              <td data-label="Orthography">l</td>
              <td data-label="Example">la ‘prier’</td>
          </tr>
          <tr>
            <td data-label="IPA">j</td>
            <td data-label="Orthography"><b>y</b></td>
            <td data-label="Example">áyá ‘arbre’</td>
          </tr>
          <tr>
              <td data-label="IPA">w</td>
              <td data-label="Orthography">w</td>
              <td data-label="Example">awɔ́ ‘chat’</td>
          </tr>
          <tr>
              <td data-label="IPA">m</td>
              <td data-label="Orthography">m</td>
              <td data-label="Example">ńmɔ́n ‘bras’</td>
          </tr>
          <tr>
              <td data-label="IPA">n</td>
              <td data-label="Orthography">n</td>
              <td data-label="Example">ánɛn ‘houe’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɗ</td>
            <td data-label="Orthography"><b>l</b></td>
            <td data-label="Example">lyali ‘oublier’</td>
          </tr>
          <tr>
              <td data-label="IPA">r</td>
              <td data-label="Orthography">r</td>
              <td data-label="Example">bwri ‘ratte’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɲ</td>
            <td data-label="Orthography"><b>y</b></td>
            <td data-label="Example">yɛn ‘savoir’</td>
          </tr>
          <tr>
            <td data-label="IPA">ŋʷ</td>
            <td data-label="Orthography"><b>w</b></td>
            <td data-label="Example">wan ‘ramperl’</td>
          </tr>
          <tr>
              <td data-label="IPA">i</td>
              <td data-label="Orthography">i</td>
              <td data-label="Example">áyí ‘chose’</td>
          </tr>
          <tr>
              <td data-label="IPA">e</td>
              <td data-label="Orthography">e</td>
              <td data-label="Example">áde ‘antilope’</td>
          </tr>
          <tr>
              <td data-label="IPA">ɛ</td>
              <td data-label="Orthography">ɛ</td>
              <td data-label="Example">ádɛ ‘palmier’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɛ̃</td>
            <td data-label="Orthography"><b>ɛn</b></td>
            <td data-label="Example">átɛn ‘feu’</td>
          </tr>
          <tr>
              <td data-label="IPA">a</td>
              <td data-label="Orthography">a</td>
              <td data-label="Example">áyá ‘arbre’</td>
          </tr>
          <tr>
            <td data-label="IPA">ã</td>
            <td data-label="Orthography"><b>an</b></td>
            <td data-label="Example">bran ‘animal’</td>
          </tr>
          <tr>
              <td data-label="IPA">ɔ</td>
              <td data-label="Orthography">ɔ</td>
              <td data-label="Example">ákɔ ‘grenier’</td>
          </tr>
          <tr>
            <td data-label="IPA">ɔ̃</td>
            <td data-label="Orthography"><b>ɔn</b></td>
            <td data-label="Example">ńmɔ́n ‘bras’</td>
          </tr>
          <tr>
              <td data-label="IPA">o</td>
              <td data-label="Orthography">o</td>
              <td data-label="Example">agbo ‘porte’</td>
          </tr>
          <tr>
              <td data-label="IPA">u</td>
              <td data-label="Orthography">u</td>
              <td data-label="Example">du ‘serpent’</td>
          </tr>

        </tbody>

        </table>
      
      </div>
  }
}
)

//React Class for a single story view
// var StoryView = React.createClass({
//   //React object state
//   //
//   //sentence: loaded flag and sentence data
//   //story: loaded flag and story data
//   //show_gloss: flag true if we show interlinear gloss lines
//   getInitialState: function() {
//     return {sentence: {data: [], loaded: false},
//             story: {data: [], loaded: false},
//             show_gloss: false,
//             show_gloss_fr: false,
//             story_view: false, 
//             french_view: true, // EDIT: added french toggle
//             french_story: {data: [], loaded: false}
//             };
//   },
//   //queue uploading of story and sentence data when this component is mounted
//   componentDidMount: function() {
//     story_data_promise.then(function(rawdata){
//       this.setState({story:{data: rawdata.rows, loaded: true}});
//     }.bind(this));

//     sentence_data_promise.then(function(sentences){
//       this.setState({sentence:{data: sentences, loaded: true}});
//     }.bind(this));
//   },
//   //only ready to display story when story and sentence data have loaded
//   loaded: function() {
//     return this.state.story.loaded && this.state.sentence.loaded;
//   },
//   // Get the story object
//   getStory: function() {
//     var arr = this.state.story.data;
//     for (var i = 0; i < arr.length; i++) {
//       var o = arr[i];
//       if (o.key == this.props.params.key) {
//         return  o.value;
//       }
//     }
//     return {};
//   },
//   //return name of story by searching story data for this story's id
//   getStoryName: function() {
//     return _.get(this.getStory(), 'name', "<Unknown Story>");
//   },
//   getStoryName_fr: function() {
//     return _.get(this.getStory(), 'name_fr', "<Unknown Story>");
//   },
//   //return author of story by searching story data for this story's id
//   getStoryAuthor: function() {
//     return _.get(this.getStory(), 'author', "");
//   },
//   //toggles interlinear gloss or not
//   toggleGloss: function() {
//     var new_show_gloss = !this.state.show_gloss;
//     var new_show_gloss_fr = !this.state.show_gloss_fr;
//     var new_story_view = this.state.story_view;
//     if(new_show_gloss) {
//       new_story_view = false;
//     }
//     this.setState({show_gloss: new_show_gloss,
//                    show_gloss_fr: new_show_gloss_fr,
//                     story_view: new_story_view});
//   },
//   //toggles story view
//   toggleStoryView: function() {
//     var new_show_gloss = this.state.show_gloss;
//     var new_show_gloss_fr = this.state.show_gloss_fr;
//     var new_story_view = !this.state.story_view;
//     var new_french_view = this.state.french_view; // EDIT
//     if(new_story_view) {
//       new_show_gloss = false;
//       new_show_gloss_fr = false;
//     }
//     this.setState({show_gloss: new_show_gloss,
//                    show_gloss_fr: new_show_gloss,
//                     story_view: new_story_view,
//                     french_view: new_french_view}); // EDIT
//   },
//   //renders component
//   render: function() {
//     // If we haven't loaded yet, just render the dimmer.
//     if (!this.loaded()) {
//       return <div className="ui active dimmer">
//         <div className="ui text loader">Loading</div>
//       </div>;
//     }
//     // process sentence data to render alignment of morphemes/glosses and show one clause per line
//     // lodash chaining: https://lodash.com/docs#_
//     var sentences;
//     var story_sentences = _(this.state.sentence.data).filter(
//       // render sentences from this story
//       function(x){
//         return x.value.story == this.props.params.key;
//       }.bind(this)
//     );
//     if (this.state.story_view) {
//       var sentence_rows = story_sentences.map(
//         function(x) {
//             return [
//               (
//                 <div key={x.key + "-1"} className="eight wide column"
//                     style={{"padding": "0px"}}>
//                   <Sentence sentence={x.value.sentence}
//                             only_utterance="true" />
//                 </div>
//               ),
//               (
//                 <div key={x.key + "-2"} className="eight wide column"
//                     style={{"padding": "0px"}}>
//                   <Sentence sentence={x.value.sentence}
//                             only_translation="true" />
//                 </div>
//               )
//             ];
//         }.bind(this)
//       ).value();
      
//       sentences = (
//         <div className='ui text container'
//             style={{"padding-top": "14px"}}>
//           <div className="ui grid">
//             <div className="eight wide column"
//                 style={{"padding": "0px"}}>
//                 <h2>Atchan</h2>
//             </div>
//             <div className="eight wide column"
//                 style={{"padding": "0px"}}>
//                 <h2>English</h2>
//             </div>
//           {sentence_rows}
//           </div>
//         </div>
//       );
//       // }
//     } else {
//       sentences = story_sentences.map(
//         // how to render a sentence
//         function(x){
//           return <Sentence key={x.key}
//                     sentence={x.value.sentence}
//                     show_gloss={this.state.show_gloss}
//                     show_gloss_fr={this.state.show_gloss_fr}/>;
//         }.bind(this)
//       ).value();
//     }

//     return (
//       <div>
//         <h1>{this.getStoryName()}</h1> by {this.getStoryAuthor()} <div className="ui form">

//           <div className="grouped fields">
//             <label>View Options</label>

//             <div className="field">
//               <div className="ui slider checkbox">
//                 <input type="radio" name="throughput" checked={this.state.show_gloss} onChange={this.toggleGloss}> </input>
//                 <label>Show Glosses</label>
//               </div>
//             </div>

//             <div className="field">
//               <div className="ui slider checkbox">
//                 <input type="radio" name="throughput" checked={this.state.story_view} onChange={this.toggleStoryView}> </input>
//                 <label>Story View</label>
//               </div>
//             </div>

//             {/* <iframe width="560" height="315" 
//             src="https://www.youtube.com/embed/fMIiQwCIzGQ?si=d3gMisqGeOdMJyw1" 
//             title="YouTube video player" 
//             frameborder="0" 
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
//             </iframe> */}
          
//           </div>
//         </div>
//         {sentences}
//       </div>
//     );

//   }
// });

var StoryView = React.createClass({
  //React object state
  //
  //sentence: loaded flag and sentence data
  //story: loaded flag and story data
  //show_gloss: flag true if we show interlinear gloss lines
  getInitialState: function() {
    return {sentence: {data: [], loaded: false},
            story: {data: [], loaded: false},
            show_ipa: false,
            show_orthography: false,
            show_gloss: false,
            show_gloss_fr: false,
            story_view: false, 
            story_view_fr: true, // EDIT: added french toggle
            french_story: {data: [], loaded: false}
            };
  },
  //queue uploading of story and sentence data when this component is mounted
  componentDidMount: function() {
    story_data_promise.then(function(rawdata){
      this.setState({story:{data: rawdata.rows, loaded: true}});
    }.bind(this));

    sentence_data_promise.then(function(sentences){
      this.setState({sentence:{data: sentences, loaded: true}});
    }.bind(this));
  },
  //only ready to display story when story and sentence data have loaded
  loaded: function() {
    return this.state.story.loaded && this.state.sentence.loaded;
  },
  // Get the story object
  getStory: function() {
    var arr = this.state.story.data;
    for (var i = 0; i < arr.length; i++) {
      var o = arr[i];
      if (o.key == this.props.params.key) {
        return o.value;
      }
    }
    return {};
  },
  //return name of story by searching story data for this story's id
  getStoryName: function() {
    return _.get(this.getStory(), 'name', "<Unknown Story>");
  },
  getStoryName_fr: function() {
    return _.get(this.getStory(), 'name_fr', "<Unknown Story>");
  },
  //return author of story by searching story data for this story's id
  getStoryAuthor: function() {
    return _.get(this.getStory(), 'author', "");
  },
  //toggles interlinear gloss or not
  toggleGloss: function() {
    var new_show_gloss = !this.state.show_gloss;
    // var new_show_gloss_fr = this.state.show_gloss_fr;
    var new_story_view = this.state.story_view;
    if(new_show_gloss) {
      new_story_view = false;
      new_show_ipa = false;
    }
    this.setState({show_gloss: new_show_gloss,
                   show_ipa: new_show_ipa,
                   story_view: new_story_view});
  },
  toggleIPA: function() {
    var new_show_ipa = !this.state.show_ipa;
    var new_story_view = this.state.story_view;
    if (new_show_ipa) {
      new_story_view = false;
    }
    this.setState({show_ipa: new_show_ipa,
                  //   show_gloss: new_show_gloss,
                  //  show_gloss_fr: this.state.show_gloss_fr,
                   story_view: new_story_view});
  },
  showIPAToggle: function() {
    if (this.state.show_gloss) {
      return <div className="field">
        <div className="ui slider checkbox">
        <input type="radio" name="throughput" checked={this.state.show_ipa} onChange={this.toggleIPA}> </input>
        <label>Show IPA</label>
      </div>
    </div>
    }
    else {return;}
  },
  //toggles story view
  toggleStoryView: function() {
    var new_show_gloss = this.state.show_gloss;
    // var new_show_gloss_fr = this.state.show_gloss_fr;
    var new_story_view = !this.state.story_view;
    var new_french_view = this.state.french_view; // EDIT
    if(new_story_view) {
      new_show_gloss = false;
      // new_show_gloss_fr = false;
    }
    this.setState({show_gloss: new_show_gloss,
                  //  show_gloss_fr: new_show_gloss_fr,
                    story_view: new_story_view,
                    french_view: new_french_view}); // EDIT
  },
  //  TODO: embed video links from story index
  showVideo: function() {
    var link = _.get(this.getStory(), 'link', "");
    if (link != "") {
      return <iframe width="560" height="315" 
              src={link}
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
            </iframe>
    }
    else {return;}
  },
  //renders component
  render: function() {
    // If we haven't loaded yet, just render the dimmer.
    if (!this.loaded()) {
      return <div className="ui active dimmer">
        <div className="ui text loader">Loading</div>
      </div>;
    }
    // process sentence data to render alignment of morphemes/glosses and show one clause per line
    // lodash chaining: https://lodash.com/docs#_
    var sentences;
    var story_sentences = _(this.state.sentence.data).filter(
      // render sentences from this story
      function(x){
        return x.value.story == this.props.params.key;
      }.bind(this)
    );
    if (this.state.story_view) {
      var sentence_rows = story_sentences.map(
        function(x) {
            return [
              (
                <div key={x.key + "-1"} className="eight wide column"
                    style={{"padding": "0px"}}>
                  <Sentence sentence={x.value.sentence}
                            only_orthography="true" />
                </div>
              ),
              (
                <div key={x.key + "-2"} className="eight wide column"
                    style={{"padding": "0px"}}>
                  <Sentence sentence={x.value.sentence}
                            only_translation="true" />
                </div>
              )
            ];
        }.bind(this)
      ).value();
      
      sentences = (
        <div className='ui text container'
            style={{"padding-top": "14px"}}>
          <div className="ui grid">
            <div className="eight wide column"
                style={{"padding": "0px"}}>
                <h2>Atchan</h2>
            </div>
            <div className="eight wide column"
                style={{"padding": "0px"}}>
                <h2>English</h2>
            </div>
          {sentence_rows}
          </div>
        </div>
      );
      // }
    } else {
      sentences = story_sentences.map(
        // how to render a sentence
        function(x){
          return <Sentence key={x.key}
                    sentence={x.value.sentence}
                    show_gloss={this.state.show_gloss}
                    show_ipa={this.state.show_ipa}
                    show_french={false}/>;
                    // show_gloss_fr={this.state.show_gloss_fr}/>;
        }.bind(this)
      ).value();
    }

    return (
      <div>
        <h1>{this.getStoryName()}</h1> by {this.getStoryAuthor()} <div className="ui form">

          <div className="grouped fields">
            <label>View Options</label>

            <div className="field">
              <div className="ui slider checkbox">
                <input type="radio" name="throughput" checked={this.state.show_gloss} onChange={this.toggleGloss}> </input>
                <label>Show Glosses</label>
              </div>
            </div>

            {this.showIPAToggle()}

            <div className="field">
              <div className="ui slider checkbox">
                <input type="radio" name="throughput" checked={this.state.story_view} onChange={this.toggleStoryView}> </input>
                <label>Story View</label>
              </div>
            </div>

            {/* <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/fMIiQwCIzGQ?si=d3gMisqGeOdMJyw1" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
            </iframe> */}
            {this.showVideo()}
          
          </div>
        </div>
        {sentences}
      </div>
    );

  }
});

var StoryViewFR = React.createClass({
  //React object state
  //
  //sentence: loaded flag and sentence data
  //story: loaded flag and story data
  //show_gloss: flag true if we show interlinear gloss lines
  getInitialState: function() {
    return {sentence: {data: [], loaded: false},
            story: {data: [], loaded: false},
            show_gloss: false,
            show_gloss_fr: false,
            show_ipa: false,
            story_view: false, 
            french_view: true, // EDIT: added french toggle
            french_story: {data: [], loaded: false}
            };
  },
  //queue uploading of story and sentence data when this component is mounted
  componentDidMount: function() {
    story_data_promise.then(function(rawdata){
      this.setState({story:{data: rawdata.rows, loaded: true}});
    }.bind(this));

    sentence_data_promise.then(function(sentences){
      this.setState({sentence:{data: sentences, loaded: true}});
    }.bind(this));
  },
  //only ready to display story when story and sentence data have loaded
  loaded: function() {
    return this.state.story.loaded && this.state.sentence.loaded;
  },
  // Get the story object
  getStory: function() {
    var arr = this.state.story.data;
    for (var i = 0; i < arr.length; i++) {
      var o = arr[i];
      if (o.key == this.props.params.key) {
        return  o.value;
      }
    }
    return {};
  },
  //return name of story by searching story data for this story's id
  getStoryName: function() {
    if (this.state.french_view) {
      return _.get(this.getStory(), 'name_fr', "<Unknown Story>");
    }
    return _.get(this.getStory(), 'name', "<Unknown Story>");
  },
  //return author of story by searching story data for this story's id
  getStoryAuthor: function() {
    return _.get(this.getStory(), 'author', "");
  },
  // toggles IPA
  toggleIPA: function() {
    var new_show_ipa = !this.state.show_ipa;
    var new_story_view = this.state.story_view;
    if (new_show_ipa) {
      new_story_view = false;
    }
    this.setState({show_ipa: new_show_ipa,
                  //   show_gloss: new_show_gloss,
                  //  show_gloss_fr: this.state.show_gloss_fr,
                   story_view: new_story_view});
  },
  showIPAToggle: function() {
    if (this.state.show_gloss_fr) {
      return <div className="field">
        <div className="ui slider checkbox">
        <input type="radio" name="throughput" checked={this.state.show_ipa} onChange={this.toggleIPA}> </input>
        <label>Show IPA</label>
      </div>
    </div>
    }
    else {return;}
  },
  //toggles interlinear gloss or not
  toggleGloss: function() {
    var new_show_gloss_fr = !this.state.show_gloss_fr;
    // var new_show_gloss_fr = this.state.show_gloss_fr;
    var new_story_view = this.state.story_view;
    if (new_show_gloss_fr) {
      new_story_view = false;
      new_show_ipa = false;
    }
    this.setState({show_gloss_fr: new_show_gloss_fr,
                   show_ipa: new_show_ipa,
                  //  show_gloss_fr: this.state.show_gloss_fr,
                   story_view: new_story_view});
  },
  //toggles story view
  toggleStoryView: function() {
    // var new_show_gloss = this.state.show_gloss;
    var new_show_gloss_fr = this.state.show_gloss_fr;
    var new_story_view = !this.state.story_view;
    var new_french_view = this.state.french_view; // EDIT
    if(new_story_view) {
      // new_show_gloss = false;
      new_show_gloss_fr = false;
      // new_show_ipa = false;
    }
    this.setState({// show_gloss: new_show_gloss,
                    show_gloss_fr: new_show_gloss_fr,
                    // show_ipa: new_show_ipa,
                    story_view: new_story_view,
                    french_view: new_french_view}); // EDIT
  },
  showVideo: function() {
    var link = _.get(this.getStory(), 'link', "");
    if (link != "") {
      return <iframe width="560" height="315" 
              src={link}
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
            </iframe>
    }
    else {return;}
  },
  //renders component
  render: function() {
    // If we haven't loaded yet, just render the dimmer.
    if (!this.loaded()) {
      return <div className="ui active dimmer">
        <div className="ui text loader">Loading</div>
      </div>;
    }
    // process sentence data to render alignment of morphemes/glosses and show one clause per line
    // lodash chaining: https://lodash.com/docs#_
    var sentences;
    var story_sentences = _(this.state.sentence.data).filter(
      // render sentences from this story
      function(x){
        return x.value.story == this.props.params.key;
      }.bind(this)
    );
    if (this.state.story_view) {
      if (this.state.french_view) {
        language = 'French';
        var sentence_rows = story_sentences.map(
          function(x) {
              return [
                (
                  <div key={x.key + "-1"} className="eight wide column"
                        style={{"padding": "0px"}}>
                    <Sentence sentence={x.value.sentence}
                              only_orthography="true" />
                  </div>
                ),
                (
                  <div key={x.key + "-2"} className="eight wide column"
                        style={{"padding": "0px"}}>
                    <Sentence sentence={x.value.sentence}
                              only_french="true" />
                  </div>
                )
              ];
          }.bind(this)
        ).value();
      }
      sentences = (
        <div className='ui text container'
            style={{"padding-top": "14px"}}>
          <div className="ui grid">
            <div className="eight wide column"
                style={{"padding": "0px"}}>
                <h2>Atchan</h2>
            </div>
            <div className="eight wide column"
                style={{"padding": "0px"}}>
                <h2>French</h2>
            </div>
          {sentence_rows}
          </div>
        </div>
      );
      // }
    } else {
      sentences = story_sentences.map(
        // how to render a sentence
        function(x){
          return <Sentence key={x.key}
                    sentence={x.value.sentence}
                    show_gloss_fr={this.state.show_gloss_fr}
                    show_ipa={this.state.show_ipa}
                    show_french={true}/>;
        }.bind(this)
      ).value();
    }
    // render story content page with title and checkbox to toggle interlinear gloss display
    // if (self.state.french_view) {
    //   story_name = this.getStoryName_fr();
    // }
    // else {story_name = this.getStoryName();}
    return (
      <div>
        <h1>{this.getStoryName()}</h1> de {this.getStoryAuthor()} <div className="ui form">

          <div className="grouped fields">
            <label>View Options FR</label>

            <div className="field">
              <div className="ui slider checkbox">
                <input type="radio" name="throughput" checked={this.state.show_gloss_fr} onChange={this.toggleGloss}> </input>
                <label>Show Glosses FR</label>
              </div>
            </div>

            {this.showIPAToggle()}

            <div className="field">
              <div className="ui slider checkbox">
                <input type="radio" name="throughput" checked={this.state.story_view} onChange={this.toggleStoryView}> </input>
                <label>Story View FR</label>
              </div>
            </div>

            {this.showVideo()}
          
          </div>
        </div>
        {sentences}
      </div>
    );

  }
});

var Glosspage = React.createClass(
        
  {render: function() {
//=========================GLOSS PAGE===============================
  return   <div className='ui text container'> 

The abbreviations below are used for glossing in the Atchan texts and Atchan concordance.

      <h1 className='ui dividing header'>Abbreviations</h1>

        <div className='ui two column left aligned grid'>
          <div className='two wide column'>1sg</div>
          <div className='fourteen wide column'>1st person singular subject agreement</div>
          <div className='two wide column'>1du</div>
          <div className='fourteen wide column'>1st person dual inclusive subject agreement</div>
          <div className='two wide column'>1in</div>
          <div className='fourteen wide column'>1st person plural inclusive subject agreement</div>
          <div className='two wide column'>1ex</div>
          <div className='fourteen wide column'>1st person plural exclusive subject agreement</div>
          <div className='two wide column'>2sg</div>
          <div className='fourteen wide column'>2nd person singular subject agreement</div>
          <div className='two wide column'>2sg.inf</div>
          <div className='fourteen wide column'>Infinitive 2nd person singular subject agreement</div>
          <div className='two wide column'>2pl</div>
          <div className='fourteen wide column'>2nd person plural subject agreement</div>
          <div className='two wide column'>3sg.inf</div>
          <div className='fourteen wide column'>Infinitive 3rd person singular subject agreement</div>
          <div className='two wide column'>acc</div>
          <div className='fourteen wide column'>Accusative case</div>
          <div className='two wide column'>ap</div>
          <div className='fourteen wide column'>Antipassive</div>
          <div className='two wide column'>appl</div>
          <div className='fourteen wide column'>Applicative</div>
          <div className='two wide column'>assoc.pl</div>
          <div className='fourteen wide column'>Associative plural</div>
          <div className='two wide column'>be.rt</div>
          <div className='fourteen wide column'>Predicative copula</div>
          <div className='two wide column'>be.loc</div>
          <div className='fourteen wide column'>Locative copula</div>
          <div className='two wide column'>be.1d</div>
          <div className='fourteen wide column'>Deictic copula: be here</div>
          <div className='two wide column'>be.2d</div>
          <div className='fourteen wide column'>Deictic copula: be there</div>
          <div className='two wide column'>be.3d</div>
          <div className='fourteen wide column'>Deictic copula: be yonder</div>
          <div className='two wide column'>be.eq</div>
          <div className='fourteen wide column'>Equative copula</div>
          <div className='two wide column'>appl</div>
          <div className='fourteen wide column'>Applicative</div>
          <div className='two wide column'>caus</div>
          <div className='fourteen wide column'>Causative</div>
          <div className='two wide column'>clg</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class g (sg/pl)</div>
          <div className='two wide column'>cll</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class l (sg/pl)</div>
          <div className='two wide column'>cly</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class n (pl)</div>
          <div className='two wide column'>clŋ</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class ŋ (sg/pl)</div>
          <div className='two wide column'>clɲ</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class ɲ (pl)</div>
          <div className='two wide column'>clr</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class r (pl)</div>
          <div className='two wide column'>clð</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class ð (sg)</div>
          <div className='two wide column'>clð.nom</div>
          <div className='fourteen wide column'>Nominalization prefix: class ð</div>
          <div className='two wide column'>cly</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class y (sg/pl)</div>
          <div className='two wide column'>cmp</div>
          <div className='fourteen wide column'>Comparative</div>
          <div className='two wide column'>comp1</div>
          <div className='fourteen wide column'>Finite complementizer</div>
          <div className='two wide column'>comp1b</div>
          <div className='fourteen wide column'>Consecutive imperfective complementizer</div>
          <div className='two wide column'>comp2</div>
          <div className='fourteen wide column'>Infinitive and consecutive perfective complementizer</div>
          <div className='two wide column'>cmp</div>
          <div className='fourteen wide column'>Comparative</div>
          <div className='two wide column'>d.ipfv</div>
          <div className='fourteen wide column'>Distal imperfective</div>
          <div className='two wide column'>d.inf1</div>
          <div className='fourteen wide column'>Distal infinitive 1</div>
          <div className='two wide column'>d.inf2</div>
          <div className='fourteen wide column'>Distal infinitive 2</div>
          <div className='two wide column'>d.imp</div>
          <div className='fourteen wide column'>Distal imperative</div>
          <div className='two wide column'>dpc</div>
          <div className='fourteen wide column'>Finite dependent clause vowel</div>
          <div className='two wide column'>foc</div>
          <div className='fourteen wide column'>Focus cleft</div>
          <div className='two wide column'>fut.aux</div>
          <div className='fourteen wide column'>Future auxiliary</div>
          <div className='two wide column'>imp</div>
          <div className='fourteen wide column'>Imperative</div>
          <div className='two wide column'>indef</div>
          <div className='fourteen wide column'>Indefinite</div>
          <div className='two wide column'>inf1</div>
          <div className='fourteen wide column'>Infinitive 1</div>
          <div className='two wide column'>inf2</div>
          <div className='fourteen wide column'>Infinitive 2</div>
          <div className='two wide column'>inst</div>
          <div className='fourteen wide column'>Instrumental clitic</div>
          <div className='two wide column'>ipfv</div>
          <div className='fourteen wide column'>Imperfective</div>
          <div className='two wide column'>iter</div>
          <div className='fourteen wide column'>Iterative/durative aspect</div>
          <div className='two wide column'>juss</div>
          <div className='fourteen wide column'>Jussive</div>
          <div className='two wide column'>loc</div>
          <div className='fourteen wide column'>Locative</div>
          <div className='two wide column'>loc.appl</div>
          <div className='fourteen wide column'>Locative applicative</div>
          <div className='two wide column'>not.aux</div>
          <div className='fourteen wide column'>Negative auxiliary</div>
          <div className='two wide column'>om</div>
          <div className='fourteen wide column'>Object marker (object pronouns)</div>
          <div className='two wide column'>pass</div>
          <div className='fourteen wide column'>Passive</div>
          <div className='two wide column'>past.aux</div>
          <div className='fourteen wide column'>Past tense auxiliary</div>
          <div className='two wide column'>pfv</div>
          <div className='fourteen wide column'>Perfective</div>
          <div className='two wide column'>plz</div>
          <div className='fourteen wide column'>Politeness marker</div>
          <div className='two wide column'>poss</div>
          <div className='fourteen wide column'>Possessive/genitive</div>
          <div className='two wide column'>pro</div>
          <div className='fourteen wide column'>Pronoun</div>
          <div className='two wide column'>prog</div>
          <div className='fourteen wide column'>Progressive</div>
          <div className='two wide column'>prog.aux</div>
          <div className='fourteen wide column'>Progressive auxiliary</div>
          <div className='two wide column'>rtc</div>
          <div className='fourteen wide column'>Finite root clause vowel</div>
          <div className='two wide column'>sclg</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class g (sg/pl)</div>
          <div className='two wide column'>scll</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class l (sg/pl)</div>
          <div className='two wide column'>scly</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class n (pl)</div>
          <div className='two wide column'>sclŋ</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class ŋ (sg/pl)</div>
          <div className='two wide column'>sclɲ</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class ɲ (pl)</div>
          <div className='two wide column'>sclr</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class r (pl)</div>
          <div className='two wide column'>sclð</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class ð (sg)</div>
          <div className='two wide column'>scly</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class y (sg/pl)</div>
          <div className='two wide column'>way</div>
          <div className='fourteen wide column'>Manner clitic suffix</div>
          <div className='two wide column'>ynq</div>
          <div className='fourteen wide column'>Yes/no question marker</div>
        </div>
    </div>
  }
  }
)

var GlosspageFR = React.createClass(
        
  {render: function() {
//=========================GLOSS PAGE===============================
  return   <div className='ui text container'> 

The abbreviations below are used for glossing in the Atchan texts and Atchan concordance.

      <h1 className='ui dividing header'>Abbreviations</h1>

        <div className='ui two column left aligned grid'>
          <div className='two wide column'>1sg</div>
          <div className='fourteen wide column'>1st person singular subject agreement</div>
          <div className='two wide column'>1du</div>
          <div className='fourteen wide column'>1st person dual inclusive subject agreement</div>
          <div className='two wide column'>1in</div>
          <div className='fourteen wide column'>1st person plural inclusive subject agreement</div>
          <div className='two wide column'>1ex</div>
          <div className='fourteen wide column'>1st person plural exclusive subject agreement</div>
          <div className='two wide column'>2sg</div>
          <div className='fourteen wide column'>2nd person singular subject agreement</div>
          <div className='two wide column'>2sg.inf</div>
          <div className='fourteen wide column'>Infinitive 2nd person singular subject agreement</div>
          <div className='two wide column'>2pl</div>
          <div className='fourteen wide column'>2nd person plural subject agreement</div>
          <div className='two wide column'>3sg.inf</div>
          <div className='fourteen wide column'>Infinitive 3rd person singular subject agreement</div>
          <div className='two wide column'>acc</div>
          <div className='fourteen wide column'>Accusative case</div>
          <div className='two wide column'>ap</div>
          <div className='fourteen wide column'>Antipassive</div>
          <div className='two wide column'>appl</div>
          <div className='fourteen wide column'>Applicative</div>
          <div className='two wide column'>assoc.pl</div>
          <div className='fourteen wide column'>Associative plural</div>
          <div className='two wide column'>be.rt</div>
          <div className='fourteen wide column'>Predicative copula</div>
          <div className='two wide column'>be.loc</div>
          <div className='fourteen wide column'>Locative copula</div>
          <div className='two wide column'>be.1d</div>
          <div className='fourteen wide column'>Deictic copula: be here</div>
          <div className='two wide column'>be.2d</div>
          <div className='fourteen wide column'>Deictic copula: be there</div>
          <div className='two wide column'>be.3d</div>
          <div className='fourteen wide column'>Deictic copula: be yonder</div>
          <div className='two wide column'>be.eq</div>
          <div className='fourteen wide column'>Equative copula</div>
          <div className='two wide column'>appl</div>
          <div className='fourteen wide column'>Applicative</div>
          <div className='two wide column'>caus</div>
          <div className='fourteen wide column'>Causative</div>
          <div className='two wide column'>clg</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class g (sg/pl)</div>
          <div className='two wide column'>cll</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class l (sg/pl)</div>
          <div className='two wide column'>cly</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class n (pl)</div>
          <div className='two wide column'>clŋ</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class ŋ (sg/pl)</div>
          <div className='two wide column'>clɲ</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class ɲ (pl)</div>
          <div className='two wide column'>clr</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class r (pl)</div>
          <div className='two wide column'>clð</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class ð (sg)</div>
          <div className='two wide column'>clð.nom</div>
          <div className='fourteen wide column'>Nominalization prefix: class ð</div>
          <div className='two wide column'>cly</div>
          <div className='fourteen wide column'>Noun class agreement/concord: class y (sg/pl)</div>
          <div className='two wide column'>cmp</div>
          <div className='fourteen wide column'>Comparative</div>
          <div className='two wide column'>comp1</div>
          <div className='fourteen wide column'>Finite complementizer</div>
          <div className='two wide column'>comp1b</div>
          <div className='fourteen wide column'>Consecutive imperfective complementizer</div>
          <div className='two wide column'>comp2</div>
          <div className='fourteen wide column'>Infinitive and consecutive perfective complementizer</div>
          <div className='two wide column'>cmp</div>
          <div className='fourteen wide column'>Comparative</div>
          <div className='two wide column'>d.ipfv</div>
          <div className='fourteen wide column'>Distal imperfective</div>
          <div className='two wide column'>d.inf1</div>
          <div className='fourteen wide column'>Distal infinitive 1</div>
          <div className='two wide column'>d.inf2</div>
          <div className='fourteen wide column'>Distal infinitive 2</div>
          <div className='two wide column'>d.imp</div>
          <div className='fourteen wide column'>Distal imperative</div>
          <div className='two wide column'>dpc</div>
          <div className='fourteen wide column'>Finite dependent clause vowel</div>
          <div className='two wide column'>foc</div>
          <div className='fourteen wide column'>Focus cleft</div>
          <div className='two wide column'>fut.aux</div>
          <div className='fourteen wide column'>Future auxiliary</div>
          <div className='two wide column'>imp</div>
          <div className='fourteen wide column'>Imperative</div>
          <div className='two wide column'>indef</div>
          <div className='fourteen wide column'>Indefinite</div>
          <div className='two wide column'>inf1</div>
          <div className='fourteen wide column'>Infinitive 1</div>
          <div className='two wide column'>inf2</div>
          <div className='fourteen wide column'>Infinitive 2</div>
          <div className='two wide column'>inst</div>
          <div className='fourteen wide column'>Instrumental clitic</div>
          <div className='two wide column'>ipfv</div>
          <div className='fourteen wide column'>Imperfective</div>
          <div className='two wide column'>iter</div>
          <div className='fourteen wide column'>Iterative/durative aspect</div>
          <div className='two wide column'>juss</div>
          <div className='fourteen wide column'>Jussive</div>
          <div className='two wide column'>loc</div>
          <div className='fourteen wide column'>Locative</div>
          <div className='two wide column'>loc.appl</div>
          <div className='fourteen wide column'>Locative applicative</div>
          <div className='two wide column'>not.aux</div>
          <div className='fourteen wide column'>Negative auxiliary</div>
          <div className='two wide column'>om</div>
          <div className='fourteen wide column'>Object marker (object pronouns)</div>
          <div className='two wide column'>pass</div>
          <div className='fourteen wide column'>Passive</div>
          <div className='two wide column'>past.aux</div>
          <div className='fourteen wide column'>Past tense auxiliary</div>
          <div className='two wide column'>pfv</div>
          <div className='fourteen wide column'>Perfective</div>
          <div className='two wide column'>plz</div>
          <div className='fourteen wide column'>Politeness marker</div>
          <div className='two wide column'>poss</div>
          <div className='fourteen wide column'>Possessive/genitive</div>
          <div className='two wide column'>pro</div>
          <div className='fourteen wide column'>Pronoun</div>
          <div className='two wide column'>prog</div>
          <div className='fourteen wide column'>Progressive</div>
          <div className='two wide column'>prog.aux</div>
          <div className='fourteen wide column'>Progressive auxiliary</div>
          <div className='two wide column'>rtc</div>
          <div className='fourteen wide column'>Finite root clause vowel</div>
          <div className='two wide column'>sclg</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class g (sg/pl)</div>
          <div className='two wide column'>scll</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class l (sg/pl)</div>
          <div className='two wide column'>scly</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class n (pl)</div>
          <div className='two wide column'>sclŋ</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class ŋ (sg/pl)</div>
          <div className='two wide column'>sclɲ</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class ɲ (pl)</div>
          <div className='two wide column'>sclr</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class r (pl)</div>
          <div className='two wide column'>sclð</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class ð (sg)</div>
          <div className='two wide column'>scly</div>
          <div className='fourteen wide column'>Strong (definite) noun class concord: class y (sg/pl)</div>
          <div className='two wide column'>way</div>
          <div className='fourteen wide column'>Manner clitic suffix</div>
          <div className='two wide column'>ynq</div>
          <div className='fourteen wide column'>Yes/no question marker</div>
        </div>
    </div>
  }
  }
)

//===========================================Dictionary Code===========================================

//get id of all occurrences of the morpheme and definition pair from the global_id_to_morpheme_definition
function get_occurrence_ids(morpheme_click, definition_click) {
  var results = [];
  for (var i = 0; i < global_id_to_morpheme_definition.length; i++) {

      var morpheme_definition_pair = global_id_to_morpheme_definition[i]["morpheme_definition"];
          
      var match_found = false;
      for (var j = 0; j < morpheme_definition_pair.length; j++) {
          if (morpheme_definition_pair[j]["moroword"] == morpheme_click && morpheme_definition_pair[j]["definition"] == definition_click) {
              match_found = true;
              break;
          }
      }
      if (match_found) {
          results = results.concat (global_id_to_morpheme_definition[i]["id"]);
      //{sentence_id:dirtydata.rows[i].id, utterance_match:sentence.utterance, morphemes_match:sentence.morphemes, gloss_match:sentence.gloss, translation_match:sentence.translation});
      }
      
  }
  //console.log(results);
  return results;
}

function get_rows(list_of_id) {
  var results = [];
  for (var i = 0; i<list_of_id.length; i++) {
    results.push(global_id_to_row[list_of_id[i]])
  }
  return results
}


//Segments a word into morphemes with glosses; morphemes from 'word' argument, glosses from 'glossword' argument
function processword(word, glossword) {
  if (!word || !glossword) {
    return [[], []]
  }
  var results = [];
  var click_database_result = [];
  var morphemes = word.split('-');
  var glosses = glossword.split('-');
  //if there is not the same number of dashes we aren't aligning the correct morphemes and gloss
  if (morphemes.length!=glosses.length) {
    return [[], []];
  }
  var rootindex = -1;
  //identify verb roots so we can distinguish prefixes from suffixes
  for (var i = 0; i < glosses.length; i++) {
    var gloss = glosses[i];
    //all verb root morphemes end with .rt or .aux
    //TODO: does this include be.loc, be.1d, be.2d, etc? @HSande for details
    if (_.startsWith(gloss, 'be.') || _.endsWith(gloss, '.rt') || _.endsWith(gloss, '.aux')) {
      rootindex = i;
    }
  }
  //iterate over morphemes; if there is a verb root, add pre-dashes to suffixes and post-dashes to prefixes: 
  //example: g-a-s-o; clg-rtc-eat.rt-pfv = [g-, a-, s, -o]; [clg-, rtc-, eat.rt, -pfv]
  for (var i = 0; i < glosses.length; i++) {
    var gloss = removePunc(glosses[i].toLowerCase());
    // Remove punctuation, make lower case, and replace all "Latin Letter
    // Small Schwa" characters with "Latin Letter Smal E" characters, so
    // there is just one schwa character in the corpus. 
    var morpheme =
      removePunc(morphemes[i].toLowerCase().replace(/\u0259/g,'\u01DD'))
    
    if (gloss.match(/^[0-9]*$/)){
      continue
    }
    if (rootindex==-1) {
      results.push({moroword:[{word:morpheme, count:1}], definition:gloss});
      click_database_result.push({moroword:morpheme, definition:gloss});
    } else {
      if (i < rootindex) { 
        gloss = gloss+'-';
        morpheme = morpheme+'-';
        results.push({moroword:[{word:morpheme, count:1}], definition:gloss});
        click_database_result.push({moroword:morpheme, definition:gloss});
      } else if (i > rootindex) {
        gloss = '-'+gloss;
        morpheme = '-'+morpheme;
        results.push({moroword:[{word:morpheme, count:1}], definition:gloss});
        click_database_result.push({moroword:morpheme, definition:gloss});
      } else {
        results.push({moroword:[{word:morpheme, count:1}], definition:gloss});
        click_database_result.push({moroword:morpheme, definition:gloss});
      }
    }
  }
  return [results, click_database_result];
}

//merge two arrays and de-duplicate items
function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i]["word"] === a[j]["word"]) {
              a.splice(j--, 1);
              a[i]["count"] += 1 
          }
      }
  }

  return a;
}

//remove duplicate items for click morpheme_definition_pair_list
function arrayUniqueClick(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i]["moroword"] === a[j]["moroword"] && a[i]["definition"] === a[j]["definition"]) {
              a.splice(j--, 1);
          }
      }
  }

  return a;
}

//Remove punctuation from string excluding dashes and period in word
function removePunc(word) {
  var rtnWord = word.replace(/[,\/#?!\"\“\”$%\^&\*;:{}=_`~()]/g,"");
  rtnWord = rtnWord.replace(/\b[.]+\B|\B[.]+\b/g, "");
  return rtnWord;
}

//Process dict with count to sorted dict without count value
function sortAndRemoveCount(dict) {
  var toRtn = JSON.parse(JSON.stringify(dict));
  for(var i=0; i<toRtn.length; ++i) {
      toRtn[i]["moroword"].sort(function(a, b) {
          return parseFloat(b["count"]) - parseFloat(a["count"]);
      });
      var moroWordsArray = []
      for (var j=0; j<toRtn[i]["moroword"].length; ++j) {
          delete toRtn[i]["moroword"][j]["count"]
          var word = toRtn[i]["moroword"][j]["word"]
          moroWordsArray.push(word)
      }
      toRtn[i]["moroword"] = moroWordsArray
  }
  return toRtn
}

function processdata(dirtydata){
  var results = [];
  for (var i = 0; i < dirtydata.rows.length; i++) {
      // split on spaces and remove punctuation from morphemes line
      var sentence = dirtydata.rows[i].value.sentence; 
      var presplit_morphemes = sentence.morphemes.replace(/[",.?!'()]/g, '');
      var morphemes = presplit_morphemes.split(/[ ][ ]*/);
      var gloss = sentence.gloss.split(/[ ][ ]*/);
      
      var morpheme_definition_pair_list = []; //store morpheme definition pair of a sentence

      if (gloss.length = morphemes.length) {
          //process all morphemes and words
          for (var ii = 0; ii < gloss.length; ii++) {
              var morpheme = morphemes[ii]; 
              var glossword = gloss[ii];
              var temp = processword(morpheme, glossword);
              var wordresults = temp[0];
              var click_database_results = temp[1];
              var startIndex = 0;

              morpheme_definition_pair_list = morpheme_definition_pair_list.concat(click_database_results); //add in the morpheme definition pair

              if (results.length == 0) {
                  results = results.concat(wordresults[startIndex]);
                  startIndex += 1;
              }
              for (var k = startIndex; k < wordresults.length; k++) {
                  var existed = false;
                  for (var j = 0; j < results.length; j++) {
                      if (wordresults[k]["definition"] == results[j]["definition"]) {
                          existed = true;
                          oldMoroword = results[j]["moroword"];
                          newMoroword = arrayUnique(oldMoroword.concat(wordresults[k]["moroword"]));
                          results[j]["moroword"] = newMoroword;
                          break;
                      }       
                  }
                  if (!existed) {
                      results = results.concat(wordresults[k]);
                  }
              }
          }
          //remove duplicate pair 
          morpheme_definition_pair_list = arrayUniqueClick(morpheme_definition_pair_list);
          //add the morpheme definition pair list for each sentence into the global variable
          global_id_to_morpheme_definition.push({id:dirtydata.rows[i].id, morpheme_definition:morpheme_definition_pair_list});
          global_id_to_row[dirtydata.rows[i].id] = dirtydata.rows[i];
      }
  }
//Print out result dict
//console.log(JSON.stringify(results))
//console.log(JSON.stringify(global_id_to_morpheme_definition))
processedDict = sortAndRemoveCount(results)
//console.log("DONE")
//return morphemes/glosses by moro morphemes
return _.sortBy(processedDict, function(j) {
var moroword = _.cloneDeep(j.moroword);
return _.map(moroword, function(x) {
  if (x[0] == '-') {
    return x.slice(1);
  }
  return x;
});
})
}

// This is a test for processing code
function assert(expected_value, actual) {
  if (!_.isEqual(expected_value, actual)){
    console.error('assertion failed');
    console.error(expected_value);
    console.error(JSON.stringify(expected_value));
    console.error(actual);
    console.error(JSON.stringify(actual));

  }
}

function test_processdata() {
  var testcase1 = {rows:[{value:{sentence:{morphemes:'a', gloss:'A'}}}]};
  assert([{moroword:['a'], definition:'a'}], processdata(testcase1));
  var testcase2 = {rows:[{value:{sentence: {morphemes:'a-b d', gloss:'A-B A'}}}]};
  assert([{moroword:['a','d'], definition:'a'}, {moroword:['b'], definition:'b'}], processdata(testcase2));
  var testcase3 = {rows:[{value:{sentence:{morphemes:'"loman-nǝŋ maj-anda l-a-fo,', gloss:'day-indef man-assoc.pl cll-rtc-past.aux'}}}]};
  assert([{moroword:['a-'], definition:'rtc-'},
          {moroword:['anda'], definition:'assoc.pl'},
          {moroword:['fo'], definition:'past.aux'},
          {moroword:['l-'], definition:'cll-'},
          {moroword:['loman'], definition:'day'}, 
          {moroword:['maj'], definition:'man'},
          {moroword:['nǝŋ'], definition:'indef'},
            ], processdata(testcase3));
  var testcase4 = {rows:[{value:{sentence:{morphemes:'"a,!?..', gloss:'A'}}}]};
  assert([{moroword:['a'], definition:'a'}], processdata(testcase4));
  var testcase5 = {rows:[{value:{sentence:{morphemes:'b-a c', gloss:'B-A C'}}}]};
  assert([{moroword:['a'], definition:'a'}, {moroword:['b'], definition:'b'}, {moroword:['c'], definition:'c'}], processdata(testcase5));
  } 
//test_processdata();

// promise that resolves when sentence data is loaded and processed into morpheme dictionary
var dictionary_data_promise = sentence_data_promise.then(function(data) {
  return processdata({rows: data}); 
});

//Dictionary viewing code
//ReactClass for rendering a definition
var Definition = React.createClass({
  render: function() {
    var morph_def_pairs = _.map(this.props.moroword, function(morpheme) {
      return {
        morpheme: morpheme,
        definition: this.props.definition
      }
    }.bind(this));

    var rendered_morphemes = _.map(morph_def_pairs, function(pair, i) {
      var comma = ', ';
      if (i == 0) {
        comma = '';
      }
      var url = ('#/dict/concordance/' + pair.morpheme + '/' +
                  pair.definition + '?' + CurrentMetaURI().query());
      return <span key={pair.morpheme}>
        {comma}
        <a href={url}>
          {pair.morpheme}
        </a>
      </span>;
    })

    return (
      <div className="ui vertical segment">
        <h2>
          {rendered_morphemes}
        </h2>
        {this.props.definition}
      </div>
    );
  }
});
// ReactClass for rendering many definitions
var DictList = React.createClass({
  render: function() {
    var definitions=this.props.data.map(function(def) {
      return ( <Definition key={def['moroword'] + ':' + def.definition}
                            moroword={def['moroword']}
                            definition={def['definition']}/> )
    });

    return (
      <div>
        {definitions}
      </div>
    );
  }
});


//SEARCH CODE

//matchSearchFunc for definition to searchTerm (EngPlain)
function matchSearchFuncEngPlain (searchTerm) {
  return function(element) {
    if (element.definition == searchTerm) {
      return true;
    } else {
      return false;
    }
  }
}

//matchSearchFunc for definition to searchTerm (EngRegex)
function matchSearchFuncEngRegex (searchTerm) {
  return function(element) {
    var re = ".*" + searchTerm + ".*";
    if (element.definition.match(re)) {
      return true;
    } else {
      return false;
    }
  }
}

//matchSearchFunc for moroword to searchTerm (MoroPlain)
function matchSearchFuncMoroPlain (searchTerm) {
  return function(element) {
    return findMoroWordInArrayMoroPlain(element.moroword, searchTerm)
  }
}

//matchSearchFunc healper for moroword to searchTerm (without regrex)
function findMoroWordInArrayMoroPlain (categories, moroword) {
  var found = false;
  for (i = 0; i < categories.length && !found; i++) {
    if (categories[i] === moroword) {
      found = true;
    }
  }
  return found
}

//matchSearchFunc for moroword to searchTerm (MoroRegex)
function matchSearchFuncMoroRegex (searchTerm) {
  return function(element) {
    return findMoroWordInArrayMoroRegex(element.moroword, searchTerm)
  }
}

//matchSearchFunc healper for moroword to searchTerm (with regrex)
function findMoroWordInArrayMoroRegex (categories, moroword) {
  var found = false;
  for (i = 0; i < categories.length && !found; i++) {
    // if (categories[i] === moroword) {
    var re = ".*" + moroword + ".*";
    if (categories[i].match(re)) {
      found = true;
    }
  }
  return found
}


// React container for rendering 1 page of dictionary entries, with a
// header and footer for page navigation.
var DictPage = React.createClass({
  render: function() {

    if (firstLoad == true) {
      global_whole_data = this.props.data;
      firstLoad = false;
    }

    var data = this.props.data;
    var search = this.props.search;
    if (search == "") {
      data = global_whole_data;
    } else {
      var filter;

      if (this.props.search_language == 'eng') {
        if(this.props.regex) {
          filter = matchSearchFuncEngRegex;
        } else {
          filter = matchSearchFuncEngPlain;
        }
      } else {
        if(this.props.regex) {
          filter = matchSearchFuncMoroRegex;
        } else {
          filter = matchSearchFuncMoroPlain;
        }
      }

      data = data.filter(filter(search));
    }


    // TODO: We might have to compute the alphabet on-demand here, since
    // our skips are going to be wrong.

    var skip = this.props.skip;
    var pagesize = this.props.limit;
    var length = data.length;

    if (length == 0) {
      return <div> No Results Found </div>
    } else {

      pc = GetPaginationControls(skip, length, pagesize);
      return <div>
        {pc.page_controls}
        <DictList data={_(data).drop(pc.skip).take(pagesize).value()} />
        {pc.page_controls}
      </div>
    }
  }
});

// React container that will show a loading dimmer until the dictionary data is available; then renders definitions
var DictBox = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loaded: false,
    };
  },
  clearSkip : function() {
    UpdateQuery({'skip': 0});
  },
  componentDidMount: function() {
    dictionary_data_promise.then(function(dictdata) {

      // Find the first index of each letter, grouping numbers.
      var alphabet = {}
      _.forEach(dictdata, function consider_word(word, index) {
        var c = _.get(word, ["moroword", 0, 0], "");
        if (c == "-") {
          c = _.get(word, ["moroword", 0, 1], "");
        }
        c = "" + c;
        if (c.match(/[0-9]/)) {
          c = '0-9';
        }
        if (c) {
          if (alphabet[c] == undefined) {
            alphabet[c] = index;
          }
        }
      });

      this.setState(
      {
        data: dictdata,
        alphabet: alphabet,
        loaded: true
      },
      function() {
        $(this.refs.right_half.getDOMNode()).sticky({});
      }.bind(this));
    }.bind(this));
  },
  render: function() {
    if (this.state.loaded) {
      var alphabet = this.state.alphabet;
      var alphabet_buttons = _.map(_.toPairs(alphabet), function(pair) {
        var letter = pair[0];
        var skip = pair[1];
        return <UrlParameterButton key={letter}
                  update={{
                    search: '',
                    skip: skip
                  }}
                  custom_style={{
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  }}>
            {letter}
          </UrlParameterButton>;
      });

      var data = this.state.data;
      return (
        <div className='ui text container'>
          <div className="ui grid">
            <div className="sixteen wide column">
              <h1>
              Concordance:
              </h1>

              <div className="ui grid">
                <div className="sixteen wide column">
                    <SearchBox renderParameters={true}
                                onGo={this.clearSkip}/>
                </div>
                <div className="sixteen wide column">
                    <div className="ui buttons" style={{marginBottom: "5px"}}>
                    {alphabet_buttons}
                    </div>
                </div>
              </div>

            </div>
            <div className="eight wide column">
              <UrlParameterExtractor defaults={{skip: 0,
                                                limit: 50,
                                                search: '',
                                                regex: false,
                                                search_language: 'moro'}}>
                <DictPage data={data} />
              </UrlParameterExtractor>
            </div>
            <div className="eight wide column">
              <div ref='right_half' className="ui sticky">
                <RouteHandler data={data}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="ui active dimmer">
          <div className="ui text loader">Loading</div>
      </div>
  }
});

// Dictionary view with concordance.
var ConcordanceView = React.createClass({
  render: function() {
    var morpheme = this.props.params.morpheme 
    var definition = this.props.params.definition
    var list_of_occurrence = get_occurrence_ids(morpheme, definition);
    var list_of_four_sentences = get_rows(list_of_occurrence)
    var sentences = _.map(list_of_four_sentences, function(x) {
      return <Sentence key={x.key} sentence={x.value.sentence} show_gloss={true} />
    });
    return <div className="ui segment">
      Definition for: {this.props.params.morpheme} is {this.props.params.definition}
      <br/>
      Occurred at:<br/>
      {sentences}
    </div>
  }
});

var DictView = React.createClass({
  render: function() {
    return <div> </div>
  }
});

//===================================================Text Page==================================
// React Class that renders list of stories with links to story content pages (w/loading dimmer)
var TextBox = React.createClass({
  getInitialState: function() {
    return {data: [], loaded: false};
  },
  componentDidMount: function() {
    story_data_promise.then(function(rawdata){
      this.setState({data: rawdata, loaded: true});
    }.bind(this))
  },
  render: function() {
    if (this.state.loaded){
      var results = this.state.data.rows.map(function (x) {
        return <li key={x.key}><Link to='Story' params={{key: x.key}}>{x.value.name}</Link> by {x.value.author}</li>

      });
      return <div><ul>{results}</ul></div>;
    }
    else {
      return <div className="ui active dimmer">
            <div className="ui text loader">Loading</div>
            </div>
    }
  }
});

// TODO: could potentially be the same class as textbox above with variables based on global_show_french
var TextBoxFR = React.createClass({
  getInitialState: function() {
    return {data: [], loaded: false};
  },
  componentDidMount: function() {
    story_data_promise.then(function(rawdata){
      this.setState({data: rawdata, loaded: true});
    }.bind(this))
  },
  render: function() {
    if (this.state.loaded){
      var results = this.state.data.rows.map(function (x) {
        return <li key={x.key}><Link to='StoryFR' params={{key: x.key}}>{x.value.name_fr}</Link> de {x.value.author}</li>

      });
      return <div><ul>{results}</ul></div>;
    }
    else {
      return <div className="ui active dimmer">
            <div className="ui text loader">Loading</div>
            </div>
    }
  }
});

// A component to render a single sentence.
var Sentence = React.createClass({
  render: function() {
    var gloss = '';
    var gloss_fr = '';
    // var ipa = '';
    var orthography = '';
    // var show_french = false;
    // var show_ipa = true;
    var lang_display;
    var sentence = this.props.sentence;

    if (!(this.props.show_gloss || this.props.show_gloss_fr)) {
      orthography = <b>{sentence.orthography}</b>;
    }

    if (this.props.only_orthography) {
      return <div style={{marginBottom: "10px"}}>
        {sentence.orthography}
      </div>;
    }

    if (this.props.only_translation) {
      return <div style={{marginBottom: "10px"}}>
        {sentence.translation}
      </div>;
    }

    if (this.props.only_french) {
      return <div style={{marginBottom: "10px"}}>
        {sentence.french}
      </div>;
    }

    // if (this.props.show_ipa) {
    //   ipa =  <div style={{marginBottom: "10px"}}>
    //     {sentence.morphemes}
    //   </div>;
    // }

    if (this.props.show_french) {
      lang_display = <span>{sentence.french}<br/></span>
    }
    else {lang_display = <span>{sentence.translation}<br/></span>}
    
    // interlinear gloss alignment
    if (this.props.show_gloss) {
      // var morphemes = sentence.morphemes.split(' ');
      // var glosses = sentence.gloss.split(' ');
      // var pairs = _.zip(morphemes, glosses);
      // // render one inline block div containing morpheme and gloss per word
      // var glosses = _(pairs).map(function(x, i){
      //   var morpheme = x[0];
      //   var gloss = x[1];
      //   // return <div style={{display: "inline-block", marginRight: "5px"}} key={i}>{morpheme}<br/>{gloss}</div>
      //   return <div style={{display: "inline-block", marginRight: "5px"}} key={i}>{gloss}</div>
      // }.bind(this)).value();
      // gloss = <span>{glosses}<br/></span>;
      if (this.props.show_ipa) {
        var morphemes = sentence.morphemes.split(' ');
        var glosses = sentence.gloss.split(' ');
        var pairs = _.zip(morphemes, glosses);
      }
      else {
        var orthography = sentence.orthography.split(' ');
        var glosses = sentence.gloss.split(' ');
        var pairs = _.zip(orthography, glosses);
      }
      
      // var pairs = _.zip(orthography, glosses);
      // render one inline block div containing morpheme and gloss per word
      var glosses = _(pairs).map(function(x, i){
        var morpheme = x[0];
        var gloss = x[1];
        // return <div style={{display: "inline-block", marginRight: "5px"}} key={i}>{morpheme}<br/>{gloss_fr}</div>
        return <div style={{display: "inline-block", marginRight: "5px"}} key={i}><b>{morpheme}</b><br/>{gloss}</div>
      }.bind(this)).value();
      gloss = <span>{glosses}<br/></span>;
    }

    if (this.props.show_gloss_fr) {
      // var morphemes = sentence.morphemes.split(' ');
      // var glosses_fr = sentence.gloss_fr.split(' ');
      // var pairs = _.zip(morphemes, glosses_fr);
      // // render one inline block div containing morpheme and gloss per word
      // var glosses_fr = _(pairs).map(function(x, i){
      //   var morpheme = x[0];
      //   var gloss_fr = x[1];
      //   // return <div style={{display: "inline-block", marginRight: "5px"}} key={i}>{morpheme}<br/>{gloss_fr}</div>
      //   return <div style={{display: "inline-block", marginRight: "5px"}} key={i}>{gloss_fr}</div>
      // }.bind(this)).value();
      // gloss_fr = <span>{glosses_fr}<br/></span>;

      if (this.props.show_ipa) {
        var morphemes = sentence.morphemes.split(' ');
        var glosses_fr = sentence.gloss_fr.split(' ');
        var pairs = _.zip(morphemes, glosses_fr);
      }
      else {
        var orthography = sentence.orthography.split(' ');
        var glosses_fr = sentence.gloss_fr.split(' ');
        var pairs = _.zip(orthography, glosses_fr);
      }
      
      // var pairs = _.zip(orthography, glosses);
      // render one inline block div containing morpheme and gloss per word
      var glosses_fr = _(pairs).map(function(x, i){
        var alignment_ref = x[0];
        var gloss_fr = x[1];
        // return <div style={{display: "inline-block", marginRight: "5px"}} key={i}>{morpheme}<br/>{gloss_fr}</div>
        return <div style={{display: "inline-block", marginRight: "5px"}} key={i}><b>{alignment_ref}</b><br/>{gloss_fr}</div>
      }.bind(this)).value();
      gloss_fr = <span>{glosses_fr}<br/></span>;
    }

    // render utterance and translation
    return <div style={{marginBottom: "10px"}}>
      <b>{sentence.orthography}</b><br/>
      {/* {ipa} */}
      {gloss}
      {gloss_fr}
      {/* {<span>{sentence.translation}<br/></span>}
      {sentence.french} */}
      {lang_display}
    </div>
  }
});



//=========================Search Page===============================
var SearchPane = React.createClass({
  getInitialState: function() {
    return {
      sentence: {data: [], loaded: false},
      story: {data: [], loaded: false}
    };
  },

  //queue uploading of story and sentence data when this component is mounted
  componentDidMount: function() {
    story_data_promise.then(function(rawdata){
      this.setState({story:{data: rawdata.rows, loaded: true}});
    }.bind(this));

    sentence_data_promise.then(function(sentences){
      this.setState({sentence:{data: sentences, loaded: true}});
    }.bind(this));
  },

  //only ready to display story when story and sentence data have loaded
  loaded: function() {
    return this.state.story.loaded && this.state.sentence.loaded;
  },

  render_results: function(stories, results) {
    var results_per_story = _.reduce(results, function(acc, x) {
      var new_list = _.get(acc, x.key[0], []);
      new_list.push(x);
      acc[x.key[0]] = new_list;
      return acc;
    }, {})
    var rendered_results = _(_.toPairs(results_per_story)).map(
      function(x) {
        var story = x[0];
        var sentences = x[1];
        var rendered_sentences = _.map(sentences, function(x) {
          return <Sentence key={x.key}
                            sentence={x.value.sentence}
                            show_gloss={true} />
        });

        var storyname = _.get(_.filter(stories, function(x) {
          return x.key == story;
        }), '[0].value.name', 'UNKNOWN STORY');

        return <div key={story}>
          <b>Results from <Link to='Story' params={{key: story}}>{storyname}</Link> :</b>
          {rendered_sentences}
        </div>;
      }
    ).value();
    return rendered_results;
  },

  clearSkip : function() {
    UpdateQuery({'skip': 0});
  },

  render: function() {
    function matchesAnySentence(x) {
      return (
        x.value.sentence.translation.search(search_regex) != -1 ||
        x.value.sentence.gloss.search(search_regex) != -1 ||
        x.value.sentence.utterance.search(search_regex) != -1 ||
        x.value.sentence.morphemes.search(search_regex) != -1
      )
    }

    if (!this.loaded()) {
      return <div className="ui active dimmer">
        <div className="ui text loader">Loading</div>
      </div>;
    }
    var search_regex = new RegExp(this.props.search);
    var results = _.filter(this.state.sentence.data, matchesAnySentence);

    var skip = this.props.skip;
    var pagesize = this.props.limit;
    var length = results.length;

    pc = GetPaginationControls(skip, length, pagesize);

    results = _.take(_.drop(results, pc.skip), pagesize);

    var rendered_results;
    if (results.length > 0) {
        var rr = this.render_results(this.state.story.data,
                                                    results);
        rendered_results = <div>
          {pc.page_controls}
          {rr}
          {pc.page_controls}
        </div>
    } else {
        rendered_results = <div>
          No Matches Found.
        </div>
    }

    return (
      <div>
        <h1> </h1>
        <center>
          <SearchBox onGo={this.clearSkip}/>
        </center>
        {rendered_results}
      </div>
    );
  }
});

var SearchPage = React.createClass({
  render: function() {
    return (
      <UrlParameterExtractor defaults={{
        skip: 0,
        limit: 100,
        search: ''
      }}>
        <SearchPane />
      </UrlParameterExtractor>
    );
  }
});

//render page template using ReactRouter: https://github.com/rackt/react-router/blob/0.13.x/docs/guides/overview.md
var App = React.createClass({
  mixins: [Navigation, State],

  toggleLang: function() {
    global_show_french = !global_show_french;
    this.render();
  },
  displayLang: function() {
    curr = this.getPath();
    if (global_show_french) {
      if (curr == '/') {this.transitionTo('/FR');}  // switch on setup which defaults to EN
      else if (curr.slice(-3) != '/FR') {
        this.transitionTo(curr + '/FR');
      }
    }
    else {
      if (curr == '/FR') {this.transitionTo('/');}
      else if (curr.slice(-3) == '/FR') {
        this.transitionTo(curr.slice(0, -3));
      }
    }
  },
  componentDidMount: function() {
    $(React.findDOMNode(this.refs.glossingPopupActivator)).popup({
      hoverable: true,
      inline: true,
      position: 'bottom right',
    });
  },
  render: function() {
    // console.log('rendering')
    if (global_show_french) {
      homepage = 'HomepageFR'
      about = 'Page d’accueil'
      texts = 'TextsFR'
      texts_label = 'Textes'
      orthography = 'OrthographyFR'
      ortho_label = 'Orthographe'
      // dictionary = 'DictionaryFR'
      // search = 'SearchFR'
      gloss = 'GlossesFR'
      gloss_label = 'GlossingFR'
    }
    else {
      homepage = 'Homepage'
      about = 'About'
      texts = 'Texts'
      texts_label = 'Texts'
      orthography = 'Orthography'
      ortho_label = 'Orthography'
      // dictionary = 'Dictionary'
      // search = 'Search'
      gloss = 'Glosses'
      gloss_label = 'Glossing'
    }

    return <div className='ui main text container'> 
    <div className='ui borderless main menu fixed' styleName='position: fixed; top: 0px; left: auto; z-index: 1;'>
        <div className='ui text container'>
          {/* {console.log('making links')} */}
          <Link className='item' to={homepage} >{about}</Link> 
          <Link className='item' to={orthography} >{ortho_label}</Link>
          <Link className='item' to={texts} >{texts_label}</Link>
          <Link className='item' to='Dictionary' >Concordance</Link>
          {/* line below is for link checking, can remove */}
          {/* <Link className='item' to='Dictionary' >{this.getPath()}</Link> */} 
          <Link className='item' to='Search' >Search</Link>
          {/* added french toggle */}
          <div className='item'>
            <div className="ui slider checkbox">
            <input type="radio" name="toggle_lang" checked={global_show_french} onChange={this.toggleLang}> </input>
            
            <label>Français 🇫🇷</label>
            </div>
          </div>
      {/* <Link to={gloss} className='right item' ref='glossingPopupActivator'>{gloss_label}
          <i className="dropdown icon"></i>
      </Link> */}
          <Link className='item' to={gloss} >{gloss_label}</Link>
      {/* <div ref='glossingPopup' className='ui small popup bottom left transition hidden'>
          <div className='ui two column center aligned grid'>
            <div className='row'>
              <Link to={gloss}><div className='ui top attached button'>click for complete list</div></Link>
              </div>
            <div className='three wide column'>appl</div>
            <div className='thirteen wide column'>Applicative</div>
            <div className='three wide column'>clX</div>
            <div className='thirteen wide column'>Noun class X agreement</div>
            <div className='three wide column'>d</div>
            <div className='thirteen wide column'>Distal</div>
            <div className='three wide column'>comp</div>
            <div className='thirteen wide column'>Complementizer</div>
            <div className='three wide column'>cons</div>
            <div className='thirteen wide column'>Consecutive</div>
            <div className='three wide column'>dpc</div>
            <div className='thirteen wide column'>Dependent clause vowel</div>
            <div className='three wide column'>ipfv</div>
            <div className='thirteen wide column'>Imperfective</div>
            <div className='three wide column'>inf</div>
            <div className='thirteen wide column'>Infinitive</div>
            <div className='three wide column'>pass</div>
            <div className='thirteen wide column'>Passive</div>
            <div className='three wide column'>pfv</div>
            <div className='thirteen wide column'>Perfective</div>
            <div className='three wide column'>rtc</div>
            <div className='thirteen wide column'>Finite root clause vowel</div>
          </div>
        </div> */}
      </div>
    </div>
    <div className='ui borderless secondary menu' styleName='position: fixed; top: 0px; left: auto; z-index: 1;'>
      <div className='ui text container'>
        {/* <Link className='item' to='Homepage' >About</Link> 
        <Link className='item' to='Texts' >Texts</Link>
        <Link className='item' to='Dictionary' >Concordance</Link> */}
      </div>
    </div>
    <RouteHandler/>
    {/* {print('switching lang')} */}
    {this.displayLang()}
    </div>}
});


// set up routes for ReactRouter: https://github.com/rackt/react-router/blob/0.13.x/docs/guides/overview.md
// enables the single-page web app design
var routes = <Route handler={App}>
  <Route path = '/' handler={Homepage} name='Homepage' />
  <Route path = '/FR' handler={HomepageFR} name='HomepageFR' />

  <Route path = '/orthography' handler={Orthography} name='Orthography' />
  <Route path = '/orthography/FR' handler={OrthographyFR} name='OrthographyFR' />

  <Route path = '/text' handler={TextBox} name='Texts' />
  <Route path = '/text/FR' handler={TextBoxFR} name='TextsFR' />
  <Route path = '/text/story/:key' handler={StoryView} name='Story' />
  <Route path = '/text/story/:key/FR' handler={StoryViewFR} name='StoryFR' />

  <Route path = '/dict' handler={DictBox} name='Dictionary'>
    <Route path = '/dict'
            handler={DictView} name='Dict' />
    <Route path = '/dict/concordance/:morpheme/:definition'
            handler={ConcordanceView} name='Concordance' />

  <Route path = '/search' handler={SearchPage} name='Search' />
  <Route path = '/glosses' handler={Glosspage} name='Glosses' />
  <Route path = '/glosses/FR' handler={GlosspageFR} name='GlossesFR' />

  </Route>
</Route>
ReactRouter.run(
  routes, function(Handler) {
    React.render(<Handler/>, document.getElementById('content'))

  }
  );
