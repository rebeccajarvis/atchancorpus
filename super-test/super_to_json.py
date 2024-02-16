import itertools
import json

filename = 'super-raw.tsv'
info = {}
info['total_rows'] = 0
info['offset'] = 0
info['rows'] = []

# line 1: morphemes
# line 2: gloss?
# line 3: category
# line 4: en
# line 5: fr
# line 6: notes (utterance in orthography)

sentence_id = 0

with open(filename) as f:
    while True:
        # get lines in groups of 7 (last line is newline character)
        group = list(itertools.islice(f, 7))
        if not group: # error checking
            break

        # cleaning: remove tab and newline characters
        group = [line.replace('\t', ' ').replace('\n', '') for line in group[:6]] 

        sentence_info = {}
        sentence_info['id'] = str(sentence_id)
        # TODO: currently hardcoding story id
        sentence_info['key'] = ['1', sentence_id, str(sentence_id)]
        # key: [story id, number(?), sentence id]
        # TODO: find out what second element is
        s = {
          "judgement": "",
          "utterance": group[5],
          "morphemes": group[0],
          "gloss": group[1],
          "translation": group[3],
          "french": group[4],
          "tags": "",
          "syntacticCategory": group[2],
          "syntacticTreeLatex": "",
          "validationStatus": "",
          "enteredByUser": "",
          "modifiedByUser": ""
        }
        sentence_info['value'] = {'story': '1', 'sentence': s}

        info['total_rows'] += 1
        info['rows'].append(sentence_info)
        sentence_id += 1


with open('super_sentences.json', 'w', encoding='utf-8') as f:
    json.dump(info, f, ensure_ascii=False, indent=4)