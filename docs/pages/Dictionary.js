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