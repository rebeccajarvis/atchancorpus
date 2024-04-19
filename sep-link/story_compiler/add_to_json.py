import itertools
import json
import pathlib
import shutil
import os

# get path of this file
curr_path = pathlib.Path(__file__).parent.resolve()

# get files to add
to_add_path = os.path.join(curr_path, "to_add")
files_to_add = os.scandir(to_add_path)
# os.scandir.close()
added_stories_path = os.path.join(curr_path, "added_stories")

all_sentence_info = {}
all_sentence_info['total_rows'] = 0 # total number of sentences (all stories)
all_sentence_info['offset'] = 0
all_sentence_info['rows'] = [] # contains individual sentences

story_metas = {}
story_metas['total_rows'] = 0 # total number of stories
story_metas['rows'] = [] # story meta info

# [story].txt file setups
# english name
# french name
# performer/author
# [BEGIN SENTENCES]
# 0/line 1: ipa (export as ipa)
# 1/line 2: orthography (export as gloss)
# 2/line 3: en gloss
# 3/line 4: fr gloss
# 4/line 5: en trans
# 5/line 6: fr trans
# 6/line 7: timestamps

key = 0
sentence_id = 0
for filename in files_to_add:
    # story_info = {}
    # story_info['total_rows'] = 0
    # story_info['offset'] = 0
    # story_info['rows'] = []
    with open(filename) as f:
        name_en = f.readline()[:-1] # slice last character, which is \n
        name_fr = f.readline()[:-1]
        performer = f.readline()[:-1]

        meta = {"id": str(key), "key": str(key), "value":{"name": name_en,
                                                          "name_fr": name_fr,
                                                          "author": performer}}
        while True:
            # get lines in groups of 8 (last line is newline character)
            # first three lines are story names and performers
            group = list(itertools.islice(f, 8))
            
            if not group: # error checking
                break
            
            # cleaning: remove tab and newline characters
            group = [line.replace('\t', ' ').replace('\n', '') for line in group[:7]] 
            # print(group[0])
            sentence_info = {}
            sentence_info['id'] = str(sentence_id)
            sentence_info['key'] = [str(key), sentence_id, str(sentence_id)]
            # key: [story id, number(?), sentence id]
            s = {
              "judgement": "",
              "utterance": group[4],
              "morphemes": group[0],
              "orthography": group[1],
              "gloss": group[2],
              "gloss_fr": group[3],
              "translation": group[4],
              "french": group[5],
              "timestamps": group[6],
              "tags": "",
            #   "syntacticCategory": group[2],
              "syntacticTreeLatex": "",
              "validationStatus": "",
              "enteredByUser": "",
              "modifiedByUser": ""
            }
            sentence_info['value'] = {'story': str(key), 'sentence': s}

            all_sentence_info['total_rows'] += 1
            all_sentence_info['rows'].append(sentence_info)
            sentence_id += 1

    # all_sentence_info['total_rows'] += 1
    # all_sentence_info['rows'].append(story_info)
    
    key += 1
    story_metas['total_rows'] += 1
    story_metas['rows'].append(meta)

    shutil.move(filename.path, os.path.join(added_stories_path, filename.name))

with open('sentences.json', 'w', encoding='utf-8') as f:
    json.dump(all_sentence_info, f, ensure_ascii=False, indent=4)

with open('story_index.json', 'w', encoding='utf-8') as f:
    json.dump(story_metas, f, ensure_ascii=False, indent=4)