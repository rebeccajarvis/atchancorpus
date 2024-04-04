//Bottom of this doc sets up page structure and references components created above
import "pages/*.js"

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

// These are endpoints to load data from.
// Loaded from static files in the repository rather than from lingsync.

// Static file with sentences.
var sentence_url = 'super_sentences.json';

// Static file with stories.
var story_url = 'short_stories.json';

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
    var sentence = this.props.sentence;
    var french = this.props.french; // EDIT: french

    if (this.props.only_utterance) {
      return <div style={{marginBottom: "10px"}}>
        {sentence.utterance}
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
    
    // interlinear gloss alignment
    if (this.props.show_gloss) {
      var morphemes = sentence.morphemes.split(' ');
      var glosses = sentence.gloss.split(' ');
      var pairs = _.zip(morphemes, glosses);
      // render one inline block div containing morpheme and gloss per word
      var glosses = _(pairs).map(function(x, i){
        var morpheme = x[0];
        var gloss = x[1];
        return <div style={{display: "inline-block", marginRight: "5px"}} key={i}>{morpheme}<br/>{gloss}</div>
      }.bind(this)).value();
      gloss = <span>{glosses}<br/></span>;
    }

    // render utterance and translation
    return <div style={{marginBottom: "10px"}}>
      <b>{sentence.utterance}</b><br/>
      {gloss}
      {<span>{sentence.translation}<br/></span>}
      {sentence.french}
    </div>
  } // EDIT: sentence.translation to <span>{sentence.translation}<br/></span> to add french
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
    if (global_show_french) {
      homepage = 'HomepageFR'
      about = 'AboutFR'
      texts = 'TextsFR'
      orthography = 'OrthographyFR'
      // dictionary = 'DictionaryFR'
      // search = 'SearchFR'
    }
    else {
      homepage = 'Homepage'
      about = 'About'
      texts = 'Texts'
      orthography = 'Orthography'
      // dictionary = 'Dictionary'
      // search = 'Search'
    }

    return <div className='ui main text container'> 
    <div className='ui borderless main menu fixed' styleName='position: fixed; top: 0px; left: auto; z-index: 1;'>
        <div className='ui text container'>
          <Link className='item' to={homepage} >{about}</Link> 
          <Link className='item' to={orthography} >Orthography</Link>
          <Link className='item' to={texts} >{texts}</Link>
          <Link className='item' to='Dictionary' >Concordance</Link>
          {/* line below is for link checking, can remove */}
          {/* <Link className='item' to='Dictionary' >{this.getPath()}</Link> */} 
          <Link className='item' to='Search' >Search</Link>
          {/* added french toggle */}
          <div className='item'>
            <div className="ui slider checkbox">
            <input type="radio" name="toggle_lang" checked={global_show_french} onChange={this.toggleLang}> </input>
            
            <label>French 🇫🇷</label>
            </div>
          </div>
      <Link to='Glosses' className='right item' ref='glossingPopupActivator'>Glossing
          <i className="dropdown icon"></i>
      </Link>
      <div ref='glossingPopup' className='ui small popup bottom left transition hidden'>
          <div className='ui two column center aligned grid'>
            <div className='row'>
              <Link to='Glosses'><div className='ui top attached button'>click for complete list</div></Link>
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
        </div>
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
    {this.displayLang()}
    </div>}
});


// set up routes for ReactRouter: https://github.com/rackt/react-router/blob/0.13.x/docs/guides/overview.md
// enables the single-page web app design
var routes = <Route handler={App}>
  <Route path = '/' handler={Homepage} name='Homepage' />
  <Route path = '/FR' handler={HomepageFR} name='HomepageFR' />

  <Route path = '/orthography' handler={Orthography} name='Orthography' />
  {/* <Route path = '/orthography/FR' handler={OrthographyFR} name='OrthographyFR' /> */}

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

  </Route>
</Route>
ReactRouter.run(
  routes, function(Handler) {
    React.render(<Handler/>, document.getElementById('content'))

  }
  );