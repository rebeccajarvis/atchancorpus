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
  //toggles interlinear gloss or not
  toggleGloss: function() {
    var new_show_gloss = !this.state.show_gloss;
    var new_story_view = this.state.story_view;
    if(new_show_gloss) {
      new_story_view = false;
    }
    this.setState({show_gloss: new_show_gloss,
                    story_view: new_story_view});
  },
  //toggles story view
  toggleStoryView: function() {
    var new_show_gloss = this.state.show_gloss;
    var new_story_view = !this.state.story_view;
    // var new_french_view = this.state.french_view; // EDIT
    if(new_story_view) {
      new_show_gloss = false;
    }
    this.setState({show_gloss: new_show_gloss,
                    story_view: new_story_view,
                    french_view: global_show_french}); // EDIT
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
                              only_utterance="true" />
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
                    show_gloss={this.state.show_gloss}/>;
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
            <label>View Options</label>

            <div className="field">
              <div className="ui slider checkbox">
                <input type="radio" name="throughput" checked={this.state.show_gloss} onChange={this.toggleGloss}> </input>
                <label>Show Glosses</label>
              </div>
            </div>

            <div className="field">
              <div className="ui slider checkbox">
                <input type="radio" name="throughput" checked={this.state.story_view} onChange={this.toggleStoryView}> </input>
                <label>Story View</label>
              </div>
            </div>

            <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/fMIiQwCIzGQ?si=d3gMisqGeOdMJyw1" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
            </iframe>
          
          </div>
        </div>
        {sentences}
      </div>
    );

  }
});
